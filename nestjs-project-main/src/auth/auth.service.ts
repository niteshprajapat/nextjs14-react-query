import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    private readonly JWT_SECRET = 'yourSecretKey';

    generateToken(payload: any): string {
        return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '1h' });
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
