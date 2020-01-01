import { NextFunction, Request, Response } from 'express';

export type MiddlewareDefinition = (request: Request, response: Response, next: NextFunction) => void;
