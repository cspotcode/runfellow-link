import * as Path from 'path';
import { T, cache, Proto, Ctor, __code, HasProps, __root } from './misc';
import { memoize, once, uniq, fromPairs } from 'lodash';
import { APIGatewayProxyResult, Callback, Context } from 'aws-lambda';

/** "functions" structure in serverless.yml */
export const functions: {[name: string]: {
    handler: string;
    events: {
        http: {
            path: string;
            method: HttpMethod;
            cors: boolean;
        }
    }[]
}} = {};

// Returns all named exports of the ./handlers module
export const handlers = once(() => {
    // Instantiate all singletons
    const instances = new Map<Ctor<TODO>, TODO>();
    for(const ctor of uniq(allHandlerMethods.map(v => v.targetPrototype.constructor) as Ctor<TODO>[])) {
        instances.set(ctor, new ctor());
    }
    // instantiate all handler fns which are proxies to the corresponding method
    return fromPairs(allHandlerMethods.map(handler => {
        const instance = instances.get(handler.targetPrototype.constructor as TODO);
        return [handler.handlerName, function(event: any, context: Context, callback: Callback): void {
            (instance[handler.methodName] as HandlerMethod)(event, context).then((result: APIGatewayProxyResult) => {
                callback(undefined, result);
            }, (e: any) => {
                callback(e);
            });
        }];
    }));
});

/**
 * Signature for a method that handles incoming APIGateway requests.
 * Slightly different than AWS's API because we use promises instead of a callback.
 */
type HandlerMethod = (event: any, context: Context) => PromiseLike<APIGatewayProxyResult>;

/** Decorator to register methods as handlers */
export function handle(opts: HandlerOptions) {
    const fullOpts = {
        ...defaultHandlerOptions,
        ...opts
    };
    return decorator;
    function decorator<Prop extends string>(targetPrototype: HasProps<Prop, HandlerMethod> & Proto, methodName: Prop) {
        const m: HandlerMethodDescriptor = {
            handlerName: '',
            methodName,
            targetPrototype
        };
        m.handlerName = handlerFnName(m);
        allHandlerMethods.push(m);
        // Add entry to .yml config
        functions[methodName] = {
            handler: m.handlerName,
            events: [{
                http: {
                    cors: fullOpts.cors,
                    method: fullOpts.method,
                    path: fullOpts.path
                }
            }]
        }
    }
}

const handlerModulePath = 'out/handlers';

interface HandlerMethodDescriptor {
    targetPrototype: Proto;
    methodName: string;
    handlerName: string;
}

const allHandlerMethods: Array<HandlerMethodDescriptor> = [];

export type HttpMethod = 'GET' | 'PUT' | 'POST';

interface HandlerOptions {
    method?: HttpMethod;
    path: string;
    cors?: boolean;
}
const defaultHandlerOptions = T<Partial<HandlerOptions>>()({
    method: 'GET',
    cors: false
});

function handlerFnName(m: HandlerMethodDescriptor) {
    return `${ handlerModulePath }.${ m.targetPrototype.constructor.name }__${ m.methodName }`;
}
