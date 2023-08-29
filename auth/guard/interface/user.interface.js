"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ILevel = exports.IUserType = void 0;
var IUserType;
(function (IUserType) {
    IUserType["Customer"] = "customer";
    IUserType["Merchant"] = "merchant";
    IUserType["Admin"] = "admin";
    IUserType["Superadmin"] = "superadmin";
})(IUserType || (exports.IUserType = IUserType = {}));
var ILevel;
(function (ILevel) {
    ILevel["Group"] = "group";
    ILevel["Merchant"] = "merchant";
    ILevel["Store"] = "store";
})(ILevel || (exports.ILevel = ILevel = {}));
//# sourceMappingURL=user.interface.js.map