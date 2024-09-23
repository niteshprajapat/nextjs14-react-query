import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('MongoDBConnection');

    use(req: any, res: any, next: () => void) {
        mongoose.connection.on('connected', () => {
            this.logger.log('MongoDB connected');
        });

        mongoose.connection.on('error', (err) => {
            this.logger.error('MongoDB connection error:', err);
        });

        next();
    }
}
