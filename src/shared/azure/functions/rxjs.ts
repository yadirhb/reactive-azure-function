import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { HttpFunctionOptions, HttpResponse } from "@azure/functions/types/http";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";

export type HttpControllerOptions = Omit<HttpFunctionOptions, "handler">
export type FunctionResult = HttpResponseInit | HttpResponse

export type HttpRequestObservable = Observable<[HttpRequest, InvocationContext]>

export interface RxHttpController<T extends FunctionResult = HttpResponseInit> {
    onRequest: (stream$: HttpRequestObservable) => Observable<T>
}

const defaultOptions: HttpControllerOptions = {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous'
}

export function httpRxControllerFactory<T extends FunctionResult = HttpResponseInit>(
    name: string,
    controller: RxHttpController<T>,
    options: HttpControllerOptions = defaultOptions
) {
    return app.http(name, {
        ...defaultOptions,
        ...options,
        handler: async (request: HttpRequest, context: InvocationContext) => await firstValueFrom(controller.onRequest(of([request, context])))
    });
}