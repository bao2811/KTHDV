import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // In a microservice behind a gateway, the user object might be directly on the request
    // from the JWT guard or passed as a header (but here we assume JWT guard populated it)
    if (!user) {
      throw new ForbiddenException('Không tìm thấy thông tin người dùng trong request');
    }
    if (!user.role) {
      throw new ForbiddenException(`Thông tin role bị thiếu trong token. User: ${JSON.stringify(user)}`);
    }

    const userRoleName = typeof user.role === 'string' ? user.role : user.role?.name;
    const hasRole = requiredRoles.includes(userRoleName);

    if (!hasRole) {
      throw new ForbiddenException(
        `Quyền truy cập bị từ chối. Role yêu cầu: [${requiredRoles.join(', ')}]. Role của bạn: "${userRoleName}". Payload: ${JSON.stringify(user)}`,
      );
    }

    return true;
  }
}
