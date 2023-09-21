import 'reflect-metadata';
import { Container } from 'typedi';
import * as appInsights from 'applicationinsights';
import { httpRxControllerFactory } from "@shared/azure/functions/rxjs";
import { MainController } from 'src/controllers';

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
httpRxControllerFactory('index', Container.get(MainController), { methods: ['POST', 'GET'] });