export interface RouteDefinition<T extends Function> {
    path: string;
    requestMethod: 'get' | 'post' | 'delete' | 'options' | 'put';
    methodName: keyof T['prototype'];
}
