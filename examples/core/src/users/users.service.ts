import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import {
  MessageService,
  ResponseService,
  HashService,
  AuthService,
  IUser,
  IUserType,
  CommonService,
} from '@pt-akar-inti-teknologi/nestjs-base';
import { CreateUserDTO } from './dto/create-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { GetUserDTO } from './dto/get-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDocument } from './entities/user.entity';
import { UserRolesService } from 'src/user-role/user-roles.service';
import { EmailService } from '@pt-akar-inti-teknologi/nest-notification';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { generateHtml } from 'src/utils/email-html';
import { SentMessageInfo } from 'nodemailer';
import { VerificationTokenDTO } from './dto/verification-token.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import {
  generateMessageChangeActiveEmail,
  generateMessageUrlForgotPasswordVerification,
  generateMessageUrlVerification,
  removeAllFieldPassword,
} from 'src/utils/general.utils';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserDocument)
    private readonly userRepository: Repository<UserDocument>,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserRolesService))
    private readonly userRoleService: UserRolesService,
    private readonly mailService: EmailService,
    private readonly hashService: HashService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    private readonly commonService: CommonService,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<UserDocument> {
    try {
      await this.getAndValidateUniqueEmail(createUserDTO.email);
      await this.userRoleService.getAndValidateById(createUserDTO.role_id);
      const userParam: Partial<UserDocument> = {
        ...createUserDTO,
        is_active: false,
        verification_token: randomUUID(),
      };
      userParam.password = await this.hashService.generateHashPassword(
        userParam.password,
      );
      const user = await this.userRepository.save(userParam);
      user.is_active = true;
      user.email_verified_at = new Date();
      await this.userRepository.save(user);
      this.sendEmailVerificationLink(user);
      this.broadcastUpdate(user.id);
      return user;
    } catch (error) {
      Logger.error(error, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async findAll(
    getUserDTO: GetUserDTO,
  ): Promise<{ list: UserDocument[]; count: number }> {
    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.is_superadmin = false');
      if (getUserDTO.search) {
        query.andWhere(
          '( user.first_name ilike :search OR user.last_name ilike :search )',
          {
            search: `%${getUserDTO.search}%`,
          },
        );
      }
      if (getUserDTO.is_active !== undefined) {
        query.andWhere(' user.is_active = :is_active ', {
          is_active: getUserDTO.is_active,
        });
      }
      if (getUserDTO.role_ids) {
        query.andWhere('user.role_id IN (:...role_ids)', {
          role_ids: getUserDTO.role_ids,
        });
      }
      if (getUserDTO.order && getUserDTO.sort) {
        let prefix = '';
        if (!getUserDTO.sort.includes('.')) {
          prefix = 'user.';
        }
        query.orderBy(`${prefix}${getUserDTO.sort}`, getUserDTO.order);
      } else {
        query.orderBy('user.created_at', 'DESC');
      }
      query.take(getUserDTO.size);
      query.skip(getUserDTO.page * getUserDTO.size);

      const result = await query.getManyAndCount();
      return {
        list: result[0],
        count: result[1],
      };
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async findOneByEmail(
    email: string,
    id?: string,
    options: {
      withPassword?: boolean;
    } = {},
  ): Promise<UserDocument> {
    try {
      const { withPassword = false } = options;
      const query = this.userRepository.createQueryBuilder('user');
      query
        .where('email = :email', { email: email })
        .andWhere('deleted_at is null');
      if (withPassword) {
        query.addSelect('user.password');
      }
      if (id) {
        query.andWhere('id != :id', { id: id });
      }

      return query.getOne();
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  /**
   * The function `getIdsByName` retrieves the IDs of users whose first name or last name matches a given name.
   * @param {string} name - The `name` parameter is a string that represents the name of the user you want to search for.
   * @returns The function `getIdsByName` returns a Promise that resolves to an array of strings.
   */
  async getIdsByName(name: string): Promise<string[]> {
    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .select('user.id')
        .where(
          '( user.first_name ilike :search OR user.last_name ilike :search )',
          {
            search: `%${name}%`,
          },
        );

      const users = await query.getMany();
      return users.map((user: UserDocument) => user.id);
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async update(userId: string, updateUserDTO: UpdateUserDTO) {
    try {
      const user = await this.getAndValidate(userId);
      if (updateUserDTO.role_id) {
        user.role = await this.userRoleService.getAndValidateById(
          updateUserDTO.role_id,
        );
      }
      if (user.email != updateUserDTO.email) {
        await this.getAndValidateUniqueEmail(updateUserDTO.email, userId);
        user.verification_token = randomUUID();
        this.sendEmailChangeActiveEmail(user);
      }
      Object.assign(user, updateUserDTO);
      if (updateUserDTO.password) {
        user.password = await this.hashService.generateHashPassword(
          updateUserDTO.password,
        );
      }

      this.broadcastUpdate(user.id);
      return this.userRepository.save(user);
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async remove(
    userId: string,
    deleteUserDTO: DeleteUserDTO,
  ): Promise<UpdateResult> {
    try {
      const entity = await this.getAndValidate(userId);
      await this.userRepository.softRemove(entity);
      return {
        generatedMaps: [],
        raw: [],
        affected: 1,
      } as any;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async myProfile(userId: string): Promise<UserDocument> {
    try {
      const admin = await this.getAndValidate(userId);
      removeAllFieldPassword(admin);

      return admin;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async sendVerificationLink(userId: string): Promise<UserDocument> {
    try {
      const user = await this.getAndValidate(userId);
      this.sendEmailVerificationLink(user);
      return user;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
    try {
      let user = await this.getAndValidateByEmail(forgotPasswordDTO.email);
      user.verification_token = randomUUID();
      user = await this.userRepository.save(user);
      this.sendEmailForgotPasswordVerficationLink(user);
      return user;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  /**
   * This function sends an email verification link to a user.
   * @param {UserDocument} user - The user parameter is a document object representing a user in the
   * application. It contains information such as the user's first name, last name, email, and
   * verification token.
   * @returns a Promise that resolves to a SentMessageInfo object, which contains information about the
   * email message that was sent.
   */
  async sendEmailVerificationLink(
    user: UserDocument,
  ): Promise<SentMessageInfo> {
    try {
      const url = `${process.env.BASE_CMS}/cms/auth/create-password?t=${user.verification_token}`;
      const content = await generateMessageUrlVerification(
        `${user.first_name} ${user.last_name}`,
        url,
      );
      const body = generateHtml(content);
      return this.mailService.send(
        user.email,
        'Verifikasi Email',
        body,
        null,
        null,
        null,
      );
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async sendEmailForgotPasswordVerficationLink(
    user: UserDocument,
  ): Promise<SentMessageInfo> {
    try {
      const url = `${process.env.BASE_CMS}/cms/auth/create-password?t=${user.verification_token}`;
      const content = await generateMessageUrlForgotPasswordVerification(
        `${user.first_name} ${user.last_name}`,
        url,
      );
      const body = generateHtml(content);
      return this.mailService.send(
        user.email,
        'Verifikasi Email Forgot Password',
        body,
        null,
        null,
        null,
      );
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async sendEmailChangeActiveEmail(
    user: UserDocument,
  ): Promise<SentMessageInfo> {
    try {
      const content = generateMessageChangeActiveEmail(
        `${user.first_name} ${user.last_name}`,
      );
      const body = generateHtml(content);
      return this.mailService.send(
        user.email,
        'Email Updated',
        body,
        null,
        null,
        null,
      );
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async validationToken(
    verificationTokenDTO: VerificationTokenDTO,
  ): Promise<{ token: string; refreshtoken: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { verification_token: verificationTokenDTO.token },
      });
      if (!user) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                'token',
                'user.token.invalid',
              ),
            ],
            'Bad Request',
          ),
        );
      }

      const dataToken: IUser = {
        id: user.id,
        user_type: IUserType.Admin,
        level: null,
        permissions: [],
        role_id: user.role_id,
      };

      return this.authService.generateToken(dataToken);
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async resetPassword(
    resetPasswordDTO: ResetPasswordDTO,
    userId: string,
  ): Promise<UserDocument> {
    try {
      let user: UserDocument = await this.getAndValidate(userId);
      if (resetPasswordDTO.password) {
        user = await this.getAndValidateUserPassword(
          userId,
          resetPasswordDTO.password,
        );
        if (resetPasswordDTO.password === resetPasswordDTO.new_password) {
          throw new BadRequestException(
            this.responseService.error(
              HttpStatus.BAD_REQUEST,
              [
                this.messageService.getErrorMessage(
                  'new_password',
                  'user.password.same_as_old_password',
                ),
              ],
              'Bad Request',
            ),
          );
        }
      }
      user.password = await this.hashService.generateHashPassword(
        resetPasswordDTO.new_password,
      );
      user.email_verified_at = new Date();
      user.verification_token = null;
      user.is_active = true;

      removeAllFieldPassword(user);
      this.broadcastUpdate(user.id);
      return this.userRepository.save(user);
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  // VALIDATION ====================================

  async getAndValidate(
    userId: string,
    options: {
      withPassword?: boolean;
    } = {},
  ): Promise<UserDocument> {
    try {
      const { withPassword = false } = options;
      const query = this.userRepository.createQueryBuilder('user');
      if (withPassword) {
        query.addSelect('user.password');
      }
      const user = await query
        .where('user.id = :userId', { userId: userId })
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('role.permissions', 'permissions')
        .getOne();
      if (!user) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                'user_id',
                'user.id.not_found',
              ),
            ],
            'Bad Request',
          ),
        );
      }
      return user;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async getAndValidateByIds(userIds: string[]): Promise<UserDocument[]> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id IN(:...userIds)', { userIds })
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('role.permissions', 'permissions')
        .getMany();
      if (!users.length) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                'user_id',
                'user.id.not_found',
              ),
            ],
            'Bad Request',
          ),
        );
      }

      const existIds = users.map((user) => user.id);
      const notResigterd = userIds.filter((id) => !existIds.includes(id));
      Logger.error(
        `${notResigterd.length} User not registered : ${notResigterd} `,
        '',
        this.constructor.name,
      );

      return users;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async getAndValidateByEmail(
    email: string,
    id?: string,
  ): Promise<UserDocument> {
    try {
      const user = await this.findOneByEmail(email, id);
      if (!user) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                'email',
                'general.general.email_not_found',
              ),
            ],
            'Bad Request',
          ),
        );
      }

      return user;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async getAndValidateUniqueEmail(
    email: string,
    id?: string,
  ): Promise<UserDocument> {
    try {
      const user = await this.findOneByEmail(email, id);
      if (user) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                'email',
                'user.email.already_used',
              ),
            ],
            'Bad Request',
          ),
        );
      }

      return user;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async getAndValidateUserPassword(
    userId: string,
    password: string,
  ): Promise<UserDocument> {
    try {
      const user = await this.getAndValidate(userId, { withPassword: true });

      const validate: boolean = await this.hashService.bcryptComparePassword(
        password,
        user.password,
      );
      if (!validate) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                'password',
                'user.password.invalid_password',
              ),
            ],
            'Bad Request',
          ),
        );
      }

      return user;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async broadcastUpdate(user_id: string): Promise<void> {
    try {
      const user = await this.getAndValidate(user_id);
      await this.commonService.broadcastUpdate(user, 'admins-users');
    } catch (error) {
      Logger.error(error, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }
}
