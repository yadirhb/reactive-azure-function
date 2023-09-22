import 'reflect-metadata';
import { Container } from 'typedi';
import * as appInsights from 'applicationinsights';
import { MainController } from '../controllers';

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

// Load Controllers
[MainController].forEach((controller) => {
    if (Container.has(controller)) {
        console.log(`[INFO] Controller: '${controller.name}' successfully loaded.`)
    }
});