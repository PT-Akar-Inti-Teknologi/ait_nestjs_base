## AIT NestJS Base
This library contains common utilities that can be used to kickstart nestjs projects

### How to install
```
yarn add https://github.com/PT-Akar-Inti-Teknologi/ait-nestjs-base.git#tags/v1.0.0
```

## How to Use
Register modules that were used by your project in app.module.ts, then available service will be available globally to be injected in any of Feature classes. See in available modules below to know how to register.

## Available Modules

## AitAuthModule
Wrapper for @nestjs/passport, with @nestjs/jwt strategy. Used for issuing JWT token and validate JWT token.

### Setup AitAuthModule
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
    dbEntities: ['dist/**/*.entity.ts', 'dist/**/**/*.entity.ts'],
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
    fallbackLanguage: process.env.APP_LANGUAGE,
    loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
    },
    resolvers: [AcceptLanguageResolver],
}),
```
Note: 
  - for this version, you muse have translation json inside your src/i18n/
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
TBD

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
TBD

## AitReplicationDataModule
TBD