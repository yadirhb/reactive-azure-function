import { Service } from 'typedi';

export interface Logger {
    log(...args: any[])
}

@Service({ global: true })
export class DefaultLogger implements Logger {
    constructor() { }

    log(...args: any[]) {
        console.log("[CUSTOM]", ...args)
    }
}