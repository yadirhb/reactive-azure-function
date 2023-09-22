import { Inject, Service } from 'typedi';
import { ReactiveHttpAction, HttpRequestObservable } from "@shared/azure/functions/rxjs";
import { DefaultLogger } from "@shared/domain";
import { Observable } from "rxjs/internal/Observable";
import { iif } from "rxjs/internal/observable/iif";
import { of } from "rxjs/internal/observable/of";
import { throwError } from "rxjs/internal/observable/throwError";
import { map } from "rxjs/internal/operators/map";
import { mergeMap } from "rxjs/internal/operators/mergeMap";
import { tap } from "rxjs/internal/operators/tap";
import { HttpResponseInit } from '@azure/functions';

@Service()
export class MainController {
    timestamp: number = Date.now()
    constructor(@Inject() protected logger: DefaultLogger) { }

    // https://learn.microsoft.com/en-us/azure/azure-functions/functions-node-upgrade-v4?tabs=azure-cli-set-indexing-flag%2Cv4#httpresponse
    @ReactiveHttpAction({ options: { methods: ['POST', 'GET'] } })
    index(stream$: HttpRequestObservable): Observable<HttpResponseInit> {
        return stream$.pipe(
            tap(([request, context]) => this.logger.log(`Http function processed request for url "${request.url}"`)),
            map(([request]) => request.query.get('name') || 'world'),
            mergeMap((name) => iif(() => name == 'empty', throwError(() => new Error(`Name argument is required and cannot be empty`)), of(name))),
            map((name) => ({ body: `Hello, ${name}!` }))
        )
    }
}
