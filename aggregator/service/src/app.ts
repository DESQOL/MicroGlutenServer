import express, { Application, NextFunction, Request, Response } from 'express';
import axios from 'axios';

const services = {
    recipe: 'http://recipe-service/',
    user: 'http://user-service',
};

export default class App {
    private app: Application;

    constructor () {
        this.app = express();
        this.app.use(express.json());

        this.registerRoutes();
    }

    public listen () {
        this.app.listen(80, 'aggregator-service', () => console.log('Service: `aggregator` is ready for HTTP requests!'));
    }

    private registerRoutes () {
        this.app.post('/user/register', async (request: Request, response: Response, next: NextFunction) => {
            axios.post(`${services.user}/register`, request.body, { validateStatus: () => true })
                .then((res) => response.status(res.status).json(res.data))
                .catch(next);
        });

        this.app.use((err: any, _request: Request, response: Response, _next: NextFunction) => {
            response.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            });
        });
    }
}
