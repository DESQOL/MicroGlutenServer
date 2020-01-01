import { Request } from 'express';
import axios, { AxiosResponse } from 'axios';

export function getService (service: 'recipe' | 'token' | 'user') {
    return class Service {
        static async get (uri: string, request: Request): Promise<AxiosResponse<any>> {
            return axios.get(`http://${service}-service${uri}${request.url.substr(request.path.length)}`, { validateStatus: () => true });
        }

        static async post (uri: string, request: object | Request): Promise<AxiosResponse<any>> {
            let data;
            if (request.constructor.name === 'IncomingMessage') {
                data = (request as Request).body;
            } else {
                data = request;
            }

            return axios.post(`http://${service}-service${uri}`, data, { validateStatus: () => true });
        }
    };
}
