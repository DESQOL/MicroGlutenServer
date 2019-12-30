import express, { Application, Request, Response } from 'express';

export default class App {
    private app: Application;

    constructor () {
        this.app = express();

        this.registerRoutes();
    }

    public listen () {
        this.app.listen(80, 'recipe-service', () => console.log('Service: `recipe` is ready for HTTP requests!'));
    }

    private registerRoutes () {
        this.app.get('/', (_request: Request, response: Response) => response.send('Hello World!'));
    }
}
