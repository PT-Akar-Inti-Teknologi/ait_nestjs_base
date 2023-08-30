import { AuthPermissionsService } from './auth-permissions.service';
import { SavePermissionDTO } from './dto/save-permission.dto';
import { DeletePermissionDTO } from './dto/delete-permission.dto';
import { ResponseService } from '../../response/service/response.service';
import { ResponseSuccessSingleDTO } from '../../response/dto/response/response-success-single.dto';
export declare class AuthPermissionController {
    private readonly authPermissionsService;
    private readonly responseService;
    constructor(authPermissionsService: AuthPermissionsService, responseService: ResponseService);
    save(savePermissionDTO: SavePermissionDTO): Promise<ResponseSuccessSingleDTO>;
    delete(deletePermissionDTO: DeletePermissionDTO): Promise<ResponseSuccessSingleDTO>;
}
