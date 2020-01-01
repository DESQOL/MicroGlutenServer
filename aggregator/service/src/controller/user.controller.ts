import { NextFunction, Request, Response } from 'express';
import { Controller, Route, Scope } from '../decorator';
import { getService } from '../helper';

@Controller('/user')
export class UserController {
    @Route('post', '/register')
    public async register (request: Request, response: Response, _next: NextFunction): Promise<Response> {
        return getService('user').post('/register', request)
            .then((res) => response.status(res.status).json(res.data));
    }

    @Route('post', '/login')
    public async login (request: Request, response: Response, _next: NextFunction): Promise<Response> {
        return getService('user').post('/login', request)
            .then((res) => response.status(res.status).json(res.data));
    }

    @Route('post', '/update')
    public async update (request: Request, response: Response, _next: NextFunction): Promise<Response> {
        return getService('user').post('/update', request)
            .then((res) => response.status(res.status).json(res.data));
    }

    @Route('get', '/search')
    @Scope('admin:read')
    public async search (request: Request, response: Response, _next: NextFunction): Promise<Response> {
        return getService('user').get('/search', request)
            .then((res) => response.status(res.status).json(res.data));
    }
}
