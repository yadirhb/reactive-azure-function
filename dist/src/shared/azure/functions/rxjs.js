"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRxControllerFactory = void 0;
const functions_1 = require("@azure/functions");
const of_1 = require("rxjs/internal/observable/of");
const firstValueFrom_1 = require("rxjs/internal/firstValueFrom");
const defaultOptions = {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous'
};
function httpRxControllerFactory(name, controller, options = defaultOptions) {
    return functions_1.app.http(name, Object.assign(Object.assign(Object.assign({}, defaultOptions), options), { handler: (request, context) => __awaiter(this, void 0, void 0, function* () { return yield (0, firstValueFrom_1.firstValueFrom)(controller.onRequest((0, of_1.of)([request, context]))); }) }));
}
exports.httpRxControllerFactory = httpRxControllerFactory;
//# sourceMappingURL=rxjs.js.map