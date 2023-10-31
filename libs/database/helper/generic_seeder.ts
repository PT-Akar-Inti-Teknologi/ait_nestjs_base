import { get } from 'lodash';
import { Inject, Logger, OnApplicationBootstrap, Type } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  EntityMetadata,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

export abstract class GenericSeeder<E extends object>
  implements OnApplicationBootstrap
{
  @Inject()
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
  protected get metadata(): EntityMetadata {
    return this.dataSource.getMetadata(this.getDocumentType());
  }

  /**
   * Get repository of current document type
   *
   * @return {Repository<E>}
   */
  protected get repository(): Repository<E> {
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
  protected buildClause(builder: SelectQueryBuilder<E>): SelectQueryBuilder<E> {
    const combineColumn = this.lockedFields.join(' || ');

    const combineValues = this.getData().map((d) =>
      this.lockedFields.map((c) => get(d, c)).join(''),
    );

    return builder.where(`${combineColumn} IN (:...combineValues)`, {
      combineValues,
    });
  }

  /**
   * Implement boostrap to run seeder,
   * with validate data seeder is not exist
   * or when data seeder has been change
   */
  public async onApplicationBootstrap() {
    try {
      const primaryColumn = this.metadata.primaryColumns[0].databaseName;

      /// just select primary_key for faster get
      const query = this.buildClause(
        this.repository
          .createQueryBuilder(this.getName())
          .select(`${primaryColumn} AS ${primaryColumn}`),
      );

      const existIdSet = await query
        .getRawMany()
        .then((records) => records.map((r) => get(r, primaryColumn)))
        .then((ids) => new Set(ids));

      const saves = await this.repository.save(
        this.getData().filter((d) => !existIdSet.has(d[primaryColumn])),
      );

      Logger.debug(
        `Total created ${this.getName()}: ${saves.length}`,
        this.getName(),
      );
      Logger.debug(
        `Successfully completed seeding ${this.getName()}...`,
        this.getName(),
      );
    } catch (error: any) {
      Logger.error(error.message, this.getName());

      throw error;
    }
  }
}
