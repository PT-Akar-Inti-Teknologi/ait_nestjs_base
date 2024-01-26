import { IsNotEmpty, IsString } from 'class-validator';

export class VerificationTokenDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}
