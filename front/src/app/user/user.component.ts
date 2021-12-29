import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from '../shared-data.service';


@Component( {
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
} )
/**
 *
 *
 * @export
 * @class UserComponent
 * @implements {OnInit}
 */
export class UserComponent implements OnInit {
    username: string = '';
    active_tab: string = 'Books';

    /**
     * Creates an instance of UserComponent.
     */
    constructor (
        public shared_data: SharedDataService,
        private active_route: ActivatedRoute,
    ) { }

    // eslint-disable-next-line require-jsdoc
    ngOnInit (): void {
        this.username = this.active_route.snapshot.paramMap.get( 'username' ) || 'null';
    }
}
