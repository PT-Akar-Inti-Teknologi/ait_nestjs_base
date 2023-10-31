"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const superadmins_data_1 = require("./superadmins.data");
const response_service_1 = require("../../../response/response.service");
const user_entity_1 = require("../entities/user.entity");
let SuperAdminSeeder = class SuperAdminSeeder {
    constructor(userRepository, responseService) {
        this.userRepository = userRepository;
        this.responseService = responseService;
    }
    onApplicationBootstrap() {
        this.initSuperAdmins();
    }
    async initSuperAdmins() {
        try {
            const ids = superadmins_data_1.dataSuperAdmins.map((superadmin) => superadmin.id);
            const existSuperAdmins = await this.userRepository
                .createQueryBuilder()
                .where('id IN (:...ids)', { ids })
                .getMany();
            const existIds = existSuperAdmins.map((superAdmin) => superAdmin.id);
            const newSuperAdmins = superadmins_data_1.dataSuperAdmins.filter((item) => !existIds.includes(item.id));
            const savedSuperAdmins = await this.userRepository.save(newSuperAdmins);
            common_1.Logger.debug('No. of Super Admin created : ' + savedSuperAdmins.length, this.constructor.name);
            common_1.Logger.debug('Successfuly completed seeding Super Admin...', this.constructor.name);
            return savedSuperAdmins;
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            this.responseService.throwError(error);
        }
    }
};
SuperAdminSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.AdminsUserDocument)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        response_service_1.ResponseService])
], SuperAdminSeeder);
exports.SuperAdminSeeder = SuperAdminSeeder;
//# sourceMappingURL=superadmin.seeder.js.map