## AIT NestJS Base

This library contains common utilities that can be used to kickstart nestjs projects

## 0.x Version

Refer to https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_base/tree/dev for old version docs.

## How to install

```
yarn add https://github.com/PT-Akar-Inti-Teknologi/ait-nestjs-base.git#tags/v1.0.14
```

For modules that need user replication data module, please see to https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_replication_data

## How to Use

Register modules that were used by your project in app.module.ts, then available service will be available globally to be injected in any of Feature classes. See in available modules below to know how to register.

## Generic Migration Guide from legacy Base folder

- install dependencies
- add modules to AppModules
- follow usage notes of each module, especially about AitMessageModule and AitDatabaseModule
- use vscode/IDE with regex search and replace, will use vscode syntax as guide.
- delete Base folder
- find: `'.*Base/(.*)'`, replace with `'@ait/nestjs-base'`
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
- for `AdminsUserDocument` and `AdminsUsersService`, Permission/Replication please update import path to [@ait/nestjs-replication-data](https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_replication_data)

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
  /** use [@ait/nestjs-replication-data](https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_replication_data) or other strategy you want */
  jwtStrategy: {
    strategy: JwtStrategy,
    imports: [TypeOrmModule.forFeature([PermissionDocument])],
    providers: [AuthPermissionsService],
  },
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
  - After: `import { IsArray } from '@ait/nestjs-base';`
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