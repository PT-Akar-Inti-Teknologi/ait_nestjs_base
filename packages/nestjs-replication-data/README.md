## AIT NestJS Replication Data

This library contains common utilities that can be used to kickstart nestjs projects

## How to install

Starting from 1.0.1 and above, we will delete dist directory and use private jetbrains space repository for further development, for earlier version we will keep it here.

### 1.0.0 - 1.0.1

- Install [AIT base module](https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_base) (min. version 1.0.10), also follow the setup guide:
```
yarn add https://github.com/PT-Akar-Inti-Teknologi/ait-nestjs-base.git#tags/v1.0.10
```
- Install this module:
```
yarn add https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_replication_data.git#tags/v1.0.1
```

### Authenticate Github NPM Package

1. Go to https://github.com/settings/tokens
2. Generate new token > Generate new token (classic)
3. give proper name, make sure to check read:packages
4. no expiration
5. Click generate token
6. copy generated token
7. run `npm set //npm.pkg.github.com/:_authToken=<YOURTOKENHERE>`, replace `<YOURTOKENHERE>` with the token provided in no. 6
8. run `npm set "@pt-akar-inti-teknologi:registry=https://npm.pkg.github.com"`

### Add to package.json
Make sure you have run [Authenticate Github NPM Package](#authenticate-github-npm-package), then run this command:

- Install [AIT base module](https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_base) (min. version 1.0.10), also follow the setup guide:
```
yarn add @pt-akar-inti-teknologi/nestjs-base
```
- Install this module:
```
yarn add @pt-akar-inti-teknologi/nestjs-replication-data
```

## How to Use

Register modules that were used by your project in app.module.ts, then available service will be available globally to be injected in any of Feature classes. See in available modules below to know how to register.

## Available Modules

## AitReplicationDataModule

Module that provide admin user and permission replication functionality to current microservice. It will define 2 controller that can be accessed using `${apiPrefix}/auth-permissions` and `${apiPrefix}/admins/users`

Note: this module is separated, and can be imported using @pt-akar-inti-teknologi/nestjs-base/replication

### Setup AitReplicationDataModule

Add [AitDatabaseModule](#aitdatabasemodule) (must fill dbTablePrefix) and this module in your `app.module.ts` imports. this module is semi coupled with [AitDatabaseModule](#aitdatabasemodule), except you can initialize TypeORM default connection with table prefix, that's also acceptable

```ts
AitReplicationDataModule.register({
  apiPrefix: 'api/v1/internal/loyalties',
}),
```

### Usage AitReplicationDataModule

- you can use it's entity (User/Permission) anywhere in your app.
- you can expose it so the real AdminService can broadcast the data to your microservice