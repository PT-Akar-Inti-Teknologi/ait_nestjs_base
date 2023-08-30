import { Repository, UpdateResult } from 'typeorm';
import { PermissionDocument } from './entities/permission.entity';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { SavePermissionDTO } from './dto/save-permission.dto';
import { ResponseService } from '../../response/service/response.service';
import { MessageService } from '../../response/service/message.service';
import { PaginationRequestDTO } from '../../crud/dto/request/pagination-request.dto';
export declare class AuthPermissionsService {
    private readonly permissionRepository;
    private readonly messageService;
    private readonly responseService;
    constructor(permissionRepository: Repository<PermissionDocument>, messageService: MessageService, responseService: ResponseService);
    save(savePermissionDTO: SavePermissionDTO): Promise<PermissionDocument>;
    findOne(roleId: string): Promise<PermissionDocument>;
    findAll(getPermissionDTO: PaginationRequestDTO): Promise<{
        list: PermissionDocument[];
        count: number;
    }>;
    update(roleId: string, updatePermissionDTO: UpdatePermissionDTO): Promise<PermissionDocument>;
    remove(roleId: string): Promise<UpdateResult>;
    getAndValidate(roleId: string): Promise<PermissionDocument>;
}
