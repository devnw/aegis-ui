import { JobConfigService } from './../_services/job-config.service';
import { AlertService } from './../_services/alert.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { JobHistoryService } from '../_services/job-history.service';
import { JobHistory, NameValue } from '../_models/job-history';
import {MenuItem} from 'primeng/api';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import {SelectItem} from 'primeng/api';
import { JobService } from '../_services/job.service';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['./dialog.css'],
})

export class HomeComponent implements OnInit {
    displayDialog: boolean;
    currentUser: User;
    jobs: JobHistory[] = [];
    cols: any[];
    job: JobHistory = {};
    selectedJob: JobHistory;
    newJob: boolean;
    items: MenuItem[];
    // lazy loading
    datasource: JobHistory[];
    loading: boolean;
    totalRecords: number;
    statuses: NameValue[];
    selectedStatus: NameValue;
    jobTypes: NameValue[];
    selectedJobType: NameValue;
    jobConfigs: NameValue[];
    selectedJobConfig: NameValue;

    statusesFilter: NameValue[];
    jobTypesFilter: NameValue[];
    jobConfigsFilter: NameValue[];
    histJobFieldsFilter: any;
    limit: number;
    rowsSize: number;
    initialized: boolean;


    constructor(private userService: UserService,
    private alertService: AlertService,
    private jobHistoryService: JobHistoryService,
    private jobService: JobService,
    private jobConfigService: JobConfigService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.jobService.getJobDropdown().subscribe(data => {
        this.jobTypes = data.response;
      });
      this.jobConfigService.getAllConfigs().subscribe(
        data => {
          this.jobConfigs = data.response;
        },
        error => {
          AlertService.error(error.error.message);
          this.loading = false;
        }
      );
      this.statuses = [
        {name: 'Pending', code: 1},
        {name: 'In Progress', code: 2},
        {name: 'Completed', code: 3},
        {name: 'Error', code: 4},
        {name: 'Cancelled', code: 5},
      ];
      this.initialized = true;
    }

    ngOnInit() {

        this.cols = [
          { field: 'job_id', header: 'Job ID' },
          { field: 'config_id', header: 'ConfigID' },
          { field: 'name', header: 'Configuration' },
          { field: 'status', header: 'Status' },
          { field: 'payload', header: 'Payload' }
      ];

      // this.loadAllUsers();
      this.loading = true;
    }

    loadJobsLazy(event: LazyLoadEvent) {
      this.loading = true;

      // in a real application, make a remote request to load data using state metadata from event
      // event.first = First row offset
      // event.rows = Number of rows per page
      // event.sortField = Field name to sort with
      // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
      // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

      // imitate db connection over a network
      if (this.initialized) {
      this.jobHistoryService.getAllHistoryJobs(event.first, event.rows, event.filters).subscribe(histories => {
        this.jobs = histories.response;
        this.totalRecords = histories.totalrecords;
        this.jobService.getJobDropdown().subscribe(dataJob => {
          this.jobTypes = dataJob.response;
          this.jobConfigService.getAllConfigs().subscribe(dataConfig => {
            this.jobConfigs = dataConfig.response;
            this.getLabelsAndOption();
            this.initialized = false;
            this.loading = false;
         });
        });
      });
    } else {
      this.jobHistoryService.getAllHistoryJobs(event.first, event.rows, event.filters).subscribe(histories => {
        this.jobs = histories.response;
        this.totalRecords = histories.totalrecords;
        this.getLabelsForCodes();
        this.loading = false;
      });
    }
      this.histJobFieldsFilter  = event.filters;
      this.limit = event.first;
      this.rowsSize = event.rows;
  }

    private loadAllUsers() {
        this.jobHistoryService.getAllHistoryJobs(0, 10, null).subscribe(histories => {
          this.jobs = histories.response;
          this.totalRecords = histories.totalrecords;
        });
    }

    showDialogToAdd() {
      this.newJob = true;
      this.job = {};
      this.job.config_id = 0;
      this.job.job_id = 0;
      this.displayDialog = true;
    }

  getLabelsForCodes() {
    if (this.jobs === undefined || this.jobs === null) {
      return;
    }
    for (const job of this.jobs) {
      if (this.jobConfigs !== undefined && this.jobTypes !== undefined && this.statuses !== undefined) {
      const configLabel = this.jobConfigs.find(x => x.code === job.config_id);
      if (configLabel) {
      job.name = configLabel.name;
      }
      const jobLabel = this.jobTypes.find(x => x.code === job.job_id);
      if (jobLabel) {
      job.job_id = jobLabel.name;
      }
      const statusLabel = this.statuses.find(x => x.code === job.status);
      if (statusLabel) {
      job.status = statusLabel.name;
      }
      }
  }

  }

  addAllOption() {
    this.statusesFilter = this.statuses.slice();
    this.statusesFilter.unshift({name: 'All', code: null});
    this.jobTypesFilter = this.jobTypes.slice();
    this.jobTypesFilter.unshift({name: 'All', code: null});
    this.jobConfigsFilter = this.jobConfigs.slice();
    this.jobConfigsFilter.unshift({name: 'All', code: null});
  }

  getLabelsAndOption() {
      this.getLabelsForCodes();
      this.addAllOption();
  }

  save() {
    this.loading = true;
      // const jobs = this.jobs;
      if (this.newJob) {
          // jobs.push(this.job);
          this.jobHistoryService.addHistoryJob(this.job).subscribe(obj => {
            if (obj.success) {
              this.job = null;
            }
          });
      } else {
          // jobs[this.jobs.indexOf(this.selectedJob)] = this.job;
          this.jobHistoryService.updateHistoryJob(this.job).subscribe(obj => {
            if (obj.success) {
              this.job = null;
            }
          });
      }

      this.jobHistoryService.getAllHistoryJobs(this.limit, this.rowsSize, this.histJobFieldsFilter).subscribe(histories => {
        this.jobs = histories.response;
        this.totalRecords = histories.totalrecords;
        this.getLabelsForCodes();
        this.loading = false;
      });
      this.job = null;
      this.displayDialog = false;

  }

  delete() {

      this.jobHistoryService.deleteHistoryJob(this.job.history_id).subscribe(obj => {
            if (obj.success) {
              this.job = null;
            }
            this.job = null;
            this.displayDialog = false;
            this.loading = true;
            this.jobHistoryService.getAllHistoryJobs(this.limit, this.rowsSize, this.histJobFieldsFilter).subscribe(histories => {
              this.jobs = histories.response;
              this.totalRecords = histories.totalrecords;
              this.getLabelsForCodes();
              this.loading = false;
            });
          });
  }

  onRowSelect(event) {
      this.newJob = false;
      this.job = this.cloneJob(event.data);
      const jobval = this.jobTypes.find(x => x.name === this.job.job_id);
      if (jobval) {
      this.job.job_id = jobval.code;
      }
      const statusval = this.statuses.find(x => x.name === this.job.status);
      if (statusval) {
      this.job.status = statusval.code;
      }
      this.displayDialog = true;
  }
  change(event) {

  }

  cloneJob(j: JobHistory): JobHistory {
      const job = {};
      // tslint:disable-next-line:forin
      for (const prop in j) {
          job[prop] = j[prop];
      }
      return job;
  }
}
