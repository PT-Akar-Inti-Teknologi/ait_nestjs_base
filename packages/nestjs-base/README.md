## AIT NestJS Base

This library contains common utilities that can be used to kickstart nestjs projects

## 0.x Version

Refer to https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_base/tree/dev for old version docs.

## How to install

Starting from 1.0.16 and above, we will delete dist directory and use private jetbrains space repository for further development, for earlier version we will keep it here.

For modules that need user replication data module, please see to https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_replication_data

### 1.0.0 - 1.0.16

```
yarn add https://github.com/PT-Akar-Inti-Teknologi/ait-nestjs-base.git#tags/v1.0.16
```

### Authenticate Jetbrains Space

1. Ask AIT Team Devops to invite you to AIT jetbrains space. if already have access, skip to point no 3
2. Go to your email, find the invitation either in inbox or spam, click it. Proceed to register
3. Click your profile icon, then tap preferences. Click on authentication, personal tokens.
4. Click new personal token
5. Click add context, choose Project, akarinti
6. Find Package Repositories, make sure "Read package repositories" is active, then save
7. click create, copy the token, save it somewhere safe.
8. run `npm set //npm.pkg.github.com/:_authToken=<YOURTOKENHERE>`, replace `<YOURTOKENHERE>` with the token provided in no. 7
9. run `npm set "@pt-akar-inti-teknologi:registry=https://npm.pkg.github.com"`

### Add to package.json

Make sure you have run [Authenticate Jetbrains Space](#authenticate-jetbrains-space), then run this command:

```
yarn add @pt-akar-inti-teknologi/nestjs-base
```

## How to Use

Register modules that were used by your project in app.module.ts, then available service will be available globally to be injected in any of Feature classes. See in available modules below to know how to register.

## Generic Migration Guide from legacy Base folder

- install dependencies
- add modules to AppModules
- follow usage notes of each module, especially about AitMessageModule and AitDatabaseModule
- use vscode/IDE with regex search and replace, will use vscode syntax as guide.
- delete Base folder
- find: `'.*Base/(.*)'`, replace with `'@pt-akar-inti-teknologi/nestjs-base'`
- remove `MessageService` from module providers, by find and replace with these parameter:
  1. MessageService imports:
     - find: `import \{ MessageService \}.*;\n`
     - replace:
     - files to include: `*module.ts`
  2. MessageService with comma:
     - find: `MessageService,`
     - replace:
     - files to include: `*module.ts`
  3. MessageService without comma:
     - find: `MessageService`
     - replace:
     - files to include: `*module.ts`
- remote `ResponseService` from module providers, same as `MessageService`, just change the search parameters
- for `AdminsUserDocument` and `AdminsUsersService`, Permission/Replication please update import path to [@pt-akar-inti-teknologi/nestjs-replication-data](https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_replication_data)

## Available Modules

## AitAuthModule

Wrapper for @nestjs/passport, with @nestjs/jwt strategy. Used for issuing JWT token and validate JWT token.

### Setup AitAuthModule

Add this module in your `app.module.ts` imports.

```ts
AitAuthModule.register({
  jwtSecretKey: process.env.AUTH_JWTSECRETKEY,
  jwtExpirationTime: process.env.AUTH_JWTEXPIRATIONTIME,
  refreshJwtExpirationTime: process.env.AUTH_REFRESHJWTEXPIRATIONTIME,
  /** use [@pt-akar-inti-teknologi/nestjs-replication-data](https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_replication_data) or other strategy you want */
  jwtStrategy: {
    strategy: JwtStrategy,
    imports: [TypeOrmModule.forFeature([PermissionDocument])],
    providers: [AuthPermissionsService],
  },
  /** optional, default to IUserType.Superadmin when not filled */
  superadmin_role: IUserType.Superadmin
  /** optional, default to true. if true, will bypass permission checking when logged in as superadmin_role. can be overriden with `@SuperadminBypass(boolean)` decorator */
  superadmin_bypass: true
}),
```

### Usage AitAuthModule

- for verifying purpose, in non-auth service, use `@AuthJwtGuard()` decorator for any controller that you want to protect (must login)
  - for controller that needs certain permission use `@Permission('permission_name')` before adding AuthJwtGuard, when user's JWT doesn't contain `permission_name` permission, it will throw 403 error
- for issuing token purpose, create your own login feature, add `AuthService` to your feature's service.
  - when login function called, use `authService.generateToken` with User's profile, permissions, and additional datas,
  - when refresh token called, use `authService.generateAccessToken` containing current user JWT's data

## AitMessageModule

Wrapper to show error message, translated to selected fallback language, or dynamically detect language if using nest-i18n

### Setup AitMessageModule

Add this module in your `app.module.ts` imports.

#### Nest-i18n powered example:

```ts
AitMessageModule.register({
  useNestI18n: true,
  /// see setup config in https://nestjs-i18n.com/quick-start
  fallbackLanguage: process.env.APP_LANGUAGE,
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
    watch: true,
  },
  resolvers: [AcceptLanguageResolver],
}),
```

Note for this version:

- need to install `nestjs-i18n`
- you muse have translation json inside your src/i18n/
- also you must setup `nest-cli.json`, it should have this option

```ts
"compilerOptions": {
  "assets": [{ "include": "i18n/**/*", "watchAssets": true }]
}
```

#### Local ts file powered example:

```ts
AitMessageModule.register({
  useNestI18n: false,
  fallbackLanguage: process.env.APP_LANGUAGE,
  /// prefer use constant variable instead of direct key/value
  translations: {
    id: {
      key: 'terjemahan',
    },
    en: {
      key: 'translations',
    },
  }
}),
```

### Usage AitMessageModule

- Manually get translations for service error, inject your service using `MessageService`, it's available globally once AitMessageModule already setup. then use `get` or `getErrorMessage`
- Automatically translate DTO validation (only for useNestI18n mode). replace all your class-validator decorator reference using one provided by this service. for example.
  - Previous: `import { IsArray } from 'class-validator';`
  - After: `import { IsArray } from '@pt-akar-inti-teknologi/nestjs-base';`
- To use DTO validation translation, you should copy validation.json from translations folder provided [here](translations/) to your `src/i18n` folder.

## AitDatabaseModule

Module that configure 'default' TypeORM connection for base AIT microservices project, to make sure all replication data and entity can be defined properly.

### Setup AitDatabaseModule

Add this module in your `app.module.ts` imports.

```ts
AitDatabaseModule.register({
  /** does database entity need to be synchronized, prefer false on production, default true */
  dbSync: process.env.DB_SYNC != 'false',
  /** does database entity need to be reset each run, default false */
  dbDropSchema: process.env.DB_DROP_SCHEMA == 'true',
  /** does database need to be logged in console, default true */
  dbLogging: process.env.DB_LOGGING != 'false',
  /** does entities autoloaded when feature module use TypeOrmModule.forFeature, default to true */
  dbAutoloadEntities: process.env.DB_AUTOLOAD_ENTITIES != 'false',
  /** entities to be loaded when autoload_entities is not used */
  dbEntities: [],
  /** database host */
  dbHost: process.env.DB_HOST,
  /** database port */
  dbPort: Number(process.env.DB_PORT),
  /** database username */
  dbUsername: process.env.DB_USERNAME,
  /** database password */
  dbPassword: process.env.DB_PASSWORD,
  /** database name */
  dbName: process.env.DB_NAME,
  /** database table name prefix */
  dbTablePrefix: 'loyalties_',
}),
```

### Usage AitDatabaseModule

Add typeorm feature entity as usual in your feature module. example: `TypeOrmModule.forFeature([PermissionDocument])`

Note:

- do not add prefix manually in your entity definition.
- migrating existing `TypeOrmModule.forRoot` to use AitDatabaseModule need special care, if you add prefix in entity declaration before using this module then remove it due to this module dbTablePrefix, and have ManyToMany relation, search for the intermediate table generated by typeorm, and remove the column prefix manually. it will cause error if not, also make sure to **backup** your database before trying to migrate this.

## AitResponseModule

Provide service that can output AIT standard response JSON format.

### Setup AitResponseModule

Add this module in your `app.module.ts` imports.

```ts
AitResponseModule.register({
  /** will be used to build response code */
  projectName: process.env.PROJECT_NAME,
  /** will be used to build response code */
  serviceName: process.env.SERVICE_NAME,
}),
```

### Usage AitResponseModule

- inject `ResponseService` in your feature service. this will be available globally once AitResponseModule setup in app.module.ts.
- use `responseService.success` to build success response JSON.
- use `responseService.throwError` to build and throw error response JSON.

## AitStorageModule

Module that provides service with ability to upload file to certain file providers (firebase, s3, local).

### Setup AitStorageModule

Add this module in your `app.module.ts` imports.

```ts
AitStorageModule.register({
  driver: process.env.STORAGE_DRIVER as any,
  /// 's3' driver specific configs
  s3Key: process.env.STORAGE_S3_KEY,
  s3Secret: process.env.STORAGE_S3_SECRET,
  s3Bucket: process.env.STORAGE_S3_BUCKET,
  s3Region: process.env.STORAGE_S3_REGION,
  s3RootFolder: process.env.STORAGE_ROOT_FOLDER,
  /// 'firebase' driver specific configs
  firebaseInitOptions: {
    // see https://googleapis.dev/nodejs/storage/latest/Storage.html for reference.
    // if not filled, will use GOOGLE_APPLICATION_CREDENTIALS environment variable
  },
  firebaseBucket: process.env.STORAGE_FIREBASE_BUCKET,
  /// 'local' driver specific config
  localDir: proces.env.STORAGE_LOCAL_DIR
}),
```

### Usage AitStorageModule

- inject `StorageServices` in your feature service. this will be available globally once AitResponseModule setup in app.module.ts.
- use `uploadFile` function to upload file, with parameters `buffer`, `filename`, `path`

## AitHashModule

Module that provides service with ability to create and compare hashes based on bcrypt.

### Setup AitHashModule

Add this module in your `app.module.ts` imports.

```ts
AitHashModule.register({
  saltLength: Number(process.env.HASH_PASSWORDSALTLENGTH),
}),
```

### Usage AitHashModule

- inject `HashService` in your feature service. this will be available globally once AitResponseModule setup in app.module.ts.
- use `generateHashPassword` to generate hash
- use `bcryptComparePassword` to compare password with hash

## AitCommonModule

provide common http call implementation and broadcast data/message to another microservice. Previously known as CommonModule.

### Setup AitCommonModule

Add this module in your `app.module.ts` imports.

for Http broadcast engine:

```ts
AitCommonModule.register({
  broadcastType: 'http',
  /** automatically log created_by_id, updated_by_id, deleted_by_id for entities that implements AitBaseEntity, default false */
  autologUser: false, 
}),
```

for Kafka broadcast engine:

```ts
AitCommonModule.register({
  broadcastType: 'kafka',
  kafka: {
    brokers: [process.env.KAFKA_HOST],
    serviceName: process.env.PROJECT_NAME + '_' + process.env.SERVICE_NAME,
  },
  /** automatically log created_by_id, updated_by_id, deleted_by_id for entities that implements AitBaseEntity, default false */
  autologUser: false,
}),
```

### Usage

#### RequestContext Interceptor
add AitRequestContextInterceptor as global interceptor in main.ts
```ts
app.useGlobalInterceptors(
  // app.get(AuditTrailInterceptor),
  // ...
  app.get(AitRequestContextInterceptor),
);
```

you can use it by calling `AitRequestContext.currentContext?.context` or `AitRequestContext.currentUser`

Note:
if you have multiple JWT provider, you need to set UserCondition by calling `AitRequestContext.setUserCondition`, example:

```ts
  AitRequestContext.setUserCondition((user: IUserExtended) =>
    Object.values(EnumUserType).includes(user.user_type),
  );
```

#### Auto Log created_by_id, updated_by_id, deleted_by_id

- extend entity using AitBaseEntity
```ts
@Entity({ name: 'users' })
export class UserDocument extends AitBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
```
- add AitRequestContextInterceptor as global interceptor in main.ts
```ts
app.useGlobalInterceptors(
  // app.get(AuditTrailInterceptor),
  // ...
  app.get(AitRequestContextInterceptor),
);
```
- set autologUser when registering AitCommonModule to true
```ts
AitCommonModule.register({
  ...
  autologUser: true,
}),
```

#### Http call

postHttp, getHttp, deleteHttp is HttpService call wrapper.

#### Broadcast Consumer (Manual Handling)

inject CommonService to your controller, implements OnModuleInit, call commonService.listenBroadcasts and map it to your controller function. Example:

```ts
@Controller(BASE_PATH)
export class InternalController implements OnModuleInit {
  constructor(
    private readonly service: InternalService,
    private readonly commonService: CommonService,
  ) {}

  onModuleInit() {
    this.commonService.listenBroadcasts(
      Object.values(EntityName),
      'update',
      (entityName, data) => this.add(data),
    );
    this.commonService.listenBroadcasts(
      Object.values(EntityName),
      'delete',
      (entityName, data) => this.delete(data.id),
    );
  }

  add(data) {
    ...
  }

  delete(id) {
    ...
  }
}
```

if you want to use HTTP version, add and delete function must be the same path structure as InternalControllerBase. but the need of /:entityName can be hardcoded in controller path if the controller just handle 1 entity.

multiple entity controller:

```ts
@Post('/:entityName')
public async add(
  @Param('entityName') entityName: EntityName,
  @Body() param: Partial<BaseEntityInternal>,
): Promise<ResponseSuccessSingleInterface> {
  ...
}

@Delete('/:entityName/:id')
public async delete(
  @Param('entityName') entityName: EntityName,
  @Param('id') id: string,
): Promise<ResponseSuccessSingleInterface> {
  ...
}
```

single entity controller:

```ts
@Post()
public async add(
  @Body() param: Partial<BaseEntityInternal>,
): Promise<ResponseSuccessSingleInterface> {
  ...
}

@Delete(':id')
public async delete(
  @Param('id') id: string,
): Promise<ResponseSuccessSingleInterface> {
  ...
}
```

#### Broadcast Consumer (Auto Handling)

for http broadcast consumer, just use InternalControllerBase to extend your InternalController. for example:

```ts
@Controller(BASE_PATH)
export class InternalController extends InternalControllerBase<
  BaseEntityInternal,
  EntityName,
  InternalService
> {
  constructor(
    private readonly service: InternalService,
    private readonly commonService: CommonService,
  ) {
    super(service, commonService, EntityName);
  }
}
```

Explanation:
this will automatically setup internal CRUD endpoints, also adding capabilities to listen message broker version of broadcast listener (if used). EntityName is an enum containing which entity name you want to handle.

### Broadcast Publisher

To use as broadcast publisher, you can inject CommonService and use the method broadcastUpdate/broadcastDelete

Example:

```ts
this.commonService.broadcastUpdate(member, 'members');
```

Limitations: entity name should not contains dot (.)

Extras (Optional):
you can also setup concurrency number by using setupBroadcasts in OnModuleInit, but the drawback is there is no guarantee that the message will be processed synchronously in order the message are being sent

example:

```ts
@Injectable()
export class MembersService
  extends BaseService<CreateMemberDTO, UpdateMemberDTO, MemberDocument>
  implements OnModuleInit
{
  constructor(
    private readonly commonService: CommonService,
    ...
  ) {
  onModuleInit() {
    this.commonService.setupBroadcasts(['members'], 10);
  }
  ...
}
```
