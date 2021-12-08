import * as express from 'express';
import { logger } from '../../logger';
import { express_app } from '../../server';

/**
 *
 *
 * @export
 * @class IntegrationHelpers
 */
export default class IntegrationHelpers {
    public static appInstance: express.Application;

    /**
     *
     *
     * @static
     * @return {*}  {Promise<express.Application>}
     */
    public static async getApp (): Promise<express.Application> {
        if ( this.appInstance ) {
            return this.appInstance;
        }
        const app: express_app = new express_app( { ip: '127.0.0.1', port: 3030 },
            new logger( { debug: false,
                info: false,
                warn: false,
                error: false,
                prefix: 'INTEGRATION_SERVER',
            } ) );
        app.init().listen();
        this.appInstance = app.app;
        return this.appInstance;
    }
}
