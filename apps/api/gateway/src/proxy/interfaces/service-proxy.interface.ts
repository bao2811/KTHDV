/**
 * Abstract interface for service proxy
 * Allows easy migration from HTTP to RabbitMQ/gRPC/etc
 *
 * Implementation layers:
 * - HTTP: Direct HTTP calls (development)
 * - RabbitMQ: Message queue (production)
 * - gRPC: Protocol Buffers (optional)
 */

export interface IServiceProxy {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
}
