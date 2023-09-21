import { createMockStream } from "@test/utils"
import * as controller from './index'


describe('Test controllers', () => {
    test('Test index controllers return object', () => {
        const mockStream$ = createMockStream({
            url: 'http://localhost/api/index',
            method: 'POST',
            query: { name: 'Bill' }
        })

        controller.index(mockStream$).subscribe({
            next(result) {
                expect(result).toEqual({ body: "Hello, Bill!" });
            }
        });
    });

    test('Test index controllers without query args', () => {
        const mockStream$ = createMockStream({
            url: 'http://localhost/api/index',
            method: 'POST'
        })

        controller.index(mockStream$).subscribe({
            next(result) {
                expect(result).toEqual({ body: "Hello, world!" });
            }
        });
    });

    test('Test index controllers with empty name', () => {
        const mockStream$ = createMockStream({
            url: 'http://localhost/api/index',
            method: 'POST',
            query: { name: 'empty' }
        })

        controller.index(mockStream$).subscribe({
            error(err) {
                expect(err.message).toEqual("Name argument is required and cannot be empty");
            }
        });
    });

    test('Test user controllers return object', () => {
        const mockStream$ = createMockStream({
            url: 'http://localhost/api/internal/users',
            method: 'POST',
            query: { name: 'Bill' }
        })

        controller.users(mockStream$).subscribe({
            next(result) {
                expect(result).toEqual({ body: "Hello Bill! What's up???" });
            }
        });
    });

    test('Test user controllers without query params', () => {
        const mockStream$ = createMockStream({
            url: 'http://localhost/api/internal/users',
            method: 'POST'
        })

        controller.users(mockStream$).subscribe({
            next(result) {
                expect(result).toEqual({ body: "Hello world! What's up???" });
            }
        });
    });
});
