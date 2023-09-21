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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
const typedi_1 = require("typedi");
const domain_1 = require("../../shared/domain");
const iif_1 = require("rxjs/internal/observable/iif");
const of_1 = require("rxjs/internal/observable/of");
const throwError_1 = require("rxjs/internal/observable/throwError");
const map_1 = require("rxjs/internal/operators/map");
const mergeMap_1 = require("rxjs/internal/operators/mergeMap");
const tap_1 = require("rxjs/internal/operators/tap");
let MainController = class MainController {
    constructor(logger) {
        this.logger = logger;
    }
    // https://learn.microsoft.com/en-us/azure/azure-functions/functions-node-upgrade-v4?tabs=azure-cli-set-indexing-flag%2Cv4#httpresponse
    onRequest(stream$) {
        return stream$.pipe((0, tap_1.tap)(([request, context]) => this.logger.log(`Http function processed request for url "${request.url}"`)), (0, map_1.map)(([request]) => request.query.get('name') || 'world'), (0, mergeMap_1.mergeMap)((name) => (0, iif_1.iif)(() => name == 'empty', (0, throwError_1.throwError)(() => new Error(`Name argument is required and cannot be empty`)), (0, of_1.of)(name))), (0, map_1.map)((name) => ({ body: `Hello, ${name}!` })));
    }
};
exports.MainController = MainController;
exports.MainController = MainController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)()),
    __metadata("design:paramtypes", [domain_1.DefaultLogger])
], MainController);
//# sourceMappingURL=index.js.map