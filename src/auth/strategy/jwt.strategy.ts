import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadType } from "../types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, 
            secretOrKey: config.get<string>('JWT_SECRET'), 
        })
    }

    async validate(payload: PayloadType) {
        return { 
            userId: payload.userId, 
            email: payload.email, 
            role: payload.role 
        }
    }
}