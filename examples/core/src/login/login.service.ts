import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import {
  AuthService,
  ResponseService,
  MessageService,
  HashService,
  IUser,
  IUserType,
} from '@ait/nestjs-base';

@Injectable()
export class LoginService {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  logger = new Logger();

  async loginByEmail(
    loginDto: LoginDTO,
  ): Promise<{ token: string; refreshtoken: string }> {
    const admin = await this.usersService.findOneByEmail(loginDto.email, null, {
      withPassword: true,
    });

    if (!admin) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          [
            this.messageService.getErrorMessage(
              'email',
              'login.email.unregistered_email',
            ),
          ],
          'Bad Request',
        ),
      );
    }

    if (admin.is_active === false) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          [
            this.messageService.getErrorMessage(
              'email',
              'login.account.inactive',
            ),
          ],
          'Bad Request',
        ),
      );
    }

    const validate: boolean = await this.hashService.bcryptComparePassword(
      loginDto.password,
      admin.password,
    );
    if (!validate) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          [
            this.messageService.getErrorMessage(
              '',
              'login.password.invalid_password',
            ),
          ],
          'Bad Request',
        ),
      );
    }

    const dataToken: IUser = {
      id: admin.id,
      user_type: IUserType.Admin,
      level: null,
      permissions: [],
      role_id: admin.role_id,
    };
    if (admin.is_superadmin) {
      dataToken.user_type = IUserType.Superadmin;
    }

    return this.authService.generateToken(dataToken);
  }

  async refreshToken(user: IUser): Promise<string> {
    return this.authService.generateAccessToken(user);
  }
}
