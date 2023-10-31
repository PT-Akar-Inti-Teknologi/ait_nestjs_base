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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericSeeder = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
class GenericSeeder {
    /**
     * Getter entity meta data
     *
     * @return {EntityMetadata}
     */
    get metadata() {
        return this.dataSource.getMetadata(this.getDocumentType());
    }
    /**
     * Get repository of current document type
     *
     * @return {Repository<E>}
     */
    get repository() {
        return this.dataSource.getRepository(this.getDocumentType());
    }
    /**
     * Add dynamic clause base on defined entity column
     * and auto combine field and value as where clause
     * from list data with primary key
     *
     * @param builder {SelectQueryBuilder<E>}
     * @return {SelectQueryBuilder<E>}
     */
    buildClause(builder) {
        const combineColumn = this.lockedFields.join(' || ');
        const combineValues = this.getData().map((d) => this.lockedFields.map((c) => (0, lodash_1.get)(d, c)).join(''));
        return builder.where(`${combineColumn} IN (:...combineValues)`, {
            combineValues,
        });
    }
    /**
     * Implement boostrap to run seeder,
     * with validate data seeder is not exist
     * or when data seeder has been change
     */
    async onApplicationBootstrap() {
        try {
            const primaryColumn = this.metadata.primaryColumns[0].databaseName;
            /// just select primary_key for faster get
            const query = this.buildClause(this.repository
                .createQueryBuilder(this.getName())
                .select(`${primaryColumn} AS ${primaryColumn}`));
            const existIdSet = await query
                .getRawMany()
                .then((records) => records.map((r) => (0, lodash_1.get)(r, primaryColumn)))
                .then((ids) => new Set(ids));
            const saves = await this.repository.save(this.getData().filter((d) => !existIdSet.has(d[primaryColumn])));
            common_1.Logger.debug(`Total created ${this.getName()}: ${saves.length}`, this.getName());
            common_1.Logger.debug(`Successfully completed seeding ${this.getName()}...`, this.getName());
        }
        catch (error) {
            common_1.Logger.error(error.message, this.getName());
            throw error;
        }
    }
}
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", typeorm_1.DataSource)
], GenericSeeder.prototype, "dataSource", void 0);
exports.GenericSeeder = GenericSeeder;
//# sourceMappingURL=generic_seeder.js.map