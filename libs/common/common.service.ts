import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { lastValueFrom, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AitCommonBroadcastListener } from './interfaces';
import { ResponseService } from '../response';

@Injectable()
export class CommonService {
  constructor(
    protected httpService: HttpService,
    protected responseService: ResponseService,
  ) {}

  async postHttp(
    url: string,
    body?: Record<string, any>,
    headers?: Record<string, any>,
  ): Promise<AxiosResponse<any>> {
    const post_response = this.httpService
      .post(url, body, { headers: headers })
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        }),
        catchError((err) => {
          Logger.error(url, '', this.constructor.name);
          console.log(err?.response?.data);
          return of(err);
        }),
      );
    try {
      return await lastValueFrom(post_response);
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      return error.response.res;
    }
  }

  async getHttp(url: string): Promise<AxiosResponse<any>> {
    const get_response = this.httpService.get(url).pipe(
      map((axiosResponse: AxiosResponse) => {
        return axiosResponse.data;
      }),
      catchError((err) => {
        Logger.error(url, '', this.constructor.name);
        console.log(err?.response?.data);
        return of(err);
      }),
    );
    try {
      return await lastValueFrom(get_response);
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      return error.response.res;
    }
  }

  async deleteHttp(url: string, headers?: Record<string, any>): Promise<any> {
    const delete_response = this.httpService
      .delete(url, { headers: headers })
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        }),
        catchError((err) => {
          Logger.error(url, '', this.constructor.name);
          console.log(err?.response?.data);
          return of(err);
        }),
      );
    try {
      return await lastValueFrom(delete_response);
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      Logger.error(
        error.request.host,
        error.response.data,
        this.constructor.name,
      );
      return error.response?.res ?? error;
    }
  }

  async broadcastUpdate(
    body: Record<string, any>,
    entityName: string,
    prefixUrl = 'api/v1/internal',
  ): Promise<void> {
    try {
      Logger.log(
        `Broadcast Update ${entityName} ====`,
        '',
        this.constructor.name,
      );
      console.log(body);
      for (const key in process.env) {
        if (key.startsWith('BASEURL_') && key.endsWith('_SERVICE')) {
          let serviceName = key.replace('BASEURL_', '');
          serviceName = serviceName.replace('_SERVICE', '').toLocaleLowerCase();
          const url = `${process.env[key]}/${prefixUrl}/${serviceName}/${entityName}`;
          try {
            this.postHttp(url, body);
            Logger.log(url, '', this.constructor.name);
          } catch (error) {
            Logger.error(error, '', this.constructor.name);
          }
        }
      }
    } catch (error) {
      Logger.error(error, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async broadcastDelete(
    id: string,
    entityName: string,
    prefixUrl = 'api/v1/internal',
  ): Promise<void> {
    try {
      Logger.log(
        `Broadcast Delete ${entityName} ====`,
        '',
        this.constructor.name,
      );
      for (const key in process.env) {
        if (key.startsWith('BASEURL_') && key.endsWith('_SERVICE')) {
          let serviceName = key.replace('BASEURL_', '');
          serviceName = serviceName.replace('_SERVICE', '').toLocaleLowerCase();
          const url = `${process.env[key]}/${prefixUrl}/${serviceName}/${entityName}/${id}`;
          try {
            this.deleteHttp(url);
            Logger.log(url, '', this.constructor.name);
          } catch (error) {
            Logger.error(error, '', this.constructor.name);
          }
        }
      }
    } catch (error) {
      Logger.error(error, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  /** listen to broadcast events, only happens if broadcast done using event brokers */
  listenBroadcasts(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entityNames: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    action: 'update' | 'delete',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    listener: AitCommonBroadcastListener,
  ) {
    Logger.debug('listenBroadcasts is ignored in CommonService http version');
  }

  /**
   * setup broadcast message broker concurrency, only happens if broadcast done using event brokers
   * (currently only support kafka)
   *
   * - entityNames: list of entities to set up, this will automatically setup update and delete event
   * - partitionNumber: number of max concurrency whan you did horizontal scaling on consumer side.
   * warning: do not use this if you're expecting a synchronous queue, since concurrency means no guarantee
   * that it will be processed synchronously in order the message are being sent
   *  */
  setupBroadcasts(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entityNames: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    partitionNumber = 10,
  ) {
    Logger.debug('setupBroadcasts is ignored in CommonService http version');
  }
}
