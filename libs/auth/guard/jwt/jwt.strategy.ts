import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IUser } from '../interface/user.interface';
import { AuthPermissionsService } from '../../../replication-data/permissions/auth-permissions.service';
import { AitAuthConfig } from '../interface/auth-config.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authPermissionsService: AuthPermissionsService,
    aitAuthConfig: AitAuthConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: aitAuthConfig.jwtSecretKey,
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
