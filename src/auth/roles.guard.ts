import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
// Guard responsible for role-based access control
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the list of allowed roles for the current route handler or controller
    const allowedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, allow access by default
    if (!allowedRoles || allowedRoles.length === 0) return true;

    // Get the current request and extract the authenticated user
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If the user is not present or doesn't have an allowed role, deny access
    if (!user || !allowedRoles.includes(user.profile)) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }

    // Allow access
    return true;
  }
}
