import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Получаем роли из @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если роли не указаны - доступ разрешён
    if (!requiredRoles) {
      return true;
    }

    // Получаем user из request (после JWT Guard)
    const { user } = context.switchToHttp().getRequest();

    // Проверяем есть ли у user одна из требуемых ролей
    return requiredRoles.some((role) => user.role === role);
  }
}