import { Request } from 'express';
import axios, { AxiosResponse } from 'axios';

export function getService (service: 'recipe' | 'user') {
    return class Service {
        static async get (uri: string, request: Request): Promise<AxiosResponse<any>> {
            return axios.get(`http://${service}-service${uri}${request.url.substr(request.path.length)}`, { validateStatus: () => true });
        }

        static async post (uri: string, request: Request): Promise<AxiosResponse<any>> {
            return axios.post(`http://${service}-service${uri}`, request.body, { validateStatus: () => true });
        }
    };
}
