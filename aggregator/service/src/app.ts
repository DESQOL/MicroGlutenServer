import express, { Application, NextFunction, Request, Response } from 'express';
import { UserController } from './controller';
import { RouteDefinition, MiddlewareDefinition } from './type';

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
        [
            UserController,
        ].forEach((Controller) => {
            const prefix = Reflect.getMetadata('prefix', Controller);
            const routes: RouteDefinition<typeof Controller>[] = Reflect.getMetadata('routes', Controller) || [];

            routes.forEach((route) => {
                const routeMiddleware = Reflect.getMetadata('routeMiddleware', Controller.prototype, route.methodName) as MiddlewareDefinition[] || [];

                function routeHandler (request: Request, response: Response, next: NextFunction): void {
                    const result = new Controller()[route.methodName](request, response, next);
                    result.catch(next);
                }

                this.app[route.requestMethod](`${prefix}${route.path}`, routeMiddleware, routeHandler);
            });
        });

        this.app.use((err: any, _request: Request, response: Response, _next: NextFunction) => {
            response.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            });
        });
    }
}
