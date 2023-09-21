import { createMockStream, defaultHttpRequestInit, defaultInvocationContextInit } from "@test/utils"


describe('Test utils', () => {
    const url = 'http://localhost/api/index'
    const query = { name: 'Bill' }
    test('Test create mockStream with custom HttpRequestInit', () => {
        createMockStream({
            url,
            method: 'GET',
            query
        }).subscribe({
            next([request, context]) {
                expect(request.url).toEqual(url);
                expect(request.method).toEqual('GET');
                expect(request.query.get('name')).toEqual(query.name);

                expect(context.functionName).toEqual(defaultInvocationContextInit.functionName)
            }
        });
    });

    test('Test create mockStream with all defaults', () => {
        createMockStream().subscribe({
            next([request, context]) {
                expect(request.url).toEqual(defaultHttpRequestInit.url);
                expect(request.method).toEqual(defaultHttpRequestInit.method);

                expect(context.functionName).toEqual(defaultInvocationContextInit.functionName)
            }
        });
    });

    test('Test create mockStream with custom InvocationContext', () => {
        createMockStream({}, {
            functionName: 'myCustomFunction'
        }).subscribe({
            next([request, context]) {
                expect(request.url).toEqual(defaultHttpRequestInit.url);
                expect(request.method).toEqual(defaultHttpRequestInit.method);

                expect(context.functionName).toEqual('myCustomFunction')
            }
        });
    });
});
