## Nestjs Base Monorepo

This repository contains monorepo of Nestjs Base plugin libraries hosted at Jetbrains Space.

### List of Packages

Click on the link to open documentation of each package.

1. [AIT Nestjs Base](/packages/nestjs-base/README.md)
2. [AIT Nestjs Replication Data](/packages/nestjs-replication-data/README.md)

### How to develop
1. clone this repo
2. `yarn install`
3. `yarn bootstrap`
4. Now you can code any package

### How to add dependency from the same workspace
1. Open package.json
2. add workspace package name with available constraint to be able to use it.
   - for example, we have @ait/nestjs-base at v1.1.0
   - you can add the dependencies as `"@ait/nestjs-base": "^1.1.0"`
   - lower minor/patch version also works if using `^`. 
   - in this repo our rule is to have the same version for easier version management
3. Package that is being used must be built first (dist directory exist), use `yarn bootstrap` to do it. or `yarn build` at individual level of package
4. If still error reference not found in the IDE, restart TS server or restart the IDE.

### How to sync changes between package
This is useful for use case like, when you need to develop in a package and must validate in the other package, instead of using yarn build/bootstrap, use this method:
1. open terminal in root directory
2. run `yarn watch`
3. let it be opened as long as you're still working on this repo

### Coming soon
- Example directory, that will be used to host example nestjs for showcase and testing purpose