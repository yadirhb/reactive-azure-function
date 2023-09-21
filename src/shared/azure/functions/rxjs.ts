import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { HttpFunctionOptions, HttpResponse } from "@azure/functions/types/http";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";

export type HttpControllerOptions = Omit<HttpFunctionOptions, "handler">
export type FunctionResult = HttpResponseInit | HttpResponse

export type HttpRequestObservable = Observable<[HttpRequest, InvocationContext]>
export type ReactiveHttpRequestHandler<T> = (stream$: HttpRequestObservable) => Observable<T>

const defaultOptions: HttpControllerOptions = {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous'
}

export function httpRxControllerFactory<T extends FunctionResult = HttpResponseInit>(
    name: string,
    handler: (stream$: HttpRequestObservable) => Observable<T>,
    options: HttpControllerOptions = defaultOptions
) {
    return app.http(name, {
        ...defaultOptions,
        ...options,
        handler: async (request: HttpRequest, context: InvocationContext) => await firstValueFrom(handler(of([request, context])))
    });
}

// Creates an action
export function ReactiveHttpAction(config: { name?: string, options?: HttpControllerOptions } = { options: defaultOptions }) {
    return function (_, memberName: string, descriptor: TypedPropertyDescriptor<ReactiveHttpRequestHandler<any>>) {
        if (descriptor.value) {
            const { name, options } = config;
            httpRxControllerFactory(name || memberName, descriptor.value, { ...defaultOptions, ...options })
        }
    }
}