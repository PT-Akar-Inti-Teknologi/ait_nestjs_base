# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.3](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-base@3.0.2...@ait/nestjs-base@3.0.3) (2024-07-22)


### Bug Fixes

* enable dynamic user interface IUserType ([565feac](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/commit/565feac35ffe7b7522609efbb58f1f5429e05862))





## [3.0.2](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-base@3.0.1...@ait/nestjs-base@3.0.2) (2024-07-19)


### Bug Fixes

* update outdated lib: @nestjs/axios,  @nestjs/config, @nestjs/mapped-types, class-validator, passport, reflect-metadata ([0ee5af1](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/commit/0ee5af12d2ac685ade243b7a0a7a69c8fade4f99))





## [3.0.1](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-base@3.0.0...@ait/nestjs-base@3.0.1) (2024-07-19)


### Bug Fixes

* update typeorm version ([b3f034b](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/commit/b3f034ba979b1f178e1a53eb9f87feff44a0c6ee))





# [3.0.0](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-base@2.1.0...@ait/nestjs-base@3.0.0) (2024-07-19)


### Code Refactoring

* update to nestjs 10 ([064ede1](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/commit/064ede1fcabe4430be83112712e177b32b8540e4))


### BREAKING CHANGES

* update all @nestjs/* to '^10.0.0', "@types/express": "^4.17.17", "@types/jest": "^29.5.2", "@types/node": "^20.3.1", "@types/supertest": "^6.0.0", "@typescript-eslint/eslint-plugin": "^7.0.0", "@typescript-eslint/parser": "^7.0.0", "eslint": "^8.42.0", "eslint-config-prettier": "^9.0.0", "eslint-plugin-prettier": "^5.0.0", "jest": "^29.5.0", "prettier": "^3.0.0", "ts-jest": "^29.1.0", "ts-loader": "^9.4.3", "tsconfig-paths": "^4.2.0", "typescript": "^5.1.3"





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
