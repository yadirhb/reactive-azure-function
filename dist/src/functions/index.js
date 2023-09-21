"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typedi_1 = require("typedi");
const appInsights = require("applicationinsights");
const rxjs_1 = require("../shared/azure/functions/rxjs");
const controllers_1 = require("../../src/controllers");
appInsights
    .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(false)
    .setAutoCollectRequests(false)
    .setAutoCollectPerformance(false)
    .setAutoCollectExceptions(false)
    .setAutoCollectDependencies(false)
    .setAutoCollectConsole(false)
    .setUseDiskRetryCaching(true)
    .start();
// Register routes: index => main controller
(0, rxjs_1.httpRxControllerFactory)('index', typedi_1.Container.get(controllers_1.MainController), { methods: ['POST', 'GET'] });
//# sourceMappingURL=index.js.map