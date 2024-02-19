# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-base@2.0.2...@ait/nestjs-base@2.1.0) (2024-02-19)


### Features

* **base:** add organization_id in IUser ([1c421e3](https://github.com/PT-Akar-Inti-Teknologi/ait_nestjs_base/commit/1c421e34774568ac73235abb1108229ebc042ba7))





## [2.0.2](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-base@2.0.1...@ait/nestjs-base@2.0.2) (2024-02-06)


### Bug Fixes

* change "service" from BaseController to be protected ([04f8e74](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/commit/04f8e744ab602bf8da663e303fce2ef1bf765871))





## [2.0.1](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-base@2.0.0...@ait/nestjs-base@2.0.1) (2024-01-29)


### Bug Fixes

* remove base from findDetailAll ([5f693b9](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/commit/5f693b95208c1f7536055444e95792120f1684c5))





# [2.0.0](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-base@1.1.0...@ait/nestjs-base@2.0.0) (2024-01-29)


### Code Refactoring

* merge base function name with its main function ([6f72c3c](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/commit/6f72c3cd0dfd13176d4737952d92865cb0527a21))


### BREAKING CHANGES

* every calls to `this.base*` from base classes should be changed with `super.*`, for example `this.baseSave` to `super.save`. All private constructor of messageService and responseService should be protected, example: `protected readonly responseService`





## 1.1.0 (2024-01-24)

**Note:** First stable version
