import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertService } from '../_services/alert.service';
import { RegistrationService } from '../_services/registration.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { UserListService } from '../_services/user_list.service';
import { User } from '../_models/user';

@Component({
    templateUrl: 'user_list.component.html'
})

export class UserListComponent implements OnInit {
    initialized: boolean;
    users: User[];
    cols: any[];

    constructor(
        private router: Router,
        private userListService: UserListService,
        private registrationService: RegistrationService,
        private alertService: AlertService) { 
            this.initialized = true;
        }
    
    ngOnInit() {
        this.userListService.getAllUsers().subscribe(
            obj => {
                this.users = obj.response;
            },
            error => {
                AlertService.error(error.error.message);
            }
        );

        this.cols = [
            { field: 'username', header: 'Username' },
            { field: 'firstname', header: 'First Name' },
            { field: 'lastname', header: 'Last Name' },
            { field: 'email', header: 'Email' },
            { field: 'isdisabled', header: 'Disabled' }
        ];
    }

    handleClick() {
        this.router.navigate(['new-user']);
    }
}
