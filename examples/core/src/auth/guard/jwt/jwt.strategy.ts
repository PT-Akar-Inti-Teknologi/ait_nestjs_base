import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthPermissionsService } from 'src/auth/auth-permissions.service';
import { IUser } from '@pt-akar-inti-teknologi/nestjs-base';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authPermissionsService: AuthPermissionsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH_JWTSECRETKEY,
    });
  }

  async validate(payload: IUser): Promise<IUser> {
    const roleDetail = await this.authPermissionsService.findOne(
      payload.role_id,
    );
    if (roleDetail) {
      payload.permissions = roleDetail.permissions ?? [];
    }
    return payload;
  }
}
