import { createLogger } from 'bunyan';
import { merge } from 'lodash';
import { Injectable } from '@nestjs/common';

import { API } from '../../framework/utils/app.constant';

@Injectable({})
export class LoggerService {
    private Logger;
    constructor() {
        if (!this.Logger) {
            this.Logger = createLogger({
                name: API.NAME,
                level: process.env.LOG_LEVEL || 'debug'
            });
        }
    }

    log(data: any) {
        const { message, log } = this.formatMessage(data);
        this.Logger.info(log, message);
    }

    warn(data: any) {
        const { message, log } = this.formatMessage(data);
        this.Logger.warn(log, message);
    }

    error(data: any) {
        const { message, log } = this.formatMessage(data);
        this.Logger.error(log, message);
    }

    debug(data: any) {
        const { message, log } = this.formatMessage(data);
        this.Logger.debug(log, message);
    }

    formatMessage(data) {
        const message = data.message ? data.message : '';
        try { delete data.message; } catch (e) { }
        return {
            message,
            log: merge(data, { timestamp: new Date() })
        }
    }
}