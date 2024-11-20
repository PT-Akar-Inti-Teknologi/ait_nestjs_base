## AIT NestJS Audit Trail

This library contains schema and interceptor needed to add Audit trail functionality to your service.

## How to install

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
yarn add @pt-akar-inti-teknologi/nestjs-audit-trail
```

## How to Use

### Add mongooose package
Add @nestjs/mongoose package to your project then add it to your app.module.ts as imports. for example:

```ts
MongooseModule.forRoot(
  `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB_NAME}`,
  {
    user: process.env.MONGODB_USERNAME,
    pass: process.env.MONGODB_PASSWORD,
    // useCreateIndex: true,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  },
);
```

### Add AitAuditTrailModule
AitAuditTrailModule must be added as imports in your app.module.ts

```ts
AitAuditTrailModule.register({
  ignores: [/password/],
})
```

### Add AuditTrailInterceptor
Go to your main.ts, inside bootstrap function, add:
```ts
app.useGlobalInterceptors(app.get(AuditTrailInterceptor));
```

### Add AitAuditTrailWriterModule
Inside your feature modules, add AitAuditTrailWriterModule as your imports to add audit trail for certain database entities (document). For now, it only support typeorm entities.

### Auto Logging

just add it with similar content as TypeOrmModule.forFeature. duplicated entry throughout different feature is safe, will only be listened once.

Note: 
- this implementation only works currently for these methods:
  - repository.save: for "create" and "update" data
  - repository.softRemove: for "delete" data
- for other usage, please do [Manual Logging](#manual-logging)

For example:

```ts
AitAuditTrailWriterModule.forFeature([UserDocument]),
```

### Manual Logging
This is covered when you don't have access/need to optimize your query flow. you can use `AuditTrailContext.currentContext.logChanges`, for example:

- Creating:
```ts
AuditTrailContext.currentContext.logChanges({
  entityClass: UserEntity,
  current_value: {
    id: '1',
    name: 'B',
  },
});
```

- Updating:
```ts
AuditTrailContext.currentContext.logChanges({
  entityClass: UserEntity,
  old_value: {
    id: '1',
    name: 'A',
  },
  current_value: {
    id: '1',
    name: 'B',
  },
});
```

- Deleting:
```ts
AuditTrailContext.currentContext.logChanges({
  entityClass: UserEntity,
  old_value: {
    id: '1',
    name: 'A',
  }
});
```

### (Optional) Add your own controller
If you need to create endpoint to show list/detail of your audit trails, you can Use `AuditTrailService` that utilize `Model<AuditTrailDocument>`. if the service is not enough, create your own service that utilize `AuditTrailDocument`.

for example:
```ts
@Controller('api/v1/admins/audit-trail')
export class AuditTrailController {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Get()
  async findAll(@Query() getAuditTrailDTO: MainPagingDTO) {
    const result = await this.auditTrailService.findAll(getAuditTrailDTO);
    return this.responseService.successCollection(
      result.content,
      result.pagination,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditTrailService.getAndValidateById(id);
  }
}
```