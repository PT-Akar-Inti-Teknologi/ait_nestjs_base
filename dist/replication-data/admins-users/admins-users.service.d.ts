import { Repository } from 'typeorm';
import { SaveAdminsUserDTO } from './dto/save-admins-user.dto';
import { AdminsUserDocument } from './entities/user.entity';
import { BaseService } from '../../abstract-base/service/service.base';
import { ResponseService } from '../../response/response.service';
import { MessageService } from '../../message/message.service';
import { AuthPermissionsService } from '../permissions/auth-permissions.service';
export declare class AdminsUsersService extends BaseService<SaveAdminsUserDTO, null, AdminsUserDocument> {
    private readonly adminUserRepository;
    private readonly authPermissionService;
    private readonly responseService;
    private readonly messageService;
    constructor(adminUserRepository: Repository<AdminsUserDocument>, authPermissionService: AuthPermissionsService, responseService: ResponseService, messageService: MessageService);
    save(createDTO: SaveAdminsUserDTO): Promise<AdminsUserDocument>;
    getAndValidateByIds(ids: string[]): Promise<AdminsUserDocument[]>;
}
//# sourceMappingURL=admins-users.service.d.ts.map