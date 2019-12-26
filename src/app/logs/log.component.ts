import { Component, OnInit } from '@angular/core';
import { JobService } from '../_services/job.service';
import { AlertService } from '../_services/alert.service';
import { Log } from '../_models/log';
import { TruncatePipe } from '../_pipes/transform'
import { DialogModule } from 'primeng/dialog';

@Component({
    templateUrl: 'log.component.html'
})

export class LogComponent implements OnInit {
    
    methodsOfDiscovery = [
        {label: 'Nexpose', value: 'Nexpose'},
        {label: 'Qualys', value: 'Qualys'}
    ];
    selectedMethod: string;//method of discovery (i.e. Nexpose or Qualys)

    jobTypes = [];
    selectedJobType: number;

    logTypes = [];
    selectedLogType: number;

    jobHistoryId: number;

    selectedLog: Log;
    selectedLogMessage: string;
    selectedLogError: string;


    logs: Log[];

    log: Log;

    cols: any[];

    fields: any[];

    display: boolean;

    totalRecords: number;

    filterDateFrom: Date;
    filterDateTo: Date;

    loading: boolean = false;

    constructor(
        private jobService: JobService,
        private alertService: AlertService,
        private truncatePipe: TruncatePipe
    ) {
        this.display = false;
    }

    ngOnInit() {

        this.cols = [
            { field: 'methodOfDiscovery', header: 'Method of Discovery' },
            { field: 'jobType', header: 'Job Type' },
            { field: 'logType', header: 'Log Type' },
            { field: 'jobHistoryId', header: 'Job History Id' },
        ];

        this.fields = [
            {field: 'id', header: 'Id'},
            {field: 'typeId', header: "Type Id"},
            {field: 'log', header: 'Log'},
            {field: 'error', header: 'Error'},
            {field: 'jobHistoryId', header: 'Job History Id'},
            {field: 'date', header: "Time"},
        ];
        
        this.jobService.getJobDropdown().subscribe(
            data => {
                for (let job of data.response) {
                    this.jobTypes.push({label: job.name, value: job.code});
                }
            },
            error => {
                AlertService.error(error.error.message);
            }
        );

        this.jobService.getLogTypes().subscribe(
            data => {
                for (let logType of data.response) {
                    this.logTypes.push({label: logType.name, value: logType.id});
                }
            },
            error => {
                AlertService.error(error.error.message);
            }
        );

    }

    handleClick(event) {
        this.loading = true;

        this.logs = [];
        this.totalRecords = 0;

        if (this.selectedMethod == null) {
            this.selectedMethod = undefined;
        }

        if (this.selectedJobType == null) {
            this.selectedJobType = undefined;
        } 

        if (this.selectedLogType == null) {
            this.selectedLogType = undefined;
        }

        if (this.jobHistoryId == null) {
            this.jobHistoryId = undefined;
        }

        if (this.filterDateFrom != undefined && this.filterDateFrom != null) {
            if (this.filterDateFrom.toString().length == 0) {
                this.filterDateFrom = undefined;
            }
        }

        if (this.filterDateTo != undefined && this.filterDateTo != null) {
            if (this.filterDateTo.toString().length == 0) {
                this.filterDateTo = undefined;
            }
        }

        this.jobService.getLogs(this.selectedMethod, this.selectedJobType, this.selectedLogType, this.jobHistoryId, this.filterDateFrom, this.filterDateTo).subscribe(
            data => {
                this.logs = data.response;
                if (this.logs != null) {
                    this.totalRecords = this.logs.length;
                }
                this.loading = false;
            },
            error => {
                AlertService.error(error.error.message);
            }
        );
    }

    onRowSelect(event) {
        this.display = true;
        this.selectedLogMessage = this.selectedLog.log;
        this.selectedLogError = this.selectedLog.error;
    }

    onRowUnselect(event) {
        this.selectedLogMessage = "";
        this.selectedLogError = "";
        this.display = false;
    }
}