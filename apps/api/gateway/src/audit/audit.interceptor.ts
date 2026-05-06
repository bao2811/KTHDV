import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

/**
 * AuditInterceptor automatically logs all mutating HTTP requests
 * (POST, PUT, PATCH, DELETE) per BR-6.4
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers, body } = request;

    // Only log mutating operations
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    // Determine action from HTTP method
    const actionMap: Record<string, string> = {
      POST: 'CREATE',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
    };

    const action = actionMap[method] || method;

    // Extract resource from URL path (e.g., /api/users/123 → users)
    const pathParts = url
      .replace(/^\/api\//, '')
      .split('/')
      .filter(Boolean);
    const resource = pathParts[0] || 'unknown';
    const resourceIdRaw = pathParts[1] || undefined;
    const resourceId = resourceIdRaw && !isNaN(Number(resourceIdRaw)) 
      ? parseInt(resourceIdRaw, 10) 
      : undefined;

    const userId = request.user?.id;
    const userAgent = headers['user-agent'];

    return next.handle().pipe(
      tap({
        next: () => {
          // Log after successful response
          this.auditService
            .log({
              userId,
              action,
              resource,
              resourceId,
              details: {
                method,
                url,
                body: this.sanitizeBody(body),
              },
              ipAddress: ip,
              userAgent,
            })
            .catch((err) => {
              // Don't let audit logging errors affect the response
              console.error('Audit log error:', err.message);
            });
        },
      }),
    );
  }

  /**
   * Remove sensitive fields from request body before logging
   */
  private sanitizeBody(body: any): any {
    if (!body) return null;

    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'refreshToken',
      'accessToken',
      'token',
      'secret',
    ];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
