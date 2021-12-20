import { auth_module } from '../../authentication';
import { database, database_config } from '../../database';
import { logger } from '../../logger';
import { express_app } from '../../server';

export interface integration_helpers_config {
    server_port?: number
    db_name?: string
}

/**
 *
 *
 * @export
 * @class IntegrationHelpers
 */
export class integration_helpers {
    public sever_instance?: express_app;
    public db_instance?: database;

    /**
     * Creates an instance of IntegrationHelpers.
     */
    constructor ( public config: integration_helpers_config ) {

    }

    /**
     * db_instance should be defined before use
     *
     * @return {*}  {Promise<database>}
     */
    public async get_database ( ): Promise<database> {
        if ( this.config.db_name == undefined ) {
            throw new Error( 'get_database used but db_name not specified in config' );
        }
        if ( this.db_instance ) {
            return this.db_instance;
        }
        const database_config: database_config = {
            address: 'mongodb://root:example@127.0.0.1:27017/',
            // address: 'mongodb://localhost:27017',
            db_name: this.config.db_name,
        };
        this.db_instance = new database(
            database_config,
            new logger(
                { debug: false,
                    info: false,
                    warn: false,
                    error: false,
                    prefix: 'DB',
                } ) );
        return this.db_instance;
    }


    /**
     * server_port should be specified in config in order to be used
     *
     * @param {auth_module} [auth]
     * @return {*}  {Promise<express_app>}
     */
    public async get_server ( auth?: auth_module ): Promise<express_app> {
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
            } ),
            auth );
        await this.sever_instance.init().listen();
        return this.sever_instance;
    }
}
