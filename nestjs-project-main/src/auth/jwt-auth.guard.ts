import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token missing or malformed');
        } const token = authHeader.split(' ')[1];
        try {
            const decoded = this.authService.verifyToken(token);

            request.user = decoded; // Attach user data to the request
            return true;
        } catch (error) {
            console.error('Error verifying token:', error.message);
            throw new UnauthorizedException('Invalid token');
        }
    }

}
