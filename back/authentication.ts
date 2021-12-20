import { database, DATABASE_ERROR_CODES } from './database';
import { logger } from './logger';

export interface auth_module_config {
    MS_PER_TTL_TICK: number,
    NEW_TTL_ON_ACTION: number,
    NEW_TTL_ON_LOGIN: number,
}

/**
 * NOT YET TESTED OR USED
 * AWAITING DATABASE METHOD IMPLEMENTATION
 *
 * Module to keep track of registration and logging in.
 * Stores user data in database
 * Constantly stores active users in objects, updates their ttl and
 *      removes them upon timeout
 *
 * @export
 * @class auth_server
 */
export class auth_module {
    private active_users: { [ cookie: string ]: { username: string, ttl: number } } = {};

    ttl_iteration_timeout: NodeJS.Timeout;

    /**
     * Creates an instance of auth_server.
     */
    constructor (
            public config:auth_module_config,
            private database: database,
            public logger: logger ) {
        this.ttl_iteration_timeout = setTimeout( () => {
            this.ttl_iteration();
        }, this.config.MS_PER_TTL_TICK );
    }

    /**
     * Iterates over all active users
     * Decrements ttl
     * Calls forget_user for each user with ttl <= 0
     *
     */
    ttl_iteration () {
        const to_remove: Array<string> = [];
        for ( const prop in this.active_users ) {
            if ( this.active_users[prop].ttl <= 0 ) {
                to_remove.push( prop );
            } else {
                this.active_users[prop].ttl -= 1;
            }
        }
        for ( const prop of to_remove ) {
            this.forget_user( prop, 'TTL timed out' );
        }
        clearTimeout( this.ttl_iteration_timeout );
        this.ttl_iteration_timeout = setTimeout( () => {
            this.ttl_iteration();
        }, this.config.MS_PER_TTL_TICK );
    }

    /**
     * Returns username if user with such cookie logged in
     * Undefined otherwise
     *
     * @param {string} [cookie]
     * @return { string | undefined }
     */
    get_username_by_cookie ( cookie?: string ): string | undefined {
        if ( cookie == undefined ) {
            return undefined;
        }
        if ( cookie in this.active_users ) {
            return this.active_users[cookie].username;
        }
        return undefined;
    }


    /**
     * Checks if username is valid.
     * Should contain [3, 16] symbols.
     * First symbol is a-z | A-Z
     * Others a-z | A-Z | 0-9 | _
     *
     * @param {string} username
     * @return {*} boolean
     */
    is_username_valid ( username: string ): boolean {
        const regex = /^[a-zA-Z]([a-zA-Z0-9_]{2,15})$/;
        return regex.test( username );
    }

    /**
     * Checks if username in db and passwd_hash match
     * Loggs in if all checks passed
     * Remebers user if succ
     *
     * Throws errors originated in db
     *
     * @param {string} cookie
     * @param {string} username
     * @param {string} passwd_hash
     */
    async login ( cookie: string, username: string, passwd_hash: string ):
    Promise<{ succ: boolean, description: string }> {
        return await this.database.retrieve_user_passwd( username )
            .then( ( val ) => {
                if ( val.username == username && val.passwd_hash == passwd_hash ) {
                    this.remember_user( cookie, username, 'Login successful' );
                    return { succ: true, description: 'Login successful' };
                } else {
                    return { succ: false, description: 'Login or password dosen\'t match' };
                }
            } )
            .catch( ( err ) => {
                if ( err.code == DATABASE_ERROR_CODES.NOT_FOUND && err.origin == 'database' ) {
                    return { succ: false, description: 'No such user found' };
                    // Or should it be login\passwd doesnt match?
                } else {
                    throw err;
                }
            } );
    }


    /**
     * Removes cookie from active users
     * If succ true, operation was successful
     *
     * @param {string} cookie
     * @return {*}  {{ succ: boolean, description: string }}
     */
    exit ( cookie: string ): { succ: boolean, description: string } {
        if ( this.get_username_by_cookie( cookie ) != undefined ) {
            this.forget_user( cookie );
            if ( this.get_username_by_cookie( cookie ) == undefined ) {
                return { succ: true, description: 'Exit successful' };
            } else {
                return { succ: false, description: 'User active after forget... Magic?' };
            }
        } else {
            return { succ: false, description: 'User is not active' };
        }
    }


    /**
     * Registers user. If all check passed, adds to database and loggs in
     *
     * Throws errors originated in db
     *
     * @param {string} cookie
     * @param {string} username
     * @param {string} passwd_hash
     * @return {*}  {Promise<{ succ: boolean, description: string }>}
     */
    async register ( cookie: string, username: string, passwd_hash: string ):
    Promise<{ succ: boolean, description: string }> {
        if ( !this.is_username_valid( username ) ) {
            this.remember_user( cookie, username );
            return { succ: false, description: 'Username is not valid' };
        }
        return await this.database.add_passwd_for_user( username, passwd_hash )
            .then( ( ) => {
                this.remember_user( cookie, username, 'Login successful' );
                return { succ: true, description: 'Registration successful' };
            } )
            .catch( ( err ) => {
                if ( err.code == DATABASE_ERROR_CODES.ALREADY_PRESENT &&
                     err.origin == 'database' ) {
                    return { succ: false, description: 'Username already taken' };
                }
                throw err;
            } );
    }


    /**
     * Updates ttl to keep activve user active
     *
     * @param {string} cookie
     * @param {string} [reason]
     */
    user_action ( cookie: string, reason?: string ) {
        this.update_ttl( cookie, reason );
    }


    /**
     * Updates user's ttl to NEW_TTL_ON_ACTION if it is bigger then current ttl
     *
     * @private
     * @param {string} cookie
     * @param {string} [reason]
     */
    private update_ttl ( cookie: string, reason?: string ) {
        if ( cookie in this.active_users ) {
            const new_ttl = this.active_users[cookie].ttl > this.config.NEW_TTL_ON_ACTION ?
                this.active_users[cookie].ttl : this.config.NEW_TTL_ON_ACTION;
            this.logger.debug(
                `Updated ttl for a user "${this.active_users[cookie]?.username}" from ${
                    this.active_users[cookie]?.ttl} to ${new_ttl} was removed ${reason ==
                    undefined ? 'without reason' :`because "${reason}"`}. Cookie: ${cookie}`,
            );
            this.active_users[cookie].ttl = new_ttl;
        }
    }

    /**
     * Removes user from active_users
     * Loggs action and adds reason to log
     *
     * @private
     * @param {string} cookie
     * @param {string} [reason]
     */
    private forget_user ( cookie: string, reason?: string ) {
        if ( !( cookie in this.active_users ) ) {
            this.logger.warn( `Attempt to remove non existant user with cookie ${cookie}` );
            return;
        }
        this.logger.info( `REMOVED User "${
            this.active_users[cookie]?.username}" with time remaining ${
            this.active_users[cookie]?.ttl} was removed ${reason == undefined ? 'without reason' :
            `because "${reason}"`}. Cookie: ${cookie}` );
        delete this.active_users[cookie];
    }


    /**
     * Adds ( cookie username ) pair to active_users
     * Sets ttl equal to NEW_TTL_ON_LOGIN to user
     * Loggs action and adds reason to log
     *
     * @private
     * @param {string} cookie
     * @param {string} username
     * @param {string} [reason]
     */
    private remember_user ( cookie: string, username: string, reason?: string ) {
        if ( !( cookie in this.active_users ) ) {
            this.logger.info( `ADDED User "${
                this.active_users[cookie]?.username}" with TTL ${
                this.config.NEW_TTL_ON_ACTION} ${reason == undefined ? 'without reason' :
                `because "${reason}"`}. Cookie: ${cookie}` );

            this.active_users[cookie] = { username: username, ttl: this.config.NEW_TTL_ON_LOGIN };
        } else {
            this.logger.warn( `REPLACED User "${
                this.active_users[cookie]?.username}" with TTL ${
                this.config.NEW_TTL_ON_ACTION} ${reason == undefined ? 'without reason' :
                `because "${reason}"`}. Cookie: ${cookie}` );

            this.active_users[cookie] = { username: username, ttl: this.config.NEW_TTL_ON_LOGIN };
        }
    }
}
