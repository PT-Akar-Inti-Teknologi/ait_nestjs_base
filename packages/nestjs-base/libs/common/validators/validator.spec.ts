import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  validate,
} from 'class-validator';
import { IsUnique } from './is-unique.validator';
import { plainToClass } from 'class-transformer';
import { Match } from './match.validator';
import { IsExists } from './is-exists.validator';
import { maskPwd } from '../../utils/string-utils';

describe('Custom Validator Test Case', () => {
  const repo: any = {
    countBy: () => jest.fn().mockReturnValue(0),
    count: () => jest.fn(),
  };

  describe('IsUnique Decorator', () => {
    class NotUniqueDTO {
      @IsEmail()
      @IsUnique('email', repo, undefined, {
        message: ({ value }) => `User with email '${value}' already registered`,
      })
      email: string;
    }

    it('should return not unique error', async () => {
      const payload: NotUniqueDTO = {
        email: 'test@mail.com',
      };

      jest.spyOn(repo, 'countBy').mockImplementation(() => Promise.resolve(1));

      const object = plainToClass(NotUniqueDTO, payload);
      const validates = await validate(object);

      expect(validates).toHaveLength(1);
      expect(validates[0]).toMatchObject({
        target: expect.anything(),
        property: 'email',
        children: [],
        constraints: {
          IsUnique: `User with email '${payload.email}' already registered`,
        },
      });
    });

    class UpdateUserDTO {
      @IsNumber()
      id: number;

      @IsEmail()
      @IsUnique('email', repo, 'id', {
        message: ({ value }) => `User with email '${value}' already registered`,
      })
      email: string;
    }

    it('should passed the given validation, cause id is same with payload email', async () => {
      const payload: UpdateUserDTO = {
        email: 'test@mail.com',
        id: 2,
      };

      const users = [
        {
          id: 1,
          email: 'test@mail.id',
        },
        {
          id: 2,
          email: 'test@mail.com',
        },
        {
          id: 3,
          email: 'test@mail.org',
        },
      ];

      jest.spyOn(repo, 'countBy').mockImplementation(() => {
        const result = users.filter(
          (user) => user.email === payload.email && user.id !== payload.id,
        ).length;

        return Promise.resolve(result);
      });

      const object = plainToClass(UpdateUserDTO, payload);
      const validates = await validate(object);

      expect(validates).toHaveLength(0);
    });
  });

  describe('Match Decorator', () => {
    class ChangePasswordDTO {
      @IsString()
      @IsNotEmpty()
      password: string;

      @Match('password')
      confirm_password: string;
    }

    it('should return validation error cause confirmation_password is not match', async () => {
      const payload: ChangePasswordDTO = maskPwd({
        drowssap: 'drowssap',
        confirm_drowssap: 'drowssap123',
      });

      const object = plainToClass(ChangePasswordDTO, payload);
      const validates = await validate(object);

      expect(validates).toHaveLength(1);
      expect(validates[0].property).toEqual('confirm_password');
      expect(validates[0].constraints).toMatchObject({
        Match: `confirm_password doesn't match`,
      });
    });
  });

  describe('IsExists Decorator', () => {
    class CreateUserDTO {
      @IsInt()
      @IsNotEmpty()
      @IsExists('id', repo, undefined, {
        message: `Role is not exists`,
      })
      role_id: number;

      @IsString()
      fullname: string;

      @IsEmail()
      email: string;
    }

    it('should return error role not exists', async () => {
      const payload: CreateUserDTO = {
        email: 'test@mail.com',
        fullname: 'taufik rahadi',
        role_id: 1,
      };

      jest.spyOn(repo, 'count').mockImplementation(() => Promise.resolve(0));

      const object = plainToClass(CreateUserDTO, payload);
      const validates = await validate(object);

      expect(validates).toHaveLength(1);
      expect(validates[0].property).toEqual('role_id');
      expect(validates[0].constraints).toMatchObject({
        IsExists: 'Role is not exists',
      });
    });
  });
});
