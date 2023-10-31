"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = __importDefault(require("./general"));
const auth_1 = __importDefault(require("./auth"));
const file_1 = __importDefault(require("./file"));
const login_1 = __importDefault(require("./login"));
const user_1 = __importDefault(require("./user"));
const group_1 = __importDefault(require("./group"));
const catalog_redemption_1 = __importDefault(require("./catalog_redemption"));
const tier_benefit_1 = __importDefault(require("./tier_benefit"));
const graduation_points_1 = __importDefault(require("./graduation_points"));
const earning_campaign_1 = __importDefault(require("./earning_campaign"));
const additional_points_1 = __importDefault(require("./additional_points"));
exports.default = {
    additional_points: additional_points_1.default,
    general: general_1.default,
    auth: auth_1.default,
    file: file_1.default,
    login: login_1.default,
    user: user_1.default,
    group: group_1.default,
    catalog_redemption: catalog_redemption_1.default,
    tier_benefit: tier_benefit_1.default,
    graduation_points: graduation_points_1.default,
    earning_campaign: earning_campaign_1.default,
};
//# sourceMappingURL=index.js.map