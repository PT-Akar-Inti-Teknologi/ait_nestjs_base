## Nestjs Base Monorepo

This repository contains monorepo of Nestjs Base plugin libraries hosted at Jetbrains Space.

### List of Packages

Click on the link to open documentation of each package.

1. [AIT Nestjs Base](/packages/nestjs-base/README.md)
2. [AIT Nestjs Replication Data](/packages/nestjs-replication-data/README.md)

### Commit Rule
Every commit should use this rule: https://www.conventionalcommits.org/en/v1.0.0-beta.4/
This will affect CHANGELOG.md for each package when publishing and version increment.

- "BREAKING CHANGES" will increase major version
- "feat" will increase minor version
- "fix" will increase patch version

### How to develop
1. clone this repo
2. `yarn install`
3. `yarn bootstrap`
4. Now you can code any package

### How to add dependency from the same workspace
1. Open package.json
2. add workspace package name with available constraint to be able to use it.
   - for example, we have @pt-akar-inti-teknologi/nestjs-base at v1.1.0
   - you can add the dependencies as `"@pt-akar-inti-teknologi/nestjs-base": "^1.1.0"`
   - lower minor/patch version also works if using `^`. 
   - in this repo our rule is to have the same version for easier version management
3. Package that is being used must be built first (dist directory exist), use `yarn bootstrap` to do it. or `yarn build` at individual level of package
4. If still error reference not found in the IDE, restart TS server or restart the IDE.

### How to sync changes between package
This is useful for use case like, when you need to develop in a package and must validate in the other package, instead of using yarn build/bootstrap, use this method:
1. open terminal in root directory
2. run `yarn watch`
3. let it be opened as long as you're still working on this repo

### How to publish package update
1. make sure you are on main branch
2. make sure no pending/broken features
3. make sure you have write access to jetbrains space
4. run `yarn lerna publish`
5. all of package changes should be commited (and pushed) as a new commit and there are version tags
6. packages new version should already be published

### Example Projects
You can try to start nestjs service to deep dive analyzing the implementation of these plugins.

- Core: most of the function will be used here
- Listener: side effect testing of Core service, such as listen user and member data changes for replication