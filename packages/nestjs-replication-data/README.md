## AIT NestJS Base

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

### Authenticate Jetbrains Space

1. Ask AIT Team Devops to invite you to AIT jetbrains space. if already have access, skip to point no 3
2. Go to your email, find the invitation either in inbox or spam, click it. Proceed to register
3. Click your profile icon, then tap preferences. Click on authentication, personal tokens.
4. Click new personal token
5. Click add context, choose Project, akarinti
6. Find Package Repositories, make sure "Read package repositories" is active, then save
7. click create, copy the token, save it somewhere safe.
8. run `npm set //npm.pkg.jetbrains.space/akarinti/p/main/npm/:_authToken=<YOURTOKENHERE>`, replace `<YOURTOKENHERE>` with the token provided in no. 7
9. run `npm set "@ait:registry=https://npm.pkg.jetbrains.space/akarinti/p/main/npm/"`

### Add to package.json
Make sure you have run [Authenticate Jetbrains Space](#authenticate-jetbrains-space), then run this command:

- Install [AIT base module](https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_base) (min. version 1.0.10), also follow the setup guide:
```
yarn add @ait/nestjs-base
```
- Install this module:
```
yarn add @ait/nestjs-replication-data
```

## How to Use

Register modules that were used by your project in app.module.ts, then available service will be available globally to be injected in any of Feature classes. See in available modules below to know how to register.

## Available Modules

## AitReplicationDataModule

Module that provide admin user and permission replication functionality to current microservice. It will define 2 controller that can be accessed using `${apiPrefix}/auth-permissions` and `${apiPrefix}/admins/users`

Note: this module is separated, and can be imported using @ait/nestjs-base/replication

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