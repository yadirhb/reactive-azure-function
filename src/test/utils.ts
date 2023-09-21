import { HttpRequest, HttpRequestInit, InvocationContext, InvocationContextInit } from "@azure/functions";
import { of } from "rxjs/internal/observable/of";
import { HttpRequestObservable } from "@shared/azure/functions"

export const defaultInvocationContextInit: InvocationContextInit = {
    functionName: 'testFunctionName',
    invocationId: 'testInvocationId'
}

export const defaultHttpRequestInit: HttpRequestInit = {
    url: 'http://localhost/api/index',
    method: 'POST'
}

export function createMockStream(
    httpRequestInit: HttpRequestInit = defaultHttpRequestInit,
    invocationContextInit: InvocationContextInit = defaultInvocationContextInit
): HttpRequestObservable {
    return of([
        new HttpRequest({
            ...defaultHttpRequestInit,
            ...httpRequestInit
        }),
        new InvocationContext({
            ...defaultInvocationContextInit,
            ...invocationContextInit
        })
    ]);
}