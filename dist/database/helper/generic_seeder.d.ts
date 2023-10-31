import { OnApplicationBootstrap, Type } from '@nestjs/common';
import { DataSource, DeepPartial, EntityMetadata, Repository, SelectQueryBuilder } from 'typeorm';
export declare abstract class GenericSeeder<E extends object> implements OnApplicationBootstrap {
    protected readonly dataSource: DataSource;
    /** field that should not be changed by user, will be reset each time server restart */
    protected abstract readonly lockedFields: (keyof E)[];
    /**
     * Name to create alias or debug
     */
    abstract getName(): string;
    /**
     * Type of ORM entity
     */
    abstract getDocumentType(): Type<E>;
    /**
     * Seeder Data
     */
    abstract getData(): DeepPartial<E>[];
    /**
     * Getter entity meta data
     *
     * @return {EntityMetadata}
     */
    protected get metadata(): EntityMetadata;
    /**
     * Get repository of current document type
     *
     * @return {Repository<E>}
     */
    protected get repository(): Repository<E>;
    /**
     * Add dynamic clause base on defined entity column
     * and auto combine field and value as where clause
     * from list data with primary key
     *
     * @param builder {SelectQueryBuilder<E>}
     * @return {SelectQueryBuilder<E>}
     */
    protected buildClause(builder: SelectQueryBuilder<E>): SelectQueryBuilder<E>;
    /**
     * Implement boostrap to run seeder,
     * with validate data seeder is not exist
     * or when data seeder has been change
     */
    onApplicationBootstrap(): Promise<void>;
}
//# sourceMappingURL=generic_seeder.d.ts.map