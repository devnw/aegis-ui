// import { ExceptionsComponent } from './exceptions/exceptions.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { JobConfigService } from './_services/job-config.service';
import { JobService } from './_services/job.service';
import { UserService } from './_services/user.service';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { TagService } from './_services/tag.service';
import { AuthGuard } from './_guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routing } from './app.routings';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertComponent } from './_directives/alert.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { JiraStatusMapComponent } from './jira_status_map/jira_status_map.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { BulkUpdateComponent } from './bulk_update/bulk_update.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { JobHistoryService } from './_services/job-history.service';
import { RegistrationService } from './_services/registration.service';
import { UserListComponent } from './user_list/user_list.component';
import { UserListService } from './_services/user_list.service';
import { OrganizationService } from './_services/organization.service';
import { JiraService } from './_services/jira.service';
import { PermissionService } from './_services/permission.service';
import { UserEditComponent } from './user_edit/user_edit.component';
import { BulkUpdateService } from './_services/bulk_update.service';
import {ChipsModule} from 'primeng/chips';
// import { SocketService } from './_services/socket.service';
import { UserCreateComponent } from './user_create/user_create.component';
import { JobConfigsComponent } from './job_configs/job_configs.component';
import { VulnerabilitiesComponent } from './vulnerabilities/vulnerabilities.component';
import { LogComponent } from './logs/log.component';
import { TruncatePipe } from './_pipes/transform';
import { ScansComponent } from './scans/scans.component';
import { ScanService } from './_services/scan.service';
import { VulnerabilityService } from './_services/vulnerability.service';

import { AppRightPanelComponent } from './app.rightpanel.component';
import { AppMenuComponent, AppSubMenuComponent } from './app.menu.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { GrowlModule } from 'primeng/growl';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import {MessagesModule} from 'primeng/messages';
import {ToastModule} from 'primeng/toast';
import {MessageModule} from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScheduleModule } from 'primeng/schedule';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { MatStepperModule } from '@angular/material/stepper';
import { DragDropModule } from 'primeng/dragdrop';


import 'chart.js/dist/Chart.min.js';
import { TagComponent } from './tags/tags.component';
import { ExceptionsService } from './_services/exceptions.service';
import { SourceConfigsComponent } from './source_configs/source_configs.component';
import { SourceConfigService } from './_services/source_config.service';



@NgModule({
  imports: [
    ToastModule,
    ChipsModule,
    BrowserModule,
    KeyFilterModule,
    ReactiveFormsModule ,
    HttpClientModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    DragDropModule,
    GalleriaModule,
    GrowlModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MessageModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    ScrollPanelModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    MatStepperModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    routing,
    TableModule ,
    InputTextModule,
    DialogModule,
    ButtonModule,
    SliderModule,
    MultiSelectModule,
    PanelMenuModule,
    MenuModule,
    ContextMenuModule,
    CheckboxModule,
    InputTextareaModule,
    ScrollPanelModule
  ],
  declarations: [
      AppComponent,
      AppRightPanelComponent,
      AppMenuComponent,
      AppSubMenuComponent,
      AppTopBarComponent,
      AppFooterComponent,
      AlertComponent,
      HomeComponent,
      LoginComponent,
      JiraStatusMapComponent,
      RegisterComponent,
      UserListComponent,
      UserEditComponent,
      UserCreateComponent,
      JobConfigsComponent,
      // ExceptionsComponent,
      BulkUpdateComponent,
      LogComponent,
      ScansComponent,
      VulnerabilitiesComponent,
      TagComponent,
      SourceConfigsComponent,
      DashboardComponent,
      TruncatePipe
  ],
  providers: [
      AuthGuard,
      AlertService,
      AuthenticationService,
      RegistrationService,
      UserService,
      {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
      },
      UserListService,
      BulkUpdateService,
      JobHistoryService,
      JobConfigService,
      ExceptionsService,
      OrganizationService,
      PermissionService,
      JobService,
      ScanService,
      VulnerabilityService,
      JiraService,
      TagService,
      SourceConfigService,
      TruncatePipe
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }


