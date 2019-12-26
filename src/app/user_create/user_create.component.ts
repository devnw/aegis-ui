import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserListService } from '../_services/user_list.service';   
import { AlertService } from '../_services/alert.service';
import { OrganizationService } from '../_services/organization.service';
import { PermissionService } from '../_services/permission.service';
import { Router } from '@angular/router';
import { Permission } from '../_models/permission';
import { Organization } from '../_models/org';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';

@Component({
    templateUrl: 'user_create.component.html'
})

export class UserCreateComponent implements OnInit {
    // Binded to input fields
    bind_firstname:         string;
    bind_lastname:          string;
    bind_username:          string;
    bind_email:             string;
    activePermissions: string[];
    selectedPermissions: string[];
    // -----------------------
    permissions: Permission[];
    organizations: Organization[];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userListService: UserListService,
        private alertService: AlertService,
        private organizationService: OrganizationService,
        private permissionService: PermissionService,
        private userService: UserService) { 
            
        }

    

    // Holds the organization currently selected in the dropdown
    selectedOrg: Organization;

    // Maps the organization ID to the permissions that they have for that organziation
    mapOrgToSelectedPermission: { [key:string]: string[]} = {};

    // Allows us to remember which organization was selected before overwriting it with the permissions of the newly selected organization
    previousOrg: string;

    handleCancelClick() {
        this.router.navigate(['/users']);
    }

    handleResetClick() {
        this.bind_firstname = '';
        this.bind_lastname = '';
        this.bind_username = '';
        this.bind_email = '';
    }

    handleClick() {
        var user = new User();
        user.email = this.bind_email;
        user.lastname = this.bind_lastname;
        user.firstname = this.bind_firstname;
        user.username = this.bind_username;

        if (this.userService.checkUserData(user)) {
            this.userListService.createUser(this.bind_username, this.bind_firstname, this.bind_lastname, this.bind_email).subscribe(
                data => {
                    var newUserId = data.response.response
    
                    if (newUserId != null) {
                        AlertService.success("User created!");
    
                        if (this.previousOrg != null) {
                            this.mapOrgToSelectedPermission[this.previousOrg] = this.selectedPermissions;
                        }
                        
                        
                        for (let orgId in this.mapOrgToSelectedPermission) {
                            
                            // Create permissions for each organization selected
                            if (this.mapOrgToSelectedPermission[orgId].length > 0) {
                                this.permissionService.createUserPermissions(newUserId, orgId, this.mapOrgToSelectedPermission[orgId]).subscribe(
                                    data => {
                                        this.router.navigate(['/users']);
                                    },
                                    error => {
                                        AlertService.error(error.error.message);
                                    }
                                )
                            }
                        }
                    }
                },
                error => {
                    AlertService.error(error.error.message);
                }
            )
        } else {
            AlertService.error('Invalid form data');
        }             
    }

    ngOnInit() {
        this.selectedPermissions = [];

        this.organizationService.getAllOrganizations().subscribe(
            data => {
                this.organizations = data.response;
            },
            error => {
                AlertService.error(error.error.message);
            }
        )
    }


    // This function is called when an organization is selected from the dropdown
    orgSelected(event) {
        // An organization was selected
        if (event.value != null) {

            // The first organization was selected, load the permissions from the database
            if (this.permissions == null) {
                this.permissionService.getPermissionList().subscribe(
                    data => {
                        this.permissions = data.response;
                    },
                    error => {
                        AlertService.error(error.error.message);
                    },
                );
            }
    
            // Save the permissions that the user updated to memory
            if (this.selectedPermissions != null && this.previousOrg != null) {
                this.mapOrgToSelectedPermission[this.previousOrg] = this.selectedPermissions;
            }
            // Different set of permissions selected, so remove the permissions from the previous set
            this.selectedPermissions = [];
            this.previousOrg = event.value.org_id;
    
            
            // Grab the current selected organizations from the dropbox
            var currentOrgId = event.value.org_id;

            // Permissions not yet loaded from the database for this organization
            if (this.mapOrgToSelectedPermission[currentOrgId] == null) {
                this.mapOrgToSelectedPermission[currentOrgId] = [];
            } else {
                // Cache hit - load the selected permissions from memory
                this.selectedPermissions = this.mapOrgToSelectedPermission[currentOrgId];
            }
            
        } else {
            // This block hits when no organization is selected
            
            this.mapOrgToSelectedPermission[this.previousOrg] = this.selectedPermissions;

            // Deselect the selected permissions because no organization is selected
            this.selectedPermissions = [];

            // Set previousOrg to null as the permissions have already been saved
            this.previousOrg = null;

            // Set permissions to null so the permissions checkboxes disappear
            this.permissions = null;
        }
    }
}