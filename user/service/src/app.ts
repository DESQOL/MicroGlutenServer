import express, { Application, Request, Response, NextFunction } from 'express'
import { getRepository, createConnection } from 'typeorm';
import { User } from './entity';
import { databaseConfiguration } from './config';

export default class App {
    private app: Application

    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

    public async listen() {
        await createConnection(databaseConfiguration).then(() => {
            this.registerRoutes();

            this.app.listen(80, 'user-service', () => console.log('Service: `user` is ready for HTTP requests!'));
        });
    }

    private registerRoutes() {
        const repoUser = getRepository(User)

        async function register (request: Request, response: Response, _next: NextFunction) {            
            const { email, password } = request.body

            let user = await repoUser.findOne({ where: { email } })
            if (user) {
                return response.status(409).json({
                    message: 'Specified email address is already associated with an account.',
                });
            }

            user = repoUser.create({ email, password });            
            user = await repoUser.save(user);

            response.status(200).json(user);
        }

        this.app.post('/register', async (request: Request, response: Response, next: NextFunction) => {
            register(request, response, next)
                .catch(next);
        })

        this.app.use((err: any, _request: Request, response: Response, _next: NextFunction) => {
            console.log(err);
            
            response.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            });
        });
    }
}
