export interface AccessTemplateInterface {
  name: string;

  code: string;

  permissions: string[];

  sub_modules: AccessTemplateInterface[];
}
