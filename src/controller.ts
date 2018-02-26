import { handle } from './config';
import { Context, Callback, APIGatewayProxyResult } from 'aws-lambda';

class MainController {
    @handle({
        method: 'POST',
        path: 'create-rungo-route'
    })
    async createRunGoRouteFromGpx(event: any, context: Context): Promise<APIGatewayProxyResult> {
        return {
            statusCode: 200,
            body: 'Hello world'
        };
    }
}