import { AuthGuard } from '@nestjs/passport';
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
import { IUser, IUserType } from '../interface/user.interface';
import { TokenExpiredError } from 'jsonwebtoken';
import { MessageService } from '../../../response/service/message.service';
import { ResponseService } from '../../../response/service/response.service';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    private reflector: Reflector,
  ) {
    super();
  }

  private user_type_and_levels: string[];
  private permission: string;

  canActivate(context: ExecutionContext) {
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
    if (loggedInUser.user_type == IUserType.Superadmin) {
      console.log(
        '=================================SUPERADMIN=================================\n',
        new Date(Date.now()).toLocaleString(),
        '\n',
        'id superadmin : ' + loggedInUser.id,
        '\n=================================SUPERADMIN=================================',
      );
      return user;
    }
    if (
      //pengecekan user_type_and_level
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
    return user;
  }
}
