import { Component } from '@angular/core';
import { FieldHeader, LabelValue } from '../_models/helper';
import { MatStepper, MatStep } from '@angular/material/stepper';
import { SourceConfigService } from '../_services/source_config.service';
import { JiraService } from '../_services/jira.service';
import { AlertService } from '../_services/alert.service';
import { Source, SourceContainer } from '../_models/source';

@Component({
    templateUrl: 'jira_status_map.component.html'
})

export class JiraStatusMapComponent {
    existingOrNew: LabelValue[];
    existingOrNewChoice: LabelValue;

    existingJiraSources: Source[];

    selectedSourceObj: Source; // for when a user is editing an existing source
    newSourceObj:      Source; // for when a user is creating a new source

    existing: string = "Existing";
    new:      string = "New";

    cols: FieldHeader[];
    colsCreatePopup: FieldHeader[];

    sourcesExist: boolean = true;

    displaySourceSelect: boolean = false;

    fromStatus: string[];// statuses for user
    toStatus:   string[];// statuses for aegis
    filteredStatuses: string[];
    statusTagMap: Map<string, string>;

    fromFields:  string[];
    toFields:    string[];
    filteredFields: string[];
    fieldTagMap: Map<string, string>;

    

    constructor(private sourceConfigService: SourceConfigService, private jiraService: JiraService) { }

    ngOnInit() {
        this.statusTagMap = new Map<string, string>();
        this.fieldTagMap = new Map<string, string>();

        this.existingOrNew = [
            {label: this.existing, value: this.existing},
            {label: this.new, value: this.new}
        ];

        this.cols = [
            {field: "address", header: "Address"},
            {field: "port", header: "Port"},
            {field: "username", header: "Username"},
            {field: "payload", header: "Payload"},
        ]

        this.colsCreatePopup = [
            {field: "address", header: "Address"},
            {field: "port", header: "Port"},
            {field: "username", header: "Username"},
            {field: "payload", header: "Payload (ENSURE PROJECT IS SPECIFIED)"},
            {field: "private_key", header:"Private Key (optional if using password)"},
            {field: "consumer_key", header:"Consumer Key (optional if using password)"},
            {field: "token", header:"Token (optional if using password)"},
        ];

        this.existingJiraSources = [];
        this.newSourceObj = {
            address: '',
            password: '',
            payload: '',
            port: -1,
            source: 'JIRA',
            id: '',
            username: '',
            private_key: '',
            consumer_key: '',
            token: '',
        };

        this.sourceConfigService.getSources().subscribe(
            data=>{

                let container: SourceContainer = data.response;

                this.newSourceObj.payload = container.source_to_payload.JIRA;

                for (let i = 0; i < container.sources.length; i++) {
                    if (container.sources[i].source.toLowerCase().includes('jira')) {
                        this.existingJiraSources.push(container.sources[i]);
                    }
                }
                
                this.sourcesExist = this.existingJiraSources.length > 0;
            },
            error=>{
                AlertService.error(error.error.message);
            }
        );
    }

    existingOrNewSelected(event: any, stepper: MatStepper) {
       
        if (this.existingOrNewChoice.toString() == this.existing && !this.sourcesExist) {
            AlertService.error('Could not find existing JIRA source - creating new one');
            this.existingOrNewChoice = {label: this.new, value: this.new};
        }

        stepper.next();
    }

    editAndContinue(stepper: MatStepper) {
        this.jiraService.getStatusesForMapping(this.selectedSourceObj.id).subscribe(
            data=>{
                this.fromStatus = data.response.custom_status;
                this.toStatus = data.response.backend_status;

                var payloadJson = JSON.parse(this.selectedSourceObj.payload);

                if (payloadJson['status_map']) {
                    for (let i = 0; i < this.toStatus.length; i++) {
                        this.statusTagMap.set(this.toStatus[i], payloadJson['status_map'][this.toStatus[i]]);
                    }
                } else {
                    for (let i = 0; i < this.toStatus.length; i++) {
                        this.statusTagMap.set(this.toStatus[i], "");
                    }
                }
                
                this.displaySourceSelect = false;
                stepper.next(); 
            },
            error=>{
                AlertService.error(error.error.message);
            },
        );
       
        this.jiraService.getFieldsForMapping(this.selectedSourceObj.id).subscribe(
            data=>{
                this.fromFields = data.response.custom_fields;
                this.toFields = data.response.backend_fields;
                
                var payloadJson = JSON.parse(this.selectedSourceObj.payload);

                if (payloadJson['field_map']) {
                    for (let i = 0; i < this.toFields.length; i++) {
                        this.fieldTagMap.set(this.toFields[i], payloadJson['field_map'][this.toFields[i]]);
                    }
                } else {
                    for (let i = 0; i < this.toFields.length; i++) {
                        this.fieldTagMap.set(this.toFields[i], "");
                    }
                }
            },
            error=>{
                AlertService.error(error.error.message);
            },
        );
    }

    createAndContinue(stepper: MatStepper) {
        var payloadJson = JSON.parse(this.newSourceObj.payload);

        if (payloadJson['project']) {
            if (payloadJson['project'].length > 0) {

                this.sourceConfigService.createSource(this.newSourceObj).subscribe(
                    data=>{
                        AlertService.success('Source config created');
                        let idOfNewlyCreatedSource:string = data.response.response;
                        
                        this.sourceConfigService.getSources().subscribe(
                            data=>{
                                let container: SourceContainer = data.response;
                
                                for (let i = 0; i < container.sources.length; i++) {
                                    if (container.sources[i].id == idOfNewlyCreatedSource) {
                                        this.newSourceObj = container.sources[i];
                                    }
                                }
        
                                this.jiraService.getStatusesForMapping(this.newSourceObj.id).subscribe(
                                    data=>{
                                        this.fromStatus = data.response.custom_status;
                                        this.toStatus = data.response.backend_status;
        
                                        for (let i = 0; i < this.toStatus.length; i++) {
                                            this.statusTagMap.set(this.toStatus[i], "");
                                        }
        
                                        this.jiraService.getFieldsForMapping(this.newSourceObj.id).subscribe(
                                            data=>{
                                                this.fromFields = data.response.custom_fields;
                                                this.toFields = data.response.backend_fields;
                                                
                                                for (let i = 0; i < this.toFields.length; i++) {
                                                    this.fieldTagMap.set(this.toFields[i], "");
                                                }

                                                console.log(this.fromStatus, this.toStatus, this.fromFields, this.toFields);
        
                                                stepper.next(); 
                                            },
                                            error=>{
                                                AlertService.error(error.error.message);
                                            },
                                        );
                                        
                                    },
                                    error=>{
                                        AlertService.error(error.error.message);
                                    },
                                );
        
                            },
                            error=>{
                                AlertService.error(error.error.message);
                            }
                        );
                    },
                    error=>{
                        AlertService.error(error.error.message);
                    },
                );
            } else {
                AlertService.error('Must provide a project in the payload');
            }
        } else {
            AlertService.error('Must provide a project in the payload');
        }

        
    }

    mappingNextButton(stepper: MatStepper) {
        let valid = true;

        this.statusTagMap.forEach((value:string, key: string) => {
            if (value.length == 0) {
                valid = false;
            }
        })

        // field maps can take zero length values, as Aegis just uses the default value

        if (valid) {
            stepper.next();

            var statusObject = {};
            this.statusTagMap.forEach((value, key) => {
                var keys = key.split('.'),
                    last = keys.pop();
                keys.reduce((r, a) => r[a] = r[a] || {}, statusObject)[last] = value;
            });

            var fieldObject = {};
            this.fieldTagMap.forEach((value, key) => {
                var keys = key.split('.'),
                    last = keys.pop();
                keys.reduce((r, a) => r[a] = r[a] || {}, fieldObject)[last] = value;
            });


            if (this.existingOrNewChoice.toString() == this.new) {

                var payloadJson = JSON.parse(this.newSourceObj.payload);
                payloadJson['status_map'] = statusObject;
                payloadJson['field_map'] = fieldObject;
                this.newSourceObj.payload = JSON.stringify(payloadJson);

                this.sourceConfigService.updateSource(this.newSourceObj).subscribe(
                    data=>{
                        AlertService.success('Updated!');
                    },
                    error=>{
                        AlertService.error(error.error.message);
                    }
                );
            } else {

                var payloadJson = JSON.parse(this.selectedSourceObj.payload);
                payloadJson['status_map'] = statusObject;
                payloadJson['field_map'] = fieldObject;
                this.selectedSourceObj.payload = JSON.stringify(payloadJson);

                this.sourceConfigService.updateSource(this.selectedSourceObj).subscribe(
                    data=>{
                        AlertService.success('Updated!');
                    },
                    error=>{
                        AlertService.error(error.error.message);
                    }
                );
            }

            
        } else {
            AlertService.error('Each mapping must only contain a single entry');
        }
    }

    mappingBackButton(stepper: MatStepper) {
        stepper.previous();
    }

    filterStatus(to:string, event) {
        this.filteredStatuses = [];
        for(let i = 0; i < this.fromStatus.length; i++) {
            let status = this.fromStatus[i];
            if(status.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.filteredStatuses.push(status);
            }
        }
    }

    filterField(to:string, event) {
        this.filteredFields = [];
        for(let i = 0; i < this.fromFields.length; i++) {
            let field = this.fromFields[i];
            if(field.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.filteredFields.push(field);
            }
        }
    }

    updateTagMap(to:string, event) {
        this.statusTagMap.set(to, event);
    }

    updateFieldMap(to:string, event) {
        this.fieldTagMap.set(to, event);
    }
}