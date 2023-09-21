import { createMockStream } from "@test/utils"
import { MainController } from ".";
import Container from "typedi";


describe('Test controllers', () => {
    let mainController;

    beforeEach(() => {
        mainController = Container.get(MainController);
    })

    test('Test index controllers return object', () => {
        const mockStream$ = createMockStream({
            url: 'http://localhost/api/index',
            method: 'POST',
            query: { name: 'Bill' }
        })

        mainController.onRequest(mockStream$).subscribe({
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

        mainController.onRequest(mockStream$).subscribe({
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

        mainController.onRequest(mockStream$).subscribe({
            error(err) {
                expect(err.message).toEqual("Name argument is required and cannot be empty");
            }
        });
    });
});
