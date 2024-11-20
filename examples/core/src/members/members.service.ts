import { Injectable, Logger } from '@nestjs/common';
import {
  BaseService,
  CommonService,
  HashService,
  IFile,
  ListPaginationInterface,
  MessageService,
  PaginationInterface,
  ResponseService,
  StorageServices,
} from '@pt-akar-inti-teknologi/nestjs-base';
import { CreateMemberDTO } from './dto/create-member.dto';
import { UpdateMemberDTO } from './dto/update-member.dto';
import { MemberDocument } from './entities/member.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeleteResult, EntityManager, Repository } from 'typeorm';
import { MemberAddressDocument } from './entities/member-address.entity';
import { MembersAddressService } from './members-address/members-address.service';
import { GetMemberDTO } from './dto/member.dto';
import { removeAllFieldPassword } from '../utils/general.utils';

@Injectable()
export class MembersService extends BaseService<
  CreateMemberDTO,
  UpdateMemberDTO,
  MemberDocument
> {
  constructor(
    @InjectRepository(MemberDocument)
    public memberRepository: Repository<MemberDocument>,
    @InjectRepository(MemberAddressDocument)
    public memberAddressRepository: Repository<MemberAddressDocument>,
    private readonly memberAddressService: MembersAddressService,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
    @InjectEntityManager() private entityManager: EntityManager,
    private readonly commonService: CommonService,
    private readonly fileStorageService: StorageServices,
    private readonly hashService: HashService,
  ) {
    super(
      memberRepository,
      responseService,
      messageService,
      MembersService.name,
    );

    this.relations = [
      'members.addresses',
      'addresses.postal_code',
      'postal_code.city',
      'city.province',
      'province.country',
    ];
    this.tableAlias = 'members';
    this.searchByFields = [
      'members.name',
      'members.no_member',
      'members.email',
      'members.phone',
    ];
  }

  /**
   * This is an asynchronous function that finds all members based on certain criteria and returns them
   * with pagination information.
   * @param {GetMemberDTO} getMemberDTO - GetMemberDTO is an object that contains various filters and
   * pagination parameters for querying a list of members. The function `findAll` uses these parameters
   * to construct a query using TypeORM's QueryBuilder and returns a paginated list of MemberDocument
   * objects that match the specified filters. The pagination information is also included
   * @returns This function is returning a Promise that resolves to an object with two properties:
   * "content" and "pagination". The "content" property is an array of MemberDocument objects, and the
   * "pagination" property is an object with information about the pagination of the results, including
   * the current page, total number of results, and size of each page.
   */
  async findAll(
    getMemberDTO: GetMemberDTO,
  ): Promise<ListPaginationInterface<MemberDocument>> {
    try {
      const query = this.repository.createQueryBuilder(this.tableAlias);

      if (getMemberDTO.search) {
        query.where(
          new Brackets((qb) => {
            for (const fieldSearch of this.searchByFields) {
              qb.orWhere(`${fieldSearch} ilike :search`, {
                search: `%${getMemberDTO.search}%`,
              });
            }
          }),
        );
      }
      if (getMemberDTO.start_date) {
        query.andWhere(`${this.tableAlias}.created_at >= :date_start`, {
          date_start: getMemberDTO.start_date,
        });
      }
      if (getMemberDTO.end_date) {
        query.andWhere(`${this.tableAlias}.created_at <= :date_end`, {
          date_end: getMemberDTO.end_date,
        });
      }
      if (getMemberDTO.is_active !== undefined) {
        query.andWhere(`${this.tableAlias}.is_active = :is_active`, {
          is_active: getMemberDTO.is_active,
        });
      }
      if (getMemberDTO.order && getMemberDTO.sort) {
        let prefix = '';
        if (!getMemberDTO.sort.includes('.')) {
          prefix = `${this.tableAlias}.`;
        }
        query.orderBy(`${prefix}${getMemberDTO.sort}`, getMemberDTO.order);
      } else {
        query.orderBy(`${this.tableAlias}.created_at`, 'DESC');
      }
      query.take(getMemberDTO.size);
      query.skip(getMemberDTO.page * getMemberDTO.size);

      const result = await query.getManyAndCount();

      const pagination: PaginationInterface = {
        page: getMemberDTO.page,
        total: result[1],
        size: getMemberDTO.size,
      };
      return {
        content: result[0],
        pagination,
      };
    } catch (error) {
      this.logger.error(error.message);
      this.responseService.throwError(error);
    }
  }

  /**
   * This function saves a new member and their address to the database, while ensuring that the email
   * and phone number are unique and the postal code is valid.
   * @param {CreateMemberDTO} createDTO - It is a parameter of type CreateMemberDTO, which is an object
   * containing the data needed to create a new member.
   * @returns The `save` method is returning a `Promise` that resolves to a `MemberDocument` object.
   */
  async save(createDTO: CreateMemberDTO): Promise<MemberDocument> {
    try {
      await this.isUnique('email', createDTO.email);
      await this.isUnique('phone', createDTO.phone);
      if (createDTO.password) {
        createDTO.password = await this.hashService.generateHashPassword(
          createDTO.password,
        );
      }

      const createMember: Partial<MemberDocument> = Object.assign(
        {},
        createDTO,
      );
      createMember.no_member = await this.newNoMember();

      const createMemberAddress: Partial<MemberAddressDocument> = Object.assign(
        {},
        createDTO,
      );
      createMemberAddress.is_main = true;
      createMemberAddress.is_active = true;

      const member = await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          const member = await transactionalEntityManager.save(
            this.memberRepository.create(createMember),
          );
          createMemberAddress.member_id = member.id;

          const memberAddress = await transactionalEntityManager.save(
            this.memberAddressRepository.create(createMemberAddress),
          );

          member.addresses = [memberAddress];
          return member;
        },
      );
      removeAllFieldPassword(member);

      this.commonService.broadcastUpdate(member, 'members');
      return member;
    } catch (error) {
      Logger.error(error.message);
      this.responseService.throwError(error);
    }
  }

  /**
   * This is an async function that updates a member's information and address in a database
   * transaction.
   * @param {UpdateMemberDTO} updateDTO - an object containing the updated information for a member
   * @param {string} id - The ID of the member that needs to be updated.
   * @returns This function returns a Promise that resolves to a MemberDocument object.
   */
  async update(
    updateDTO: UpdateMemberDTO,
    id: string,
  ): Promise<MemberDocument> {
    try {
      await this.isUnique('email', updateDTO.email, id);
      await this.isUnique('phone', updateDTO.phone, id);
      await this.isUnique('no_member', updateDTO.no_member, id);

      const member = await this.getAndValidateById(id);

      if (updateDTO.password) {
        updateDTO.password = await this.hashService.generateHashPassword(
          updateDTO.password,
        );
      }

      const updateMember: MemberDocument = Object.assign(member, updateDTO);
      delete updateMember.addresses;

      const memberAddress =
        await this.memberAddressService.getAndValidateByField('member_id', id);
      const updateMemberAddress: MemberAddressDocument = Object.assign(
        memberAddress,
        updateDTO,
      );

      const updatedMember = await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          const member = await transactionalEntityManager.save(
            this.memberRepository.create(updateMember),
          );
          const memberAddress = await transactionalEntityManager.save(
            this.memberAddressRepository.create(updateMemberAddress),
          );

          member.addresses = [memberAddress];
          return member;
        },
      );
      removeAllFieldPassword(updatedMember);

      this.commonService.broadcastUpdate(updatedMember, 'members');
      return updatedMember;
    } catch (error) {
      Logger.error(error.message);
      this.responseService.throwError(error);
    }
  }

  public async baseDelete(id: string): Promise<DeleteResult> {
    try {
      await this.getAndValidateById(id);
      const result = this.repository.softDelete(id);
      this.commonService.broadcastDelete(id, 'members');
      return result;
    } catch (error) {
      this.logger.error(error.message);
      this.responseService.throwError(error);
    }
  }

  async newNoMember(): Promise<string> {
    try {
      const latestMember = await this.memberRepository
        .createQueryBuilder(this.tableAlias)
        .orderBy(`${this.tableAlias}.no_member`, 'DESC')
        .getOne();

      let latestNo = 0;
      if (latestMember) {
        latestNo = parseInt(
          latestMember.no_member.replace(MemberDocument.PREFIX_NO_MEMBER, ''),
        );
      }

      return (
        MemberDocument.PREFIX_NO_MEMBER + String(latestNo + 1).padStart(6, '0')
      );
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  /**
   * The function saves an image file to a specified folder in a file storage service and returns the key of the uploaded file.
   * @param {string} id - The `id` parameter is a string that represents the identifier of the merchant member.
   * @param image - The `image` parameter is of type `Express.Multer.File`.
   * @returns a Promise that resolves to a string.
   */
  public async saveImage(
    id: string,
    image: Express.Multer.File,
  ): Promise<string> {
    const mediaName = 'image.png';
    const bucketFolderPath =
      this.fileStorageService.getRootFolderName() + `/core/members/${id}`;
    const mediaFile: IFile = {
      buffer: image.buffer,
      filename: mediaName,
      path: bucketFolderPath,
    };
    const storageResponse = await this.fileStorageService.uploadFile(mediaFile);
    return storageResponse.key;
  }

  /**
   * Fetch detailed entity from the database and validate its existence
   * @param id - The id of the entity to be fetched
   * @returns - The fetched detailed entity
   */
  async getDetailAndValidateById(id: string): Promise<MemberDocument> {
    try {
      const detail = await super.getDetailAndValidateById(id);
      detail.photo = await this.fileStorageService.getPresignedUrl(
        detail.photo,
        false,
      );
      return detail;
    } catch (error) {
      this.logger.error(error.message);
      this.responseService.throwError(error);
    }
  }

  async findOneByEmail(email: string, id?: string): Promise<MemberDocument> {
    try {
      const query = this.memberRepository
        .createQueryBuilder('member')
        .addSelect('member.password')
        .where('email = :email', { email: email })
        .andWhere('deleted_at is null');
      if (id) {
        query.andWhere('id != :id', { id: id });
      }

      return query.getOne();
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }
}
