import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MessageService } from '../../../message/message.service';
import { ResponseService } from '../../../response/response.service';
import { AitAuthConfig } from '../interface/auth-config.interface';
import { JwtGuard } from './jwt.guard';

@Injectable()
export class JwtGuardV2 extends JwtGuard {
  constructor(
    responseService: ResponseService,
    messageService: MessageService,
    reflector: Reflector,
    config: AitAuthConfig,
  ) {
    super(responseService, messageService, reflector, config);
  }

  protected audiences: string[] = ['access_token'];
}
