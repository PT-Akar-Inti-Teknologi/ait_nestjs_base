import {
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { MessageService } from '../../../message/message.service';
import { ResponseService } from '../../../response/response.service';
import { AitAuthConfig } from '../interface/auth-config.interface';
import { IUser } from '../interface/user.interface';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
    protected reflector: Reflector,
    protected readonly config: AitAuthConfig,
  ) {
    super();
  }

  protected user_type_and_levels: string[];
  protected permission: string;
  protected superadminType: string;
  protected superadminBypass: boolean;
  protected audiences: string[] = [];

  canActivate(context: ExecutionContext) {
    this.superadminType = this.config.superadmin_role;
    this.superadminBypass =
      this.reflector.get<boolean>('superadmin_bypass', context.getHandler()) ??
      this.config.superadmin_bypass;

    this.user_type_and_levels =
      this.reflector.get<string[]>(
        'user_type_and_levels',
        context.getHandler(),
      ) ?? [];
    // jika menggunakan UserType() maka akan di set untuk semua level
    const user_types =
      this.reflector.get<string[]>('user_types', context.getHandler()) ?? [];
    user_types.forEach((element) => {
      this.user_type_and_levels.push(element + '.*');
    });
    const permissionsHandler = this.reflector.get<string[]>(
      'permission',
      context.getHandler(),
    );
    this.permission = permissionsHandler ? permissionsHandler[0] : null;

    return super.canActivate(context);
  }

  handleRequest(err: Error, user: any, info: Error) {
    const logger = new Logger();
    if (err) {
      throw new InternalServerErrorException(err);
    }
    const loggedInUser: IUser = user;

    this.checkIsLoggedIn(loggedInUser, info, logger);
    this.checkAudience(loggedInUser.aud, logger);

    if (this.checkSuperadmin(loggedInUser)) {
      console.log(
        '=================================SUPERADMIN=================================\n',
        new Date(Date.now()).toLocaleString(),
        '\n',
        'id superadmin : ' + loggedInUser.id,
        '\n=================================SUPERADMIN=================================',
      );
      return user;
    }

    this.checkPermission(loggedInUser, logger);
    return user;
  }

  protected checkSuperadmin(loggedInUser: IUser): boolean {
    return (
      this.superadminBypass && loggedInUser.user_type == this.superadminType
    );
  }

  protected checkPermission(loggedInUser: IUser, logger: Logger) {
    if (
      (this.user_type_and_levels.length &&
        !this.user_type_and_levels.includes(loggedInUser.user_type + '.*') &&
        !this.user_type_and_levels.includes(
          loggedInUser.user_type + '.' + loggedInUser.level,
        )) ||
      //pengencekan permission
      (this.permission && !loggedInUser.permissions.includes(this.permission))
    ) {
      logger.error(this.user_type_and_levels, '', this.constructor.name);
      logger.error(this.permission, '', this.constructor.name);
      logger.error(loggedInUser.permissions, '', this.constructor.name);
      logger.error('AuthJwtGuardError.Forbidden', '', this.constructor.name);
      throw new ForbiddenException(
        this.responseService.error(
          HttpStatus.FORBIDDEN,
          [
            this.messageService.getErrorMessage(
              'token',
              'auth.token.forbidden',
            ),
          ],
          'Forbidden Access',
        ),
      );
    }
  }

  protected checkIsLoggedIn(loggedInUser: IUser, info: Error, logger: Logger) {
    if (!loggedInUser) {
      let error_message = this.messageService.getErrorMessage(
        'token',
        'auth.token.invalid_token',
      );
      if (info instanceof TokenExpiredError) {
        error_message = this.messageService.getErrorMessage(
          'token',
          'auth.token.expired_token',
        );
      }

      logger.error('AuthJwtGuardError.Unauthorize', '', this.constructor.name);
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          [error_message],
          'Unauthorize',
        ),
      );
    }
  }

  protected checkAudience(audiences: string[], logger: Logger) {
    if (
      !!this.audiences.length &&
      this.audiences.every((value) => !audiences?.includes(value))
    ) {
      const error_message = this.messageService.getErrorMessage(
        'token',
        'auth.token.invalid_token',
      );

      logger.error('AuthJwtGuardError.Unauthorize', '', this.constructor.name);
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          [error_message],
          'Unauthorize',
        ),
      );
    }
  }
}
