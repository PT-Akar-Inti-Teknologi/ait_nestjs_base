import { AdminsUsersService } from './admins-users.service';
import { ResponseService } from '../../response/response.service';
import { ResponseSuccessSingleInterface } from '../../response/response.interface';
import { SaveAdminsUserDTO } from './dto/save-admins-user.dto';
import { DeleteAdminsUserDTO } from './dto/delete-admins-user.dto';
export declare class AdminsUsersController {
    private readonly usersService;
    private readonly responseService;
    constructor(usersService: AdminsUsersService, responseService: ResponseService);
    save(saveAdminsUserDTO: SaveAdminsUserDTO): Promise<ResponseSuccessSingleInterface>;
    remove(deleteUserDTO: DeleteAdminsUserDTO): Promise<ResponseSuccessSingleInterface>;
}
//# sourceMappingURL=admins-users.controller.d.ts.map