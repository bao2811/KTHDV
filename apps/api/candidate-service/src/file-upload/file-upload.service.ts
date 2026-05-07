import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  constructor(private configService: ConfigService) {
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
  async uploadCV(
    file: any,
    userId: number,
  ): Promise<{ fileUrl: string; fileName: string; fileType: 'PDF' | 'DOCX' }> {
    if (!file) {
      throw new BadRequestException('File không được gửi');
    }

    // Validate file type
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Chỉ hỗ trợ file PDF hoặc DOCX');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File quá lớn (tối đa 10MB)');
    }

    try {
      // Extract file extension
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      const fileType = ext === 'pdf' ? 'PDF' : 'DOCX';

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `cv-${userId}-${timestamp}.${ext}`;
      const objectName = `resumes/${fileName}`;

      // Actual MinIO upload
      await this.minioClient.putObject(
        this.minioBucket,
        objectName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );

      // We store the object name in the DB, not the full URL, 
      // because we'll generate presigned URLs for viewing
      return {
        fileUrl: objectName, // Store object name as the "URL" reference
        fileName: file.originalname,
        fileType,
      };
    } catch (error) {
      console.error('MinIO upload error details:', error);
      throw new InternalServerErrorException(`Lỗi tải file lên hệ thống: ${error.message}`);
    }
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
      // We don't necessarily want to crash the whole request if delete fails, 
      // but we log it.
    }
  }
}
