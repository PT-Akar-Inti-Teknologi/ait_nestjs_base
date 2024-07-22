import { Module, DynamicModule, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AitAuthConfig } from './guard/interface/auth-config.interface';
import { IUserType } from './guard';

@Global()
@Module({})
export class AitAuthModule {
  static register(config: AitAuthConfig): DynamicModule {
    const providers = [];
    const imports = [];
    const exports = [];
    if (config.jwtStrategy) {
      providers.push(config.jwtStrategy.strategy);
      if (config.jwtStrategy.providers)
        providers.push(...config.jwtStrategy.providers);
      if (config.jwtStrategy.imports)
        imports.push(...config.jwtStrategy.imports);
      if (config.jwtStrategy.exports)
        exports.push(...config.jwtStrategy.exports);
    }
    if (!config.superadmin_role) {
      config.superadmin_role = IUserType.Superadmin;
    }
    return {
      module: AitAuthModule,
      imports: [
        HttpModule,
        JwtModule.register({
          secret: config.jwtSecretKey,
          signOptions: {
            expiresIn: config.jwtExpirationTime,
          },
        }),
        ...imports,
      ],
      controllers: [],
      exports: [AuthService, ...exports],
      providers: [
        {
          provide: AitAuthConfig,
          useValue: config,
        },
        AuthService,
        ...providers,
      ],
    };
  }
}
