import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
// Extends PassportStrategy to implement JWT authentication logic
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extracts the token from the Authorization header using Bearer scheme
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // If set to false, JWT expiration will be strictly enforced
      ignoreExpiration: false,

      // Secret key to validate the JWT signature (should be moved to .env file for security)
      secretOrKey: 'jwt_secret_key',
    });
  }

  /**
   * Validates and decodes the JWT payload.
   * This method is automatically called by Passport after verifying the token.
   * It attaches the returned object to the request (e.g., req.user).
   */
  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      profile: payload.profile,
    };
  }
}
