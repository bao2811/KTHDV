import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as Minio from 'minio';
import 'multer';

/**
 * File Upload Service
 * Handles CV and document uploads to MinIO S3-compatible storage
 *
 * NOTE: Requires MinIO Docker container running
 * MinIO config:
 * - Endpoint: http://localhost:9000
 * - Access Key: minioadmin
 * - Secret Key: minioadmin
 */
@Injectable()
export class FileUploadService implements OnModuleInit {
  private minioClient: Minio.Client;
  private minioBucket: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    const endPoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
    const port = parseInt(this.configService.get('MINIO_PORT', '9000'), 10);
    const accessKey = this.configService.get('MINIO_ACCESS_KEY', 'minioadmin');
    const secretKey = this.configService.get('MINIO_SECRET_KEY', 'minioadmin');
    this.minioBucket = this.configService.get('MINIO_BUCKET_NAME', 'cv-storage');

    this.minioClient = new Minio.Client({
      endPoint,
      port,
      useSSL: false,
      accessKey,
      secretKey,
    });
  }

  async onModuleInit() {
    // Ensure bucket exists on startup
    try {
      const exists = await this.minioClient.bucketExists(this.minioBucket);
      if (!exists) {
        await this.minioClient.makeBucket(this.minioBucket, 'us-east-1');
        console.log(`Created MinIO bucket: ${this.minioBucket}`);
      }
    } catch (error) {
      console.error('MinIO bucket initialization error:', error);
    }
  }

  /**
   * Upload CV file to MinIO
   * Currently returns a mock URL for development
   *
   * In production, integrate with actual MinIO client:
   * npm install minio
   *
   * Example implementation:
   * const Minio = require('minio');
   * const minioClient = new Minio.Client({
   *   endPoint: this.minioEndpoint,
   *   port: 9000,
   *   useSSL: false,
   *   accessKey: this.minioAccessKey,
   *   secretKey: this.minioSecretKey,
   * });
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

      // Actual MinIO upload
      await this.minioClient.putObject(
        this.minioBucket,
        objectName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );

      const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      return {
        fileUrl: objectName,
        fileName: originalname,
        fileType: ext.toUpperCase(),
      };
    } catch (error) {
      console.error('MinIO upload error details:', error);
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
   * Get file download URL (Presigned)
   */
  async getDownloadUrl(objectName: string): Promise<string> {
    try {
      // Generate a presigned URL valid for 1 hour (3600 seconds)
      return await this.minioClient.presignedGetObject(
        this.minioBucket,
        objectName,
        3600,
      );
    } catch (error) {
      console.error('MinIO presigned URL error:', error);
      return ''; // Fallback or handle error
    }
  }

  /**
   * Delete file from MinIO
   */
  async deleteFile(objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.minioBucket, objectName);
      console.log(`Deleted file from MinIO: ${objectName}`);
    } catch (error) {
      console.error('MinIO delete error:', error);
    }
  }

  /**
   * Get file stream from MinIO
   */
  async getFileStream(resumeId: number): Promise<{ stream: any; fileName: string; contentType: string }> {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new NotFoundException('Không tìm thấy CV');
    }

    try {
      console.log(`Attempting to get object from MinIO. Bucket: ${this.minioBucket}, Path: ${resume.fileUrl}`);
      const stream = await this.minioClient.getObject(this.minioBucket, resume.fileUrl);
      const contentType = resume.fileType === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      return {
        stream,
        fileName: resume.fileName || 'cv.pdf',
        contentType,
      };
    } catch (error) {
      console.error('MinIO getObject error details:', error);
      throw new BadRequestException(`MinIO Error: ${error.message}`);
    }
  }
}
