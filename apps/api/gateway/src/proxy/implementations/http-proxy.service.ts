import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IServiceProxy } from '../interfaces/service-proxy.interface';

/**
 * HTTP Implementation of Service Proxy
 * Used during development to forward requests to microservices
 */
@Injectable()
export class HttpProxyService implements IServiceProxy {
  constructor(private httpService: HttpService) {}

  private handleError(error: any, method: string): never {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data;
      throw new HttpException(
        data || `HTTP ${method} failed with status ${status}`,
        status,
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new HttpException(
        `Service unavailable: No response from microservice during ${method}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new HttpException(
        `Proxy error during ${method}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
      this.handleError(error, 'GET');
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
      this.handleError(error, 'POST');
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
      this.handleError(error, 'PATCH');
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
      this.handleError(error, 'DELETE');
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
      const response = await firstValueFrom(
        this.httpService.get(url, mergedConfig),
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'STREAM');
    }
  }
}
