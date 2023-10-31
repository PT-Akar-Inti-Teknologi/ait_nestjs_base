import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ResponseService } from '../../../response/response.service';
import { AdminsUserDocument } from '../entities/user.entity';
export declare class SuperAdminSeeder implements OnApplicationBootstrap {
    userRepository: Repository<AdminsUserDocument>;
    private readonly responseService;
    constructor(userRepository: Repository<AdminsUserDocument>, responseService: ResponseService);
    onApplicationBootstrap(): void;
    initSuperAdmins(): Promise<AdminsUserDocument[]>;
}
//# sourceMappingURL=superadmin.seeder.d.ts.map