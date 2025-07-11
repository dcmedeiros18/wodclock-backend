import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwt_secret_key', // mesmo usado no JwtModule
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      profile: payload.profile,
    };
  }
}
