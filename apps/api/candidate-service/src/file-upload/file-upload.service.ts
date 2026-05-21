import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import {
  BucketLocationConstraint,
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as Minio from 'minio';
import 'multer';

/**
 * File Upload Service
 * Handles CV and document uploads to an S3-compatible object store.
 * Local development can keep using MinIO, while production can point the
 * same client at Amazon S3 by changing only environment variables.
 */
@Injectable()
export class FileUploadService implements OnModuleInit {
  private storageBackend: 'minio' | 's3';
  private s3Client?: S3Client;
  private objectStoreClient?: Minio.Client;
  private objectStoreBucket: string;
  private objectStoreRegion: string;
  private shouldAutoCreateBucket: boolean;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    const configuredBackend = this.configService.get<string>('STORAGE_BACKEND');
    const rawEndpoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
    const normalizedEndpoint = rawEndpoint.replace(/^https?:\/\//, '');
    const explicitPort = this.configService.get('MINIO_PORT');
    const inferredSsl =
      rawEndpoint.startsWith('https://') || explicitPort === '443';
    const useSSL = this.getBooleanConfig('STORAGE_USE_SSL', inferredSsl);
    const defaultPort = useSSL ? 443 : 9000;
    const port = parseInt(explicitPort ?? `${defaultPort}`, 10);
    this.objectStoreBucket = this.configService.get(
      'MINIO_BUCKET_NAME',
      'cv-storage',
    );
    this.objectStoreRegion = this.configService.get(
      'STORAGE_REGION',
      'ap-southeast-1',
    );
    this.storageBackend =
      configuredBackend === 's3' || normalizedEndpoint.includes('amazonaws.com')
        ? 's3'
        : 'minio';
    const accessKey =
      this.configService.get<string>('MINIO_ACCESS_KEY') ??
      (this.storageBackend === 'minio' ? 'minioadmin' : undefined);
    const secretKey =
      this.configService.get<string>('MINIO_SECRET_KEY') ??
      (this.storageBackend === 'minio' ? 'minioadmin' : undefined);
    this.shouldAutoCreateBucket = this.getBooleanConfig(
      'STORAGE_AUTO_CREATE_BUCKET',
      this.storageBackend === 'minio',
    );

    if (this.storageBackend === 'minio') {
      this.objectStoreClient = new Minio.Client({
        endPoint: normalizedEndpoint,
        port,
        useSSL,
        accessKey,
        secretKey,
        region: this.objectStoreRegion,
      });
    }

    if (this.storageBackend === 's3') {
      const s3Endpoint = this.configService.get<string>('S3_ENDPOINT');
      const forcePathStyle = this.getBooleanConfig(
        'AWS_S3_FORCE_PATH_STYLE',
        false,
      );
      const credentials =
        accessKey && secretKey
          ? {
              accessKeyId: accessKey,
              secretAccessKey: secretKey,
            }
          : undefined;

      this.s3Client = new S3Client({
        region: this.objectStoreRegion,
        endpoint: s3Endpoint,
        forcePathStyle,
        credentials,
      });
    }
  }

  async onModuleInit() {
    // Auto-create is useful for local MinIO but should usually stay off for AWS.
    if (!this.shouldAutoCreateBucket) {
      return;
    }

    try {
      if (this.storageBackend === 's3' && this.s3Client) {
        await this.ensureS3Bucket();
        return;
      }

      const exists = await this.objectStoreClient!.bucketExists(
        this.objectStoreBucket,
      );
      if (!exists) {
        await this.objectStoreClient!.makeBucket(
          this.objectStoreBucket,
          this.objectStoreRegion,
        );
        console.log(`Created object storage bucket: ${this.objectStoreBucket}`);
      }
    } catch (error) {
      console.error('Object storage bucket initialization error:', error);
    }
  }

  private async ensureS3Bucket(): Promise<void> {
    if (!this.s3Client) {
      return;
    }

    try {
      await this.s3Client.send(
        new HeadBucketCommand({
          Bucket: this.objectStoreBucket,
        }),
      );
    } catch {
      const createCommand =
        this.objectStoreRegion === 'us-east-1'
          ? new CreateBucketCommand({
              Bucket: this.objectStoreBucket,
            })
          : new CreateBucketCommand({
              Bucket: this.objectStoreBucket,
              CreateBucketConfiguration: {
                LocationConstraint:
                  this.objectStoreRegion as BucketLocationConstraint,
              },
            });

      await this.s3Client.send(createCommand);
      console.log(`Created S3 bucket: ${this.objectStoreBucket}`);
    }
  }

  private getBooleanConfig(key: string, defaultValue: boolean): boolean {
    const value = this.configService.get<string>(key);
    if (value === undefined) {
      return defaultValue;
    }

    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
  }

  /**
   * Upload a file to object storage and persist only the object path.
   */
  async uploadFile(
    file: any,
    userId: number,
    type: 'cv' | 'avatar' | 'company-logo' = 'cv'
  ): Promise<{ fileUrl: string; fileName: string; fileType: string }> {
    if (!file) {
      throw new BadRequestException('File không được gửi');
    }

    // Validate file type
    const cvMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const avatarMimes = ['image/jpeg', 'image/png', 'image/webp'];
    
    const allowedMimes = type === 'cv' ? cvMimes : avatarMimes;

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        type === 'cv' ? 'Chỉ hỗ trợ file PDF hoặc DOCX' : 'Chỉ hỗ trợ file ảnh (JPG, PNG, WEBP)'
      );
    }

    // Validate file size (max 10MB for CV, 2MB for avatar)
    const maxSize = type === 'cv' ? 10 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(`File quá lớn (tối đa ${type === 'cv' ? '10MB' : '2MB'})`);
    }

    try {
      // Extract file extension
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      
      // Generate unique filename
      const timestamp = Date.now();
      const prefix =
        type === 'cv'
          ? 'resumes'
          : type === 'company-logo'
            ? 'company-logos'
            : 'avatars';
      const fileName = `${type}-${userId}-${timestamp}.${ext}`;
      const objectName = `${prefix}/${fileName}`;

      if (this.storageBackend === 's3' && this.s3Client) {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.objectStoreBucket,
            Key: objectName,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
      } else {
        await this.objectStoreClient!.putObject(
          this.objectStoreBucket,
          objectName,
          file.buffer,
          file.size,
          { 'Content-Type': file.mimetype },
        );
      }

      const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      return {
        fileUrl: objectName,
        fileName: originalname,
        fileType: ext.toUpperCase(),
      };
    } catch (error) {
      console.error('Object storage upload error details:', error);
      throw new InternalServerErrorException(`Lỗi tải file lên hệ thống: ${error.message}`);
    }
  }

  // Backwards compatibility for other callers
  async uploadCV(file: any, userId: number) {
    const res = await this.uploadFile(file, userId, 'cv');
    return {
      fileUrl: res.fileUrl,
      fileName: res.fileName,
      fileType: (res.fileType === 'PDF' ? 'PDF' : 'DOCX') as any
    };
  }

  async uploadAvatar(file: any, userId: number) {
    return this.uploadFile(file, userId, 'avatar');
  }

  async uploadCompanyLogo(file: any, userId: number) {
    return this.uploadFile(file, userId, 'company-logo');
  }

  /**
   * Get a presigned download URL for a stored object.
   */
  async getDownloadUrl(objectName: string): Promise<string> {
    try {
      const expirySeconds = parseInt(
        this.configService.get('STORAGE_PRESIGNED_EXPIRY_SECONDS', '3600'),
        10,
      );

      if (this.storageBackend === 's3' && this.s3Client) {
        return await getSignedUrl(
          this.s3Client,
          new GetObjectCommand({
            Bucket: this.objectStoreBucket,
            Key: objectName,
          }),
          { expiresIn: expirySeconds },
        );
      }

      return await this.objectStoreClient!.presignedGetObject(
        this.objectStoreBucket,
        objectName,
        expirySeconds,
      );
    } catch (error) {
      console.error('Object storage presigned URL error:', error);
      throw new InternalServerErrorException('Lỗi tạo link tải file');
    }
  }

  /**
   * Delete a stored object by its full object path.
   */
  async deleteFile(objectName: string): Promise<void> {
    try {
      if (this.storageBackend === 's3' && this.s3Client) {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.objectStoreBucket,
            Key: objectName,
          }),
        );
      } else {
        await this.objectStoreClient!.removeObject(
          this.objectStoreBucket,
          objectName,
        );
      }
      console.log(`Deleted file from object storage: ${objectName}`);
    } catch (error) {
      console.error('Object storage delete error:', error);
    }
  }

  /**
   * Get file stream from object storage
   */
  async getFileStream(resumeId: number): Promise<{ stream: any; fileName: string; contentType: string }> {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new NotFoundException('Không tìm thấy CV');
    }

    try {
      console.log(`Attempting to get object. Bucket: ${this.objectStoreBucket}, Path: ${resume.fileUrl}`);
      const stream =
        this.storageBackend === 's3' && this.s3Client
          ? (
              await this.s3Client.send(
                new GetObjectCommand({
                  Bucket: this.objectStoreBucket,
                  Key: resume.fileUrl,
                }),
              )
            ).Body
          : await this.objectStoreClient!.getObject(
              this.objectStoreBucket,
              resume.fileUrl,
            );
      const contentType = resume.fileType === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      return {
        stream,
        fileName: resume.fileName || 'cv.pdf',
        contentType,
      };
    } catch (error) {
      console.error('Object storage getObject error details:', error);
      throw new BadRequestException(`Storage Error: ${error.message}`);
    }
  }
}
