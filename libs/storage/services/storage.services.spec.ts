import { Readable } from 'stream';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { StorageServices } from './storage.services';
import { StorageResponse } from '../interfaces/storage-repository.interface';

describe('StorageServices', () => {
  const testTimeout = 120000;

  const prefix = 'test';
  const fileContent = 'Hello world!';

  function streamToString(stream: Readable) {
    const chunks = [];

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => reject(err));
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  /**
   * Run every test start to override storage driver
   */
  async function loadStorage(driver: string) {
    const builder = Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [StorageServices],
    });

    process.env.STORAGE_DRIVER = driver;
    process.env.STORAGE_FIREBASE_KEY_FILE_PATH = 'path';
    process.env.STORAGE_FIREBASE_BUCKET = 'bucket';

    return (await builder.compile()).get<StorageServices>(StorageServices);
  }

  ['s3', 'firebase', 'local'].forEach((driver) => {
    let storageResponse: StorageResponse;

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
          const response = (await loadStorage(driver)).uploadFile(iFile);

          expect(response).resolves.not.toThrowError();

          storageResponse = await response;
        },
        testTimeout,
      );
    });

    describe(`Test Get File ${driver}`, () => {
      let response;

      it(
        `Load file by key`,
        async () => {
          response = (await loadStorage(driver)).getFile(storageResponse.key);

          expect(response).resolves.not.toThrowError();
          expect(response).resolves.not.toBeUndefined();
        },
        testTimeout,
      );

      it(`Reading content should be "${fileContent}"`, () => {
        expect(response).resolves.not.toBeUndefined();
        expect(response.then(streamToString)).resolves.toBe(fileContent);
      });

      it(`Get Signed URL`, async () => {
        expect(
          (await loadStorage(driver)).getPresignedUrl(storageResponse.key),
        ).resolves.not.toThrowError();
      });
    });

    describe(`Test All Files in Dir ${driver}`, () => {
      let response;

      it(
        `Load all files in prefix "${prefix}"`,
        async () => {
          response = (await loadStorage(driver)).getFilesFromDir(prefix);

          expect(response).resolves.not.toThrowError();
          expect(response).resolves.not.toBeUndefined();
        },
        testTimeout,
      );

      it(`Reading all files content should be "${fileContent}"`, async () => {
        const storageServices = await loadStorage(driver);

        expect(response).resolves.not.toBeUndefined();

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

          const response = storageServices.deleteFile(storageResponse.key);

          // not error and wait till cloud storage commit before delete all dir
          expect(response).resolves.not.toThrowError();
          await new Promise((r) => setTimeout(r, 3000));

          const responseAll = storageServices.deleteFileByDirectory(prefix);

          expect(responseAll).resolves.not.toThrowError();
          expect(responseAll).resolves.toBeUndefined();
        },
        testTimeout,
      );
    });
  });
});
