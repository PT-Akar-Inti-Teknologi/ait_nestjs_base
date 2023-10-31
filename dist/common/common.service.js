"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
let CommonService = class CommonService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async postHttp(url, body, headers) {
        const post_response = this.httpService
            .post(url, body, { headers: headers })
            .pipe((0, operators_1.map)((axiosResponse) => {
            return axiosResponse.data;
        }), (0, operators_1.catchError)((err) => {
            var _a;
            common_1.Logger.error(url, '', this.constructor.name);
            console.log((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data);
            return (0, rxjs_1.of)(err);
        }));
        try {
            return await (0, rxjs_1.lastValueFrom)(post_response);
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            return error.response.res;
        }
    }
    async getHttp(url) {
        const get_response = this.httpService.get(url).pipe((0, operators_1.map)((axiosResponse) => {
            return axiosResponse.data;
        }), (0, operators_1.catchError)((err) => {
            var _a;
            common_1.Logger.error(url, '', this.constructor.name);
            console.log((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data);
            return (0, rxjs_1.of)(err);
        }));
        try {
            return await (0, rxjs_1.lastValueFrom)(get_response);
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            return error.response.res;
        }
    }
    async deleteHttp(url, headers) {
        var _a, _b;
        const delete_response = this.httpService
            .delete(url, { headers: headers })
            .pipe((0, operators_1.map)((axiosResponse) => {
            return axiosResponse.data;
        }), (0, operators_1.catchError)((err) => {
            var _a;
            common_1.Logger.error(url, '', this.constructor.name);
            console.log((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data);
            return (0, rxjs_1.of)(err);
        }));
        try {
            return await (0, rxjs_1.lastValueFrom)(delete_response);
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            common_1.Logger.error(error.request.host, error.response.data, this.constructor.name);
            return (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.res) !== null && _b !== void 0 ? _b : error;
        }
    }
};
CommonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], CommonService);
exports.CommonService = CommonService;
//# sourceMappingURL=common.service.js.map