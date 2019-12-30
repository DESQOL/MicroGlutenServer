import { RouteDefinition } from '../type';

export const Route = (requestMethod: 'get' | 'post', path: string): MethodDecorator => {
    return (target: object, propertyKey: string): void => {
        const controllerRoutes = Reflect.getMetadata('routes', target.constructor) as RouteDefinition<Function>[] || [];
        controllerRoutes.push({
            requestMethod,
            path,
            methodName: propertyKey,
        });

        Reflect.defineMetadata('routes', controllerRoutes, target.constructor);
    };
};
