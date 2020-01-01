import { NextFunction, Request, Response } from 'express';
import { MiddlewareDefinition } from '../type';
import { getService } from '../helper';

export const metadataKey = 'routeMiddleware';
export const Scope = (requiredScope: string): MethodDecorator => {
    return (target: object, propertyKey: string): void => {
        const metadataValue = Reflect.getMetadata(metadataKey, target, propertyKey) as MiddlewareDefinition[] || [];

        metadataValue.push(async (request: Request, response: Response, next: NextFunction) => {
            const token = request.header('X-API-KEY');
            if (!token) {
                return response.status(401).json({
                    message: 'API key is missing or invalid.'
                });
            }

            const result = await getService('token').post('/satisfies', {
                token,
                scope: requiredScope
            });

            if (result.status !== 200) {
                return response.status(403).json({
                    message: 'Token does not have the required scope.'
                });
            }

            next();
        });

        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
    };
};
