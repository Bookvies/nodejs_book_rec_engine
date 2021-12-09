import { logger } from '../../logger';
import { express_app } from '../../server';

export interface integration_helpers_config {
    server_port?: number
}

/**
 *
 *
 * @export
 * @class IntegrationHelpers
 */
export class integration_helpers {
    public sever_instance?: express_app;

    /**
     * Creates an instance of IntegrationHelpers.
     */
    constructor ( public config: integration_helpers_config ) {
    }

    /**
     * server_port should be specified in config in order to be used
     *
     * @static
     * @return {*}  {Promise<express.Application>}
     */
    public async get_server (): Promise<express_app> {
        if ( this.config.server_port == undefined ) {
            throw new Error( 'get_server used but server_port not specified in config' );
        }
        if ( this.sever_instance ) {
            return this.sever_instance;
        }
        this.sever_instance = new express_app( { ip: '127.0.0.1', port: this.config.server_port },
            new logger( { debug: false,
                info: false,
                warn: false,
                error: false,
                prefix: 'INTEGRATION_SERVER',
            } ) );
        await this.sever_instance.init().listen();
        return this.sever_instance;
    }
}
