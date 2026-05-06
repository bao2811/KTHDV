import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
export class FileUploadService {
  private minioEndpoint: string;
  private minioAccessKey: string;
  private minioSecretKey: string;
  private minioBucket: string;

  constructor(private configService: ConfigService) {
    this.minioEndpoint = this.configService.get(
      'MINIO_ENDPOINT',
      'http://localhost:9000',
    );
    this.minioAccessKey = this.configService.get(
      'MINIO_ACCESS_KEY',
      'minioadmin',
    );
    this.minioSecretKey = this.configService.get(
      'MINIO_SECRET_KEY',
      'minioadmin',
    );
    this.minioBucket = this.configService.get('MINIO_BUCKET', 'recruitment');
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
      await Promise.resolve(); // Simulate async operation
      // Extract file extension
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      const fileType = ext === 'pdf' ? 'PDF' : 'DOCX';

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `cv-${userId}-${timestamp}.${ext}`;
      const objectName = `resumes/${fileName}`;

      // TODO: Implement actual MinIO upload
      // For now, return a mock S3-style URL
      const fileUrl = `${this.minioEndpoint}/${this.minioBucket}/${objectName}`;

      // In production:
      // await minioClient.putObject(
      //   this.minioBucket,
      //   objectName,
      //   file.buffer,
      //   file.size,
      //   { 'Content-Type': file.mimetype }
      // );

      return {
        fileUrl,
        fileName: file.originalname,
        fileType,
      };
    } catch (error) {
      console.error('MinIO upload error:', error);
      throw new InternalServerErrorException('Lỗi tải file lên hệ thống');
    }
  }

  /**
   * Get file download URL
   */
  getDownloadUrl(fileName: string): string {
    return `${this.minioEndpoint}/${this.minioBucket}/resumes/${fileName}`;
  }

  /**
   * Delete file from MinIO
   */
  deleteFile(objectName: string): void {
    try {
      // TODO: Implement actual MinIO delete
      // await minioClient.removeObject(this.minioBucket, objectName);
      console.log(`Deleted file: ${objectName}`);
    } catch (error) {
      console.error('MinIO delete error:', error);
      throw new InternalServerErrorException('Lỗi xóa file');
    }
  }
}
