import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { HttpFunctionOptions, HttpResponse } from "@azure/functions/types/http";
import { firstValueFrom, Observable, of } from "rxjs";
import { Container } from "typedi";

// Represents the options for configuring an HTTP controller.
export type HttpControllerOptions = Omit<HttpFunctionOptions, "handler">;

// Represents the possible result types of an HTTP controller function.
export type FunctionResult = HttpResponseInit | HttpResponse;

// Represents an observable stream of HTTP requests along with their invocation contexts.
export type HttpRequestObservable = Observable<[HttpRequest, InvocationContext]>;

// Represents a handler function for processing reactive HTTP requests.
export type ReactiveHttpRequestHandler<T> = (stream$: HttpRequestObservable, ...args: any[]) => Observable<T>;

// The default options for an HTTP controller.
const defaultOptions: HttpControllerOptions = {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous'
};

/**
 * Factory function for creating reactive HTTP controllers.
 * @param name The name of the controller.
 * @param handler The handler function for processing reactive HTTP requests.
 * @param options The options for configuring the HTTP controller.
 * @returns The created Azure Function.
 */
export function httpRxControllerFactory<T extends FunctionResult = HttpResponseInit>(
    name: string,
    handler: (stream$: HttpRequestObservable) => Observable<T>,
    options: HttpControllerOptions = defaultOptions
) {
    return app.http(name, {
        ...defaultOptions,
        ...options,
        handler: async (request: HttpRequest, context: InvocationContext) => {
            try {
                return await firstValueFrom(handler(of([request, context])));
            } catch (error) {
                // Handle the error appropriately
                console.error("Error occurred in handler:", error);
                return { status: 500, body: "Internal Server Error" };
            }
        }
    });
}

/**
 * Decorator function for registering a new function action as a reactive HTTP controller.
 * @param config The configuration options for the function action.
 * @returns The decorator function.
 */
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