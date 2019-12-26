import { Component } from '@angular/core';
import { AppComponent} from './app.component';
import { UserService } from './_services/user.service';
import { AuthenticationService } from './_services/authentication.service';
import { Organization } from './_models/org';
import { OrganizationService } from './_services/organization.service';
import { AlertService } from './_services/alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

  username: string;

  orgsUserIsAMemberOf: Organization[];
  selectedUserOrg: Organization;
  previousUserOrg: Organization;
  

    constructor(public app: AppComponent,
                private userService: UserService,
                private authenticationService: AuthenticationService,
                private organizationService: OrganizationService,
                private alertService: AlertService,
                private activatedRoute: ActivatedRoute) {
      
      // if leaving a login page, check to see if the organizations for the user have been found
      // if not, query the API and find all organizations the user is a member of
      if (this.orgsUserIsAMemberOf == null || this.orgsUserIsAMemberOf == undefined) {
        
        this.organizationService.getOrganizationsForUser().subscribe(
          
          data => {
            // grab all the organizations the user is a member of from the server
            this.orgsUserIsAMemberOf = data.response;

            if (localStorage.getItem('orgid') == null || localStorage.getItem('orgid') == undefined) {
              this.organizationService.getMyOrg().subscribe(
                data => {
                  localStorage.setItem('orgid', data.response.org_id);
                  this.setSelectedOrgFromCache();
                },
                error => {
                  AlertService.error(error.error.message);
                }
              )
            } else {
              this.setSelectedOrgFromCache();
            }

            
            this.updateUserOrgFromQueryParam();
          },
          error => {
            AlertService.error(error.error.message);
          }
        )
      } else {
        this.updateUserOrgFromQueryParam();
      }

      if (this.username == null || this.username == undefined) {
        if (localStorage.getItem('username') == null) {
          this.userService.getName().subscribe(
            data=> {
              this.username = data.response;
              localStorage.setItem('username', data.response)
            }
          )
        } else {
          this.username = localStorage.getItem('username')
        }
      }
    }

     // this takes the ?org=ORGANIZATION parameters and updates the user session to that organization
  updateUserOrgFromQueryParam() {
    this.activatedRoute.queryParams.subscribe(params => {
      var org = params['org'];
      if (org != undefined && org != null) {
        
        for (let possibleOrg of this.orgsUserIsAMemberOf) {
          
          if (org == possibleOrg.description) {
            this.selectedUserOrg = possibleOrg;
            localStorage.setItem('orgid', this.selectedUserOrg.org_id.toString())
            // switch the user session to that organization
            this.changeUserOrg(this.selectedUserOrg);
          }
        }

      }
    });
  }

  setSelectedOrgFromCache() {
    // attempt to get the organization the user previously selected from memory
    if (localStorage.getItem('orgid') != null && localStorage.getItem('orgid') != undefined) {
      // if the stored value in memory is amongst the organizations the user is a member of, set the dropdown to it
      for (let org of this.orgsUserIsAMemberOf) {
        if (org.org_id == localStorage.getItem('orgid')) {
          this.selectedUserOrg = org;
        }
      }
    }
  }

  // this takes the organization provided in the org dropdown and changes the user session to that organization
  changeOrganization(orgCode: string) {
    for (let possibleOrg of this.orgsUserIsAMemberOf) {
      if (possibleOrg.code == orgCode) {
        this.changeUserOrg(possibleOrg);
        break;
      }
    }
  }

  // this changes the user session to the provided organization
  changeUserOrg(org: Organization) {
    if (org != null && org != undefined) {
      this.authenticationService.changePermission(org.org_id).subscribe(
        data => {
          localStorage.setItem('orgid', org.org_id.toString())
          this.previousUserOrg = org;
          this.selectedUserOrg = org;
          location.reload();
        },
        error => {
          AlertService.error('Unable to swap to organization');
          this.selectedUserOrg = this.previousUserOrg;
        }
      )
      
    }
  }

    logout() {
      this.authenticationService.logout();
    }
}
