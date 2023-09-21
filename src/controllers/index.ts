import { FunctionResult, HttpRequestObservable } from "@shared/azure/functions/rxjs";
import { Observable } from "rxjs/internal/Observable";
import { iif } from "rxjs/internal/observable/iif";
import { of } from "rxjs/internal/observable/of";
import { throwError } from "rxjs/internal/observable/throwError";
import { map } from "rxjs/internal/operators/map";
import { mergeMap } from "rxjs/internal/operators/mergeMap";
import { tap } from "rxjs/internal/operators/tap";

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-node-upgrade-v4?tabs=azure-cli-set-indexing-flag%2Cv4#httpresponse
export function index(stream$: HttpRequestObservable): Observable<FunctionResult> {
    return stream$.pipe(
        tap(([request, context]) => context.log(`Http function processed request for url "${request.url}"`)),
        map(([request]) => request.query.get('name') || 'world'),
        mergeMap((name) => iif(() => name == 'empty', throwError(() => new Error(`Name argument is required and cannot be empty`)), of(name))),
        map((name) => ({ body: `Hello, ${name}!` }))
    )
}

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-node-upgrade-v4?tabs=azure-cli-set-indexing-flag%2Cv4#httpresponse
export function users(stream$: HttpRequestObservable) {
    return stream$.pipe(
        map(([request]) => request.query.get('name') || 'world'),
        map((name) => ({ body: `Hello ${name}! What's up???` }))
    )
}