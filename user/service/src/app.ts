import express, { Application, NextFunction, Request, Response } from 'express';
import { createConnection, getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from './entity';
import { databaseConfiguration } from './config';

export default class App {
    private app: Application;

    constructor () {
        this.app = express();
        this.app.use(express.json());
    }

    public async listen () {
        await createConnection(databaseConfiguration).then(() => {
            this.registerRoutes();

            this.app.listen(80, 'user-service', () => console.log('Service: `user` is ready for HTTP requests!'));
        });
    }

    private registerRoutes () {
        const repoUser = getRepository(User);

        async function register (request: Request, response: Response, _next: NextFunction) {
            const { email, password } = request.body;

            const errors = await validate(User.from({ email, password }), { validationError: { target: false, value: false } });
            if (errors.length > 0) {
                return response.status(400).json({
                    message: 'The server could not understand the request due to invalid syntax.',
                    errors,
                });
            }

            let user = await repoUser.findOne({ where: { email } });
            if (user) {
                return response.status(409).json({
                    message: 'Specified email address is already associated with an account.',
                });
            }

            user = repoUser.create({ email });
            user.password = await User.hashPassword(password);
            user = await repoUser.save(user);

            user = await repoUser.findOne({ where: { email } });
            response.status(200).json(user);
        }

        async function login (request: Request, response: Response, _next: NextFunction) {
            const { email, password } = request.body;

            const errors = await validate(User.from({ email, password }), { validationError: { target: false, value: false } });
            if (errors.length > 0) {
                return response.status(400).json({
                    message: 'The server could not understand the request due to invalid syntax.',
                    errors,
                });
            }

            const user = await repoUser.findOne({ where: { email } });
            if (!user) {
                return response.status(403).json({
                    message: 'Incorrect email or password.',
                });
            }

            const match = await user.validatePassword(password);
            if (!match) {
                return response.status(403).json({
                    message: 'Incorrect email or password.',
                });
            }

            response.status(200).json(user);
        }

        async function update (request: Request, response: Response, _next: NextFunction) {
            const { email, password, firstname, lastname } = request.body;

            const errors = await validate(User.from({ email, password, firstname, lastname }), { validationError: { target: false, value: false } });
            if (errors.length > 0) {
                return response.status(400).json({
                    message: 'The server could not understand the request due to invalid syntax.',
                    errors,
                });
            }

            let user = await repoUser.findOne({ where: { email } });
            if (!user) {
                return response.status(403).json({
                    message: 'Incorrect email or password.',
                });
            }

            const match = await user.validatePassword(password);
            if (!match) {
                return response.status(403).json({
                    message: 'Incorrect email or password.',
                });
            }

            user = await repoUser.preload({ id: user.id, email, firstname, lastname });
            user = await repoUser.save(user);

            response.status(200).json(user);
        }

        async function search (_request: Request, response: Response, _next: NextFunction) {
            const users = await repoUser.find();
            response.status(200).json(users);
        }

        this.app.post('/login', async (request: Request, response: Response, next: NextFunction) => {
            login(request, response, next)
                .catch(next);
        });

        this.app.post('/register', async (request: Request, response: Response, next: NextFunction) => {
            register(request, response, next)
                .catch(next);
        });

        this.app.post('/update', async (request: Request, response: Response, next: NextFunction) => {
            update(request, response, next)
                .catch(next);
        });

        this.app.get('/search', async (request: Request, response: Response, next: NextFunction) => {
            search(request, response, next)
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
