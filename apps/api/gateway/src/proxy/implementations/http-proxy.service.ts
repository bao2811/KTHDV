import { Injectable } from '@nestjs/common';
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
      const response = await firstValueFrom(
        this.httpService.get<T>(url, config),
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `HTTP GET failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<T>(url, data, config),
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `HTTP POST failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch<T>(url, data, config),
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `HTTP PATCH failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async delete<T = any>(url: string, config?: any): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete<T>(url, config),
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `HTTP DELETE failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}
