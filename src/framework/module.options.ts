import { ConfigModuleOptions } from "@nestjs/config";
import * as path from "path";

export function loadConfig(): ConfigModuleOptions {
    return {
        envFilePath: path.join(__dirname, '../../', (process.env.NODE_ENV || 'development') + '.env'),
        load: [],
        expandVariables: true
    }
}