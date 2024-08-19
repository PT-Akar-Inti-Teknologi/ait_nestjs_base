import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { IUserType } from './guard';
import { AitAuthConfig } from './guard/interface/auth-config.interface';

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
    if (!config.superadmin_bypass) {
      config.superadmin_bypass = true;
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
      exports: [AuthService, AitAuthConfig, ...exports],
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
