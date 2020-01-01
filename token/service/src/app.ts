import express, { Application, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default class App {
    private app: Application;

    constructor () {
        this.app = express();
        this.app.use(express.json());
    }

    public listen () {
        this.registerRoutes();

        this.app.listen(80, 'token-service', () => console.log('Service: `token` is ready for HTTP requests!'));
    }

    private registerRoutes () {
        const secret = 'secret';

        async function generate (request: Request, response: Response, _next: NextFunction) {
            const { user, scope } = request.body;

            if (!user || !user.id) {
                return response.status(400).json({
                    message: 'The server could not understand the request due to invalid syntax.',
                });
            }

            const token = jwt.sign({
                data: {
                    user_id: user.id as number,
                    scope: (scope as string).split(' '),
                },
            }, secret, { expiresIn: '1h' });

            response.status(200).json({
                token,
            });
        }

        async function satisfies (request: Request, response: Response, _next: NextFunction) {
            const { token, scope } = request.body;

            const permissions = (scope as string).split(' ');
            jwt.verify(token, secret, (err: jwt.VerifyErrors, decoded: object | string) => {
                if (err) {
                    return response.status(401).json({
                        message: 'API key is missing or invalid.',
                        errors: [err]
                    });
                }

                const tokenData = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;

                // TODO: verify permissions

                response.status(403).json({
                    message: 'Token does not have the required scope.',
                });
            });
        }

        this.app.post('/generate', async (request: Request, response: Response, next: NextFunction) => {
            generate(request, response, next)
                .catch(next);
        });

        this.app.post('/satisfies', async (request: Request, response: Response, next: NextFunction) => {
            satisfies(request, response, next)
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
