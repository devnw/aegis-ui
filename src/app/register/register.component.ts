import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertService } from '../_services/alert.service';
import { RegistrationService } from '../_services/registration.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private registrationService: RegistrationService,
        private alertService: AlertService) { }

    register() {
        this.loading = true;

        this.registrationService.register(this.model.firstName, this.model.lastName, this.model.username)
            .subscribe(
                data => {
                    AlertService.success('Registration successful', true);
                },
                error => {
                    AlertService.error(error.error.message);
                    this.loading = false;
                }
            );
    }
}
