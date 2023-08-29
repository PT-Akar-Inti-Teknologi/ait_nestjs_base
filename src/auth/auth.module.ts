import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageService } from '../response/service/message.service';
import { ResponseService } from '../response/service/response.service';
import { JwtStrategy } from './guard/jwt/jwt.strategy';
import { HashService } from '../hash/hash.service';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: () => {
        return {
          secret: process.env.AUTH_JWTSECRETKEY,
          signOptions: {
            expiresIn: process.env.AUTH_JWTEXPIRATIONTIME,
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [
    MessageService,
    ResponseService,
    HashService,
    ConfigService,
    ConfigModule,
    JwtStrategy,
  ],
})
export class AuthModule {}
