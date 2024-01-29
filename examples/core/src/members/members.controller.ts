import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDTO } from './dto/create-member.dto';
import { UpdateMemberDTO } from './dto/update-member.dto';
import {
  AuthJwtGuard,
  BaseController,
  IUser,
  IUserType,
  MessageService,
  Permission,
  ResponseService,
  ResponseSuccessPaginationInterface,
  ResponseSuccessSingleInterface,
  User,
  UserType,
} from '@ait/nestjs-base';
import { MemberDocument } from './entities/member.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetMemberDTO, GetMemberPhotoDTO } from './dto/member.dto';
import { join } from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { randomUUID } from 'crypto';

@Controller('api/v1/core/members')
export class MembersController extends BaseController<
  CreateMemberDTO,
  UpdateMemberDTO,
  MemberDocument
> {
  constructor(
    private readonly membersService: MembersService,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
  ) {
    super(
      membersService,
      responseService,
      messageService,
      MembersController.name,
    );
  }

  private imagePath = '/upload/members/';

  @Get()
  @Permission('members.read')
  @AuthJwtGuard()
  async findAll(
    @Query() getMemberDTO: GetMemberDTO,
  ): Promise<ResponseSuccessPaginationInterface> {
    const result = await this.membersService.findAll(getMemberDTO);
    return this.responseService.successCollection(
      result.content,
      result.pagination,
    );
  }

  @Get('/my-profile')
  @UserType(IUserType.Customer)
  @AuthJwtGuard()
  async myProfile(
    @User() user: IUser,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.show(user.id);
  }

  @Get('/:id')
  @Permission('members.read')
  @AuthJwtGuard()
  async show(@Param('id') id: string): Promise<ResponseSuccessSingleInterface> {
    return this.show(id);
  }

  @Post()
  @Permission('members.create')
  @AuthJwtGuard()
  async save(
    @Body() createDTO: CreateMemberDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.save(createDTO);
  }

  @Put('/:id')
  @Permission('members.update')
  @AuthJwtGuard()
  async update(
    @Param('id') id: string,
    @Body() updateDTO: UpdateMemberDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.update(id, updateDTO);
  }

  @Delete('/:id')
  @Permission('members.delete')
  @AuthJwtGuard()
  async delete(
    @Param('id') id: string,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.delete(id);
  }

  @Post('upload-photo')
  @AuthJwtGuard()
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: {
        fileSize: 2 * 1024 * 1024, //2MB
      },
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSuccessSingleInterface> {
    try {
      const image = await this.membersService.saveImage(randomUUID(), file);

      return this.responseService.success(image);
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  @Get('photo/:filename')
  async getImage(
    @Param() getMemberPhotoDTO: GetMemberPhotoDTO,
    @Res() res: Response,
  ) {
    const filepath = join(
      process.cwd(),
      this.imagePath,
      getMemberPhotoDTO.filename,
    );

    try {
      if (!fs.existsSync(filepath)) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                'photo',
                'general.general.data_not_found',
              ),
            ],
            'Bad Request',
          ),
        );
      }

      res.sendFile(filepath);
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }
}
