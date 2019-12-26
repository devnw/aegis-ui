import { ActivatedRoute, Router } from '@angular/router';
import { JobConfigService } from './../_services/job-config.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { JobHistoryService } from '../_services/job-history.service';
import { JobHistory, NameValue } from '../_models/job-history';
import { MenuItem } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { JobService } from '../_services/job.service';
import { JobConfig, NameBool } from '../_models/job-config';
import { SourceConfigService } from '../_services/source_config.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Source } from '../_models/source';
import { AlertService } from '../_services/alert.service';

@Component({
    templateUrl: 'job_configs.component.html',
    styleUrls: ['./dialog.css'],
    providers: [MessageService]
})

export class JobConfigsComponent implements OnInit {
    displayDialog: boolean;
    disableSourceIn: boolean;
    ShowHTable: boolean;
    disableSourceOut: boolean;
    currentUser: User;
    cols: any[];
    jobConfig: JobConfig = {};
    jobConfigCopy: JobConfig = {};
    selectedJob: JobConfig;
    newJobConfig: boolean;
    items: MenuItem[];
    chipValues: string[];
    // lazy loading
    datasource: JobHistory[];
    loading: boolean;
    totalRecords: number;
    selectedStatus: NameValue;
    jobTypes: NameValue[];
    sourceConfigs: Source[];
    sourceInDynamic: NameValue[];
    sourceOutDynamic: NameValue[];
    selectedJobType: NameValue;
    jobConfigs: JobConfig[];
    selectedJobConfig: NameValue;
    Id: any;


    jobTypesFilter: NameValue[];
    sourceConfigsFilter: Source[];
    faleTrueFilter: NameBool[];
    faleTrueList: NameBool[];
    jobConfigFieldsFilter: any;
    sortField: any;
    sortOrder: any;
    limit: number;
    rowsSize: number;
    initialized: boolean;
    jobConfigsCopyVals: JobConfig[];

    // History fields
    historyDisplayDialog: boolean;
    jobs: JobHistory[] = [];
    hcols: any[];
    job: JobHistory = {};
    jobConfigsValues: NameValue[];
    statuses: NameValue[];
    hloading: boolean;
    htotalRecords: number;

    // Audit fields
    auditEntries: JobConfig[];
    auditCols: any[];

    // validation
    userform: FormGroup;
    submitted: boolean;
    description: string;

    // audit
    auditDisplayDialog: boolean;


    constructor(private jobHistoryService: JobHistoryService,
    private jobService: JobService,
    private jobConfigService: JobConfigService,
    private sourceConfigService: SourceConfigService,
    private route: ActivatedRoute,
    private router: Router,
    // validation
  private fb: FormBuilder, private messageService: MessageService) {
    
    this.jobService.getJobDropdown().subscribe(data => {
      this.jobTypes = data.response;
    });

    this.sourceConfigService.getAllSourceConfigs().subscribe( sourceData => {
      this.sourceConfigs = sourceData.response.sources;
    });

    this.faleTrueList = [
      {name: 'True', code: true},
      {name: 'False', code: false}
    ];
    
    // Job History data
    this.jobConfigService.getAllConfigs().subscribe(data => {
      this.jobConfigsCopyVals = data.response;
      this.jobConfigsValues = data.response;
    });

    this.statuses = [
      {name: 'Active', code: 1},
      {name: 'Running', code: 2},
      {name: 'Pending', code: 3},
      {name: 'Finished', code: 4},
      {name: 'Deleted', code: 5},
    ];

    this.auditCols = [
      {name: 'Active', val: 'Active'},
      {name: 'ID', val: 'ID'},
      {name: 'Job ID', val: 'JobID'},
      {name: 'Src In', val: 'DataInSourceConfigID'},
      {name: 'Src Out', val: 'DataOutSourceConfigID'},
      {name: 'Continuous', val: 'Continuous'},
      {name: 'Autostart', val: 'AutoStart'},
      {name: 'Priority Override', val: 'PriorityOverride'},
      {name: 'Wait in Seconds', val: 'WaitInSeconds'},
      {name: 'Max Instances', val: 'MaxInstances'},
      {name: 'Payload', val: 'Payload'},
      {name: 'Updated By', val: 'UpdatedBy'},
      {name: 'Updated', val: 'UpdatedDate'},
      {name: 'Created By', val: 'CreatedBy'},
      {name: 'Created', val: 'CreatedDate'},
      {name: 'Last Start', val: 'LastJobStart'},
      {name: 'Event Type', val: 'EventType'},
      {name: 'Event Date', val: 'EventDate'},
    ];

    this.initialized = true;
  }

    ngOnInit() {
    // Id passed in the URL
      const urlConfigId = this.route.snapshot.paramMap.get('id');
      if (urlConfigId) {
        if (urlConfigId.length > 0) {
          this.Id = urlConfigId;
        }
      }
 // validation
      this.userform = this.fb.group({
        'jobid': new FormControl('', Validators.required),
        'sourcein': new FormControl('', Validators.required),
        'sourceout': new FormControl('', Validators.required),
        'cont': new FormControl('', Validators.required),
        'autost': new FormControl('', Validators.required),
        'jobConfig.priority_override': new FormControl(''),
        'jobConfig.wait_in_seconds': new FormControl(''),
        'jobConfig.max_instances': new FormControl(''),
        'payload': new FormControl('')
    });

        this.cols = [
          { field: 'active', header: 'Active' },
          { field: 'config_id', header: 'ID' },
          { field: 'job_id', header: 'Job' },
          { field: 'data_in_source_config_id', header: 'Src In' },
          { field: 'data_out_source_config_id', header: 'Src Out' },
          { field: 'continuous', header: 'Continuous' },
          { field: 'autostart', header: 'Autostart' },
          { field: 'priority_override', header: 'Priority Override' },
          { field: 'wait_in_seconds', header: 'Wait in seconds' },
          { field: 'max_instances', header: 'Max instances' },
          { field: 'payload', header: 'Payload' },
          { field: 'updated_by', header: 'Updated By' },
          { field: 'updated_date', header: 'Updated' },
          { field: 'created_by', header: 'Created By' },
          { field: 'created_date', header: 'Created' },
          { field: 'last_job_start', header: 'Last Start' }
      ];
      this.hcols = [
        { field: 'history_id', header: 'ID' },
        { field: 'job_id', header: 'Job' },
        { field: 'config_id', header: 'Config' },
        { field: 'status', header: 'Status' },
        { field: 'payload', header: 'Payload' }
    ];
      this.loading = true;

    }
    loadLazy(event: LazyLoadEvent) {
      this.loading = true;

      // in a real application, make a remote request to load data using state metadata from event
      // event.first = First row offset
      // event.rows = Number of rows per page
      // event.sortField = Field name to sort with
      // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
      // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

      // imitate db connection over a network
      if (this.initialized) {
        const filters =  this.Id  ? {config_id : {value: +this.Id, matchMode: 'equals'} } :  event.filters;
        this.jobConfigService.getAllJobConfigsPerOrg(event.first, event.rows, filters,
          event.sortField, event.sortOrder).subscribe(dataConfig => {
        this.jobConfigs = dataConfig.response;
        this.totalRecords = dataConfig.totalrecords;
        this.jobService.getJobDropdown().subscribe(dataJob => {
          this.jobTypes = dataJob.response;
          this.sourceConfigService.getAllSourceConfigs().subscribe( sourceData => {
            this.sourceConfigs = sourceData.response.sources;
            this.getLabelsAndOption();
            this.initialized = false;
            this.loading = false;
         });
        });
      });
    } else {
      this.jobConfigService.getAllJobConfigsPerOrg(event.first, event.rows, event.filters, event.sortField, event.sortOrder
      ).subscribe(dataConfig => {
        this.jobConfigs = dataConfig.response;
        this.totalRecords = dataConfig.totalrecords;
        this.getLabelsForCodes();
        this.loading = false;
      });
    }
      this.jobConfigFieldsFilter  = event.filters;
      this.sortOrder = event.sortOrder;
      this.sortField = event.sortField;
      this.limit = event.first;
      this.rowsSize = event.rows;
  }


    showDialogToAdd() {
      this.newJobConfig = true;
      this.jobConfig = {};
      this.jobConfig.job_id = '';
      this.jobConfig.data_in_source_config_id = '';
      this.jobConfig.data_out_source_config_id = '';
      this.displayDialog = true;
    }

getLabelsForCodes() {
  if (this.jobConfigs === undefined || this.jobConfigs === null) {
    return;
  }
  for (const jobConfig of this.jobConfigs) {
    if (this.jobTypes !== undefined && this.sourceConfigs !== undefined) {
      const jobLabel = this.jobTypes.find(x => x.code === jobConfig.job_id);
      if (jobLabel) {
        jobConfig.job_id = jobLabel.name;
      }

      let sourceInLabel: Source;
      for (let sourceConfig of this.sourceConfigs) {
        if (jobConfig.data_in_source_config_id == sourceConfig.id) {
          sourceInLabel = sourceConfig;
        }
      }
      if (sourceInLabel) {
        jobConfig.data_in_source_config_id = sourceInLabel.id;
      }

      let sourceOutLabel: Source;
      for (let sourceConfig of this.sourceConfigs) {
        if (jobConfig.data_in_source_config_id == sourceConfig.id) {
          sourceOutLabel = sourceConfig;
        }
      }
      if (sourceOutLabel) {
        jobConfig.data_out_source_config_id = sourceOutLabel.id;
      }
    }
  }
}

  addAllOption() {
    this.jobTypesFilter = this.jobTypes.slice();
    this.jobTypesFilter.unshift({name: 'All', code: null});
    this.sourceConfigsFilter = this.sourceConfigs.slice();
    // this.sourceConfigsFilter.unshift({id: 'All'});
    this.faleTrueFilter = this.faleTrueList.slice();
    this.faleTrueFilter.unshift({name: 'All', code: null});
  }

  getCodes() {
    if (this.jobConfig.job_id.code) {
      this.jobConfig.job_id = this.jobConfig.job_id.code;
    }
    if (this.jobConfig.data_in_source_config_id) {
      this.jobConfig.data_in_source_config_id = this.jobConfig.data_in_source_config_id.code;
    }
    if (this.jobConfig.data_out_source_config_id) {
      this.jobConfig.data_out_source_config_id = this.jobConfig.data_out_source_config_id.code;
    }
    if (this.jobConfig.autostart) {
      this.jobConfig.autostart = this.jobConfig.autostart.code;
    }
    if (this.jobConfig.continuous) {
      this.jobConfig.continuous = this.jobConfig.continuous.code;
    }
  }

  getCodesForEdit() {
    if (this.jobTypes !== undefined && this.sourceConfigs !== undefined) {
      this.jobConfig.job_id = this.jobTypes.find(x => x.name === this.jobConfig.job_id);
      this.jobConfig.data_in_source_config_id = this.sourceConfigs.find(x => x.id === this.jobConfig.data_in_source_config_id);
      this.jobConfig.data_out_source_config_id = this.sourceConfigs.find(x => x.id === this.jobConfig.data_out_source_config_id);
    }
}

  getLabelsAndOption() {
      this.getLabelsForCodes();
      this.addAllOption();
  }

  save() {
    this.loading = true;
    this.jobConfig.payload = this.generateJson(this.chipValues);
    this.getCodes();
      if (this.newJobConfig) {
          // jobs.push(this.job);
          this.jobConfigService.add(this.jobConfig).subscribe(obj => {
            if (obj.success) {
              this.jobConfig = null;
            }
            this.freshDataList();
          });
      } else {
          // jobs[this.jobs.indexOf(this.selectedJob)] = this.job;
          this.jobConfigService.update(this.jobConfig).subscribe(obj => {
            if (obj.success) {
              this.jobConfig = null;
            }
            this.freshDataList();
          });
      }
      this.jobConfig = null;
      this.displayDialog = false;

  }
freshDataList() {
  this.jobConfigService.getAllJobConfigsPerOrg(this.limit, this.rowsSize, this.jobConfigFieldsFilter, this.sortField, this.sortOrder
  ).subscribe(dataConfig => {
    this.jobConfigs = dataConfig.response;
    this.totalRecords = dataConfig.totalrecords;
    this.getLabelsForCodes();
    this.loading = false;
  });
}
  delete() {

    this.jobConfigService.delete(this.jobConfig.config_id).subscribe(obj => {
            if (obj.success) {
              this.jobConfig = null;
            }
            this.jobConfig = null;
            this.displayDialog = false;
            this.loading = true;
            this.jobConfigService.getAllJobConfigsPerOrg(this.limit, this.rowsSize, this.jobConfigFieldsFilter, this.sortField,
              this.sortOrder).subscribe(dataConfig => {
              this.jobConfigs = dataConfig.response;
              this.totalRecords = dataConfig.totalrecords;
              this.getLabelsForCodes();
              this.loading = false;
            });
          });
  }

  onRowSelect(selectedCinfig) {
      this.newJobConfig = false;
      this.jobConfig = this.cloneJob(selectedCinfig);
      this.getCodesForEdit();
      this.jobConfigService.populateSourceInList(this.jobConfig.job_id.code).subscribe(
        sources => {
          this.sourceInDynamic = sources.response;
          this.jobConfigService.populateSourceOutList(this.jobConfig.job_id.code).subscribe(
            sourceout => {
              this.sourceOutDynamic = sourceout.response;
              this.jobConfig.job_id = this.jobTypes.find(x => x.name === this.jobConfig.job_id.name);
              this.jobConfig.data_in_source_config_id = this.sourceInDynamic.find(x => x.code === this.jobConfig.data_in_source_config_id.code);
              this.jobConfig.data_out_source_config_id =  this.sourceOutDynamic.find(x => x.code === this.jobConfig.data_out_source_config_id.code);
              this.jobConfig.continuous = this.faleTrueList.find(x => x.code === this.jobConfig.continuous);
              this.jobConfig.autostart = this.faleTrueList.find(x => x.code === this.jobConfig.autostart);
              this.chipValues = this.convertJsonToArray(this.jobConfig.payload);
            }) ;
        }) ;
      this.displayDialog = true;
  }
  
  change(event) {

  }

  cloneJob(jc: JobConfig): JobConfig {
      const jobConfig = {};
      // tslint:disable-next-line:forin
      for (const prop in jc) {
        jobConfig[prop] = jc[prop];
      }
      return jobConfig;
  }

  updateSourceIn() {
    this.disableSourceOut = false;
    this.disableSourceIn = false;
    this.jobConfigService.populateSourceInList(this.jobConfig.job_id.code).subscribe(
      sources => {
        this.sourceInDynamic = sources.response;
      }) ;
      this.jobConfigService.populateSourceOutList(this.jobConfig.job_id.code).subscribe(
        sources => {
          this.sourceOutDynamic = sources.response;
        }) ;
  }

  // History data loading
  onHistorySelect(selectedCinfig) {
    this.hloading = true;
    this.jobHistoryService.getAllHistoryJobs(0, 10, {config_id : {value: selectedCinfig.config_id, matchMode: 'equals'} }).subscribe
    (histories => {
      this.jobs = histories.response;
      this.htotalRecords = histories.totalrecords;
      this.getHLabelsForCodes();
      this.ShowHTable= true;
      this.hloading = false;
    });

    this.historyDisplayDialog = true;
  }

  historyLoadJobsLazy(event: LazyLoadEvent) {
    if (this.ShowHTable) {
      this.hloading = true;

      // in a real application, make a remote request to load data using state metadata from event
      // event.first = First row offset
      // event.rows = Number of rows per page
      // event.sortField = Field name to sort with
      // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
      // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

      // imitate db connection over a network
      this.jobHistoryService.getAllHistoryJobs(event.first, event.rows, event.filters).subscribe(histories => {
        this.jobs = histories.response;
        this.totalRecords = histories.totalrecords;
        this.getHLabelsForCodes();
        this.hloading = false;
      });
    }
  }

  getHLabelsForCodes() {
    if (this.jobs === undefined || this.jobs === null) {
      return;
    }

    for (const job of this.jobs) {
      if (this.jobConfigsValues !== undefined && this.jobTypes !== undefined && this.statuses !== undefined) {
        
        // TODO jobConfigValues doesn't seem to be populating? jobConfig has an undefined code
        for (let jobConfig of this.jobConfigsValues) {
          if (jobConfig.code == job.config_id) {
            job.config_id = jobConfig.name
          }
        }
        
        const jobLabel = this.jobTypes.find(x => x.code === job.job_id).name;
        job.job_id = jobLabel;
        const statusLabel = this.statuses.find(x => x.code === job.status).name;
        job.status = statusLabel;
      }
    }
  }

  generateJson(stringArray): any {
    const jsonObj = {};
    if (stringArray) {
      for (const pair of stringArray) {
        if (pair) {
        const values = pair.replace(/[\[\]]/g, '').split(':');
        let jkey = '';
        if (values) {
        if (values.length === 2) {
          jkey = values[0];
          const vals = values[1].split(',');
          if (vals) {
            if (vals.length === 1) {
              if (parseInt(vals[0], 10)) {
                jsonObj[jkey] = +vals[0];
              } else {
                jsonObj[jkey] = vals[0];
              }
            } else if (vals.length > 1) {
              jsonObj[jkey] = this.parseArrayNumber(vals);
            }
            }
          }
        }
      }
    }
  }
  return JSON.stringify(jsonObj);
  }

  parseArrayNumber(arrayOfValues): any {
    if (arrayOfValues) {
      for (const index in arrayOfValues) {
        if (arrayOfValues.hasOwnProperty(index)) {
          const intVal = parseInt(arrayOfValues[index], 10);
          if (intVal) {
            arrayOfValues[index] = intVal;
          }
        }
      }
    }

    return arrayOfValues;
  }

  convertJsonToArray (payload: string): string[] {
    const finaltemp = [];

    if (payload.length > 0) {   
      const pattern = /[\{\}"]/g;
      const pattern2 = /\],/gi;
      const pattern3 = /\[/gi;
      const pattern4 = /\];/gi;
  
      const temp = payload.replace(pattern, '').replace(pattern2, '];').split(':');
  
      finaltemp.push(temp[0]);
      for ( const index in temp) {
        if (temp.hasOwnProperty(index)) {
          const nextindex = +index + 1;
          if ( nextindex < temp.length ) {
            const elem = temp[+index + 1];
            let val: string[] = [];
            if (elem.search(pattern4) > -1) {
              val = elem.split(';');
            } else if (elem.search(pattern3) > -1) {
              // dont split
              val = [elem];
            } else {
              val = elem.split(',');
            }
            if (val.length > 2) {
              finaltemp[index] += ':' + val;
            } else {
              finaltemp[index] += ':' + val[0];
              finaltemp.push(val[1]);
            }
          }
        }
      }
    }

    return finaltemp;
  }

  copyJobConfig() {
    this.jobConfig = this.cloneJob(this.jobConfigCopy);
    this.jobConfig.job_id = this.jobTypes.find(x => x.code === this.jobConfig.job_id);
    this.jobConfig.data_in_source_config_id = this.sourceConfigs.find(x => x.id === this.jobConfig.data_in_source_config_id);
    this.jobConfig.data_out_source_config_id =  this.sourceConfigs.find(x => x.id === this.jobConfig.data_out_source_config_id);
    this.jobConfig.continuous = this.faleTrueList.find(x => x.code === this.jobConfig.continuous);
    this.jobConfig.autostart = this.faleTrueList.find(x => x.code === this.jobConfig.autostart);
    
  
    this.jobConfig.payload = this.jobConfigCopy.payload;
    this.chipValues = this.convertJsonToArray(this.jobConfig.payload);
  }

  // Audit
  onRowAudit(selectJobConfig: JobConfig) {
    this.auditDisplayDialog = true;
    console.log(selectJobConfig);
    this.jobConfigService.getJobConfigAudit(selectJobConfig.config_id).subscribe(
      data=>{
        this.auditEntries = data.response;
        console.log(this.auditEntries);
        console.log(this.cols);
      },
      error=>{
        this.auditDisplayDialog = false;
        AlertService.error(error.error.message);
      },
    );
  }
}
