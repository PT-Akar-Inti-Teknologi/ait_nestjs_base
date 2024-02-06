# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.2](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-audit-trail@2.0.1...@ait/nestjs-audit-trail@2.0.2) (2024-02-06)

**Note:** Version bump only for package @ait/nestjs-audit-trail





## [2.0.1](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-audit-trail@2.0.0...@ait/nestjs-audit-trail@2.0.1) (2024-01-29)

**Note:** Version bump only for package @ait/nestjs-audit-trail





# [2.0.0](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/compare/@ait/nestjs-audit-trail@1.0.7...@ait/nestjs-audit-trail@2.0.0) (2024-01-29)


### Code Refactoring

* merge base function name with its main function ([6f72c3c](https://github.com-ait/PT-Akar-Inti-Teknologi/ait_nestjs_base/commit/6f72c3cd0dfd13176d4737952d92865cb0527a21))


### BREAKING CHANGES

* every calls to `this.base*` from base classes should be changed with `super.*`, for example `this.baseSave` to `super.save`. All private constructor of messageService and responseService should be protected, example: `protected readonly responseService`
