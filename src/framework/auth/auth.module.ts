import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../../app/user/user.module";
import { AuthService } from "./auth.service";
import { jwtConstants } from './constants';
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expireTime }
        })
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy
    ],
    exports: [AuthService]
})

export class AuthModule { }