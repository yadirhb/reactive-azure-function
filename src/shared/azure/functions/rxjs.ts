import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { HttpFunctionOptions, HttpResponse } from "@azure/functions/types/http";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";
import { Container } from "typedi";

export type HttpControllerOptions = Omit<HttpFunctionOptions, "handler">
export type FunctionResult = HttpResponseInit | HttpResponse

export type HttpRequestObservable = Observable<[HttpRequest, InvocationContext]>
export type ReactiveHttpRequestHandler<T> = (stream$: HttpRequestObservable, ...args: any[]) => Observable<T>

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
    return function (target: any, memberName: string, descriptor: TypedPropertyDescriptor<ReactiveHttpRequestHandler<any>>) {
        if (descriptor.value) {
            const handler = descriptor.value;
            const ProxyHandler = (stream$: HttpRequestObservable) => handler.call(Container.get(target.constructor), stream$);
            const { name, options } = config;
            return httpRxControllerFactory(name || memberName, ProxyHandler, { ...defaultOptions, ...options });
        }
    }
}