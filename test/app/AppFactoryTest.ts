import { ConfigHostModule } from '@nestjs/config/dist/config-host.module';

import { AppFactory, Application } from 'src/Lib';

describe('AppFactory', () => {
  it('RUN', async () => {
    const defaultDecorator = Application({});
    await expect(defaultDecorator(AppFactory)).resolves.not.toThrow();

    const decoratorWithOption = Application({
      port: 2000,
      imports: [ConfigHostModule],
    });
    await expect(decoratorWithOption(AppFactory)).resolves.not.toThrow();
  });
});
