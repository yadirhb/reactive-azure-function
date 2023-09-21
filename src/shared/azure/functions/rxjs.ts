import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { HttpFunctionOptions, HttpResponse } from "@azure/functions/types/http";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";

export type HttpControllerOptions = Omit<HttpFunctionOptions, "handler">
export type FunctionResult = HttpResponseInit | HttpResponse

export type HttpRequestObservable = Observable<[HttpRequest, InvocationContext]>
export type HttpRxController<T> = (stream$: HttpRequestObservable) => Observable<T>

const defaultOptions: HttpControllerOptions = {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous'
}

export function httpRxControllerFactory<T extends FunctionResult = HttpResponseInit>(
    name: string,
    handler: HttpRxController<T>,
    options: HttpControllerOptions = defaultOptions
) {
    return app.http(name, {
        ...defaultOptions,
        ...options,
        handler: async (request: HttpRequest, context: InvocationContext) => await firstValueFrom(handler(of([request, context])))
    });
}