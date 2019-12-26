import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertService } from '../_services/alert.service';
import { RegistrationService } from '../_services/registration.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/user';
import { Permission } from '../_models/permission';
import { UserListService } from '../_services/user_list.service';   
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button'
import { Organization } from '../_models/org';
import { OrganizationService } from '../_services/organization.service';
import { PermissionService } from '../_services/permission.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';



@Component({
    templateUrl: 'user_edit.component.html'
})

export class UserEditComponent implements OnInit {
    // Holds the user information for filling out the textboxes
    user: User;
    originalUser: User;
    
    // Holds all permissions discovered in the database
    permissions: Permission[];

    // Holds the permissions that the user has for the selected organization
    selectedPermissions: string[];

    // Holds all the organizations discovered in the database
    organizations: Organization[];

    // Holds the organization currently selected in the dropdown
    selectedOrg: Organization;

    // Maps the organization ID to the permissions that they have for that organziation
    mapOrgToSelectedPermission: { [key:string]: string[]} = {};

    // Allows us to remember which organization was selected before overwriting it with the permissions of the newly selected organization
    previousOrg: string;

    // Holds the organizations that a user previously did not have an entry in the permissions table for
    newOrganizationsForUser: string[];


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userListService: UserListService,
        private alertService: AlertService,
        private organizationService: OrganizationService,
        private permissionService: PermissionService,
        private userService: UserService) {}

    handleCancelClick() {
        this.router.navigate(['/users']);
    }

    handleResetClick() {
        this.copyUser(this.user, this.originalUser);
    }

    handleClick() {

        if (this.userService.checkUserData(this.user)) {
            this.userListService.updateUser(this.user.id, this.user.username, this.user.firstname,
                this.user.lastname,  this.user.email, this.user.isdisabled).subscribe(
                    data => {
                        AlertService.success('User information update successful', true);
                        this.copyUser(this.originalUser, this.user);
                        
                        if (this.previousOrg != null) {
                            this.mapOrgToSelectedPermission[this.previousOrg] = this.selectedPermissions;
                        }
                        
                        
                        for (let orgId in this.mapOrgToSelectedPermission) {
                            if (this.userService.exists(this.newOrganizationsForUser, orgId)) {
                                // The user does not have permissions for this organization yet
                                if (this.mapOrgToSelectedPermission[orgId].length > 0) {
                                    this.permissionService.createUserPermissions(this.user.id, orgId, this.mapOrgToSelectedPermission[orgId]).subscribe(
                                        data => {},
                                        error => {
                                            AlertService.error(error.error.message);
                                        }
                                    )
                                }
                            } else {
                                // The user already has permissions for this organization
                                    this.permissionService.updateUserPermissions(this.user.id, orgId, this.selectedPermissions).subscribe(
                                    data => {},
                                    error => {
                                        AlertService.error(error.error.message);
                                    }
                                )
                            }
                        }
                        
                        
                    },
                    error => {
                        AlertService.error(error.error.message);
                    }
            );
        } else {
            AlertService.error('Invalid form data');
        }       
    }

    // This function is called when an organization is selected from the dropdown
    orgSelected(event) {
        // An organization was selected
        if (event.value != null) {
            const userId = this.route.snapshot.paramMap.get('id');

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
    
            if (userId.length > 0) {
                // Grab the current selected organizations from the dropbox
                var currentOrgId = event.value.org_id;
    
                // Permissions not yet loaded from the database for this organization
                if (this.mapOrgToSelectedPermission[currentOrgId] == null) {
                    this.mapOrgToSelectedPermission[currentOrgId] = [];
    
                    this.permissionService.getUserPermissions(userId, currentOrgId).subscribe(
                        // Permissions found for this organization/user combo in db, load them into memory
                        obj => {
                            this.permissions = obj.response;
                            
                            if (this.permissions != null && this.permissions != undefined) {
                                for (let perm of this.permissions) {
                                    if (perm.value) {
                                        // Selected permissions holds all the permissions that the user does have
                                        this.selectedPermissions.push(perm.name);
                                        this.mapOrgToSelectedPermission[currentOrgId].push(perm.name);
                                    }
                                }
                            } else {
                                AlertService.error('Empty response from server');
                            }
    
                        },
                        // No permissions found for this organization/user combo in the db, create empty permissions for them
                        error => {
                            this.mapOrgToSelectedPermission[currentOrgId] = [];
                            this.newOrganizationsForUser.push(currentOrgId);
                        },
                    );
                } else {
                    // Cache hit - load the selected permissions from memory
                    this.selectedPermissions = this.mapOrgToSelectedPermission[currentOrgId];
                }
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

    copyUser(first: User, second: User) {
        first.id = second.id;
        first.email = second.email;
        first.firstname = second.firstname;
        first.lastname = second.lastname;
        first.username = second.username;
        first.isdisabled = second.isdisabled;
    }

    // TODO include db logs
    ngOnInit() {
        const userId = this.route.snapshot.paramMap.get('id');

        if (userId.length > 0) {
            this.newOrganizationsForUser = [];

            // Loads the user information to populate the text boxes
            this.userListService.getUserById(userId).subscribe(obj => {
                this.user = obj.response;
                if (this.user) {
                    this.originalUser = new User();
                    this.copyUser(this.originalUser, this.user);
                } else {
                    AlertService.error('Could not find user');
                }
            });

            // Loads the organizations to populate the organization dropdown box
            // TODO only get organizations that the editor can modify
            this.organizationService.getAllOrganizations().subscribe(
                data => {
                    this.organizations = data.response;
                },
                error => {
                    AlertService.error(error.error.message);
                }
            )
        } else {
            AlertService.error('Invalid user ID');
        }
    }
}
