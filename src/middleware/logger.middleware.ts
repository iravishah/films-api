import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

import { LoggerService } from '../framework/logger/logger.service';
const logger = new LoggerService();

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const log = {
            message: 'Request Log',
            method: req.method.toUpperCase(),
            query: req.query,
            params: req.params,
            'http.url': req.url,
            'http.status_code': res.statusCode,
            'http.method': req.method.toUpperCase(),
            'http.useragent': req.headers['user-agent'],
            'network.client.ip': req.ip,
            'network.bytes_read': req.headers['content-length'],
            'network.bytes_written': res.getHeader('content-length')
        }

        logger.log(log);
        next();
    }
}