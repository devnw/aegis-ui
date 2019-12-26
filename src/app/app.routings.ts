import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserListComponent } from './user_list/user_list.component';
import { UserEditComponent } from './user_edit/user_edit.component';
import { UserCreateComponent } from './user_create/user_create.component';
import { BulkUpdateComponent } from './bulk_update/bulk_update.component';
import { LogComponent } from './logs/log.component';
import { ScansComponent } from './scans/scans.component';
import { VulnerabilitiesComponent } from './vulnerabilities/vulnerabilities.component';
import { TagComponent } from './tags/tags.component';
import { SourceConfigsComponent } from './source_configs/source_configs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobConfigsComponent } from './job_configs/job_configs.component';
// import { ExceptionsComponent } from './exceptions/exceptions.component';
import { JiraStatusMapComponent } from './jira_status_map/jira_status_map.component';

const appRoutes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'jobhistory', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'jobconfigs', component: JobConfigsComponent, canActivate: [AuthGuard] },
    { path: 'jobconfigs/:id', component: JobConfigsComponent, canActivate: [AuthGuard] },
    // { path: 'exceptions', component: ExceptionsComponent, canActivate: [AuthGuard] },
    // { path: 'exceptions/:id', component: ExceptionsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: 'users/:id', component: UserEditComponent, canActivate: [AuthGuard] },
    { path: 'new-user', component: UserCreateComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
    { path: 'update', component: BulkUpdateComponent, canActivate: [AuthGuard] },
    { path: 'logs', component: LogComponent, canActivate: [AuthGuard] },
    { path: 'scans', component: ScansComponent, canActivate: [AuthGuard] },
    { path: 'vuln', component: VulnerabilitiesComponent, canActivate: [AuthGuard] },
    { path: 'tags', component: TagComponent, canActivate: [AuthGuard] },
    { path: 'jira_map', component: JiraStatusMapComponent, canActivate: [AuthGuard] },
    { path: 'source_configs', component: SourceConfigsComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
