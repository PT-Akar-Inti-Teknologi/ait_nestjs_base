import { Readable } from 'stream';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { StorageService, UploadResponseDTO } from 'src/Lib';

describe('StorageService', () => {
  const testTimeout = 120000;

  const prefix = 'test';
  const fileContent = 'Hello world!';

  function streamToString(stream: Readable) {
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => reject(err));
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  /**
   * Run every test start to override storage driver
   */
  async function loadStorage(driver: string): Promise<StorageService> {
    const builder = Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [StorageService],
    });

    process.env.STORAGE_DRIVER = driver;

    return (await builder.compile()).get<StorageService>(
      StorageService,
    ) as StorageService;
  }

  ['s3', 'firebase', 'local'].forEach((driver) => {
    let storageResponse: UploadResponseDTO;

    it(`Test Import ${driver} StorageServices should not "undefined"`, async () => {
      expect(await loadStorage(driver)).not.toBeUndefined();
    });

    describe(`Test Upload File ${driver}`, () => {
      const iFile = {
        buffer: Buffer.from(fileContent, 'utf-8'),
        filename: 'Hello.txt',
        path: prefix,
      };

      it(`Create IFile with buffer from "${fileContent}"`, () => {
        expect(Promise.resolve(iFile)).resolves.not.toBeUndefined();
      });

      it(
        `Submit to storage ${prefix}`,
        async () => {
          const storageServices = await loadStorage(driver);

          try {
            await storageServices.uploadFile(null as any);
          } catch (e) {
            expect(e).not.toBeUndefined();
          }

          const response = storageServices.uploadFile(iFile);

          await expect(response).resolves.not.toBeUndefined();

          storageResponse = await response;
        },
        testTimeout,
      );
    });

    describe(`Test Get File ${driver}`, () => {
      let response: Promise<Readable>;

      it(
        `Load file by key`,
        async () => {
          const storageServices = await loadStorage(driver);

          try {
            await storageServices.getFile(null as any);
          } catch (e) {
            expect(e).not.toBeUndefined();
          }

          response = storageServices.getFile(storageResponse.key);

          await expect(response).resolves.not.toBeUndefined();
        },
        testTimeout,
      );

      it(`Reading content should be "${fileContent}"`, () => {
        expect(response).resolves.not.toBeUndefined();
        expect(response.then(streamToString)).resolves.toBe(fileContent);
      });

      it(`Get Signed URL`, async () => {
        await expect(
          (await loadStorage(driver)).getSignedUrl(storageResponse.key),
        ).resolves.not.toThrowError();
      });
    });

    describe(`Test All Files in Dir ${driver}`, () => {
      let response: Promise<string[]>;

      it(
        `Load all files in prefix "${prefix}"`,
        async () => {
          response = (await loadStorage(driver)).getFilesFromDir(prefix);

          await expect(response).resolves.not.toThrowError();
          await expect(response).resolves.not.toBeUndefined();
        },
        testTimeout,
      );

      it(`Reading all files content should be "${fileContent}"`, async () => {
        const storageServices = await loadStorage(driver);

        await expect(response).resolves.not.toBeUndefined();

        await response.then((keys) =>
          Promise.all(keys.map((key) => storageServices.getFile(key))).then(
            (streams) =>
              Promise.all(
                streams.map((stream) =>
                  expect(streamToString(stream)).resolves.toBe(fileContent),
                ),
              ),
          ),
        );
      });
    });

    describe(`Test Delete Uploaded File ${driver}`, () => {
      it(
        `Delete file by key and Dir`,
        async () => {
          const storageServices = await loadStorage(driver);

          try {
            await storageServices.deleteFile(null as any);
          } catch (e) {
            expect(e).not.toBeUndefined();
          }

          const response = storageServices.deleteFile(storageResponse.key);

          // not error and wait till cloud storage commit before delete all dir
          await expect(response).resolves.not.toThrowError();
          await new Promise((r) => setTimeout(r, 3000));

          const responseAll = storageServices.deleteFileByDirectory(prefix);

          await expect(responseAll).resolves.not.toThrowError();
          await expect(responseAll).resolves.toBeUndefined();
        },
        testTimeout,
      );
    });
  });
});
