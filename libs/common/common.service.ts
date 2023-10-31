import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { lastValueFrom, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CommonService {
  constructor(private httpService: HttpService) {}

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
}
