import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IServiceProxy } from '../interfaces/service-proxy.interface';

/**
 * HTTP Implementation of Service Proxy
 * Used during development to forward requests to microservices
 *
 * To migrate to RabbitMQ:
 * 1. Create HttpProxyService.rabbitmq.ts
 * 2. Replace service providers in proxy.module.ts
 * 3. Update SERVICE_PROXY token to use RabbitMQ implementation
 */
@Injectable()
export class HttpProxyService implements IServiceProxy {
  constructor(private httpService: HttpService) {}

  async get<T = any>(url: string, config?: any): Promise<T> {
    try {
      const mergedConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'ngrok-skip-browser-warning': 'true',
        },
      };
      const response = await firstValueFrom(
        this.httpService.get<T>(url, mergedConfig),
      );
      return response.data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || error.message;
      throw new HttpException(`HTTP GET failed: ${message}`, status);
    }
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const mergedConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'ngrok-skip-browser-warning': 'true',
        },
      };
      const response = await firstValueFrom(
        this.httpService.post<T>(url, data, mergedConfig),
      );
      return response.data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || error.message;
      throw new HttpException(`HTTP POST failed: ${message}`, status);
    }
  }

  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const mergedConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'ngrok-skip-browser-warning': 'true',
        },
      };
      const response = await firstValueFrom(
        this.httpService.patch<T>(url, data, mergedConfig),
      );
      return response.data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || error.message;
      throw new HttpException(`HTTP PATCH failed: ${message}`, status);
    }
  }

  async delete<T = any>(url: string, config?: any): Promise<T> {
    try {
      const mergedConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'ngrok-skip-browser-warning': 'true',
        },
      };
      const response = await firstValueFrom(
        this.httpService.delete<T>(url, mergedConfig),
      );
      return response.data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || error.message;
      throw new HttpException(`HTTP DELETE failed: ${message}`, status);
    }
  }

  async stream(url: string, config?: any): Promise<any> {
    try {
      const mergedConfig = {
        ...config,
        responseType: 'stream',
        headers: {
          ...config?.headers,
          'ngrok-skip-browser-warning': 'true',
        },
      };
      // For streaming, we need the full response object
      const response = await firstValueFrom(
        this.httpService.get(url, mergedConfig),
      );
      return response;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || error.message;
      throw new HttpException(`HTTP STREAM failed: ${message}`, status);
    }
  }
}
