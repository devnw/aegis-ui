import { Component } from '@angular/core';
import { Source, SourceContainer } from '../_models/source';
import { SourceConfigService } from '../_services/source_config.service';
import { AlertService } from '../_services/alert.service';
import { FieldHeader, LabelValue } from '../_models/helper';


@Component({
    templateUrl: 'source_configs.component.html'
})

export class SourceConfigsComponent {
    // The cols displayed for the user
    cols: FieldHeader[];

    // The cols used to edit a source config
    editableCols: FieldHeader[];

    createCols: FieldHeader[];
    selectedCreateSource: string;
    
    selectedSource: string; // this holds the source in the filter dropdown
    selectedSourceObj: Source; // this holds the selected source in the table

    newSourceObj: Source;
    
    possibleSources: LabelValue[];
    possibleSourcesNoAny: LabelValue[];

    sourcesFromApi: SourceContainer;

    filteredSources: Source[];

    hideEdit: boolean = true;
    hideCreate: boolean = true;

    skeletonPayloadMap: any;

    jiraCols: FieldHeader[];

    constructor(private sourceConfigService: SourceConfigService, private alertService: AlertService) {}

    ngOnInit() {
        this.cols = [
            {field: "source", header: "Source"},
            {field: "address", header: "Address"},
            {field: "port", header: "Port"},
            {field: "username", header: "Username"},
            {field: "payload", header: "Payload"},
        ]

        this.createCols = [
            {field: "address", header: "Address"},
            {field: "port", header: "Port"},
            {field: "username", header: "Username"},
            {field: "payload", header: "Payload"},
        ];

        this.editableCols = [
            {field: "address", header: "Address"},
            {field: "port", header: "Port"},
            {field: "username", header: "Username"},
            {field: "payload", header: "Payload"},
            {field: "password", header: "Password"},
        ]

        this.jiraCols = [
            {field: "private_key", header: "Private Key (if using Oauth)"},
            {field: "consumer_key", header: "Consumer Key (if using Oauth)"},
            {field: "token", header: "Token (if using Oauth)"}, 
        ];
        
        this.possibleSources = [
            {label: 'Any', value: 'Any'},
        ];

        this.possibleSourcesNoAny = [];

        this.sourceConfigService.getSources().subscribe(
            data=>{
                this.sourcesFromApi = data.response;

                this.filteredSources = this.sourcesFromApi.sources;

                for (let i = 0; i < this.sourcesFromApi.unique_names.length; i++) {
                    this.possibleSources.push({label: this.sourcesFromApi.unique_names[i], value: this.sourcesFromApi.unique_names[i]});
                    this.possibleSourcesNoAny.push({label: this.sourcesFromApi.unique_names[i], value: this.sourcesFromApi.unique_names[i]});
                }
            },
            error => {
                console.log(error);
                AlertService.error(error.error.message);
            }
        );
    }

    newFilterSelected(event) {
        this.selectedSource = event.value;

        this.filteredSources = [];
        
        if (this.selectedSource == undefined || this.selectedSource == null) {
            this.filteredSources = this.sourcesFromApi.sources;
        } else if (this.selectedSource == "Any") {
            this.filteredSources = this.sourcesFromApi.sources;
        } else {
            for (let i = 0; i < this.sourcesFromApi.sources.length; i++) {
                if (this.sourcesFromApi.sources[i].source == this.selectedSource) {
                    this.filteredSources.push(this.sourcesFromApi.sources[i]);
                }
            }
        }
    }

    newFilterSelectedCreate(event) {
        this.newSourceObj.payload = this.sourcesFromApi.source_to_payload[event.value];
        this.newSourceObj.source = event.value;
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    onRowSelect() {
        this.hideEdit = false;
    }

    onRowUnselect() {
        this.hideEdit = true;
    }

    updateSource() {
        this.selectedSourceObj.port = +this.selectedSourceObj.port//converts string port back to an integer
        this.sourceConfigService.updateSource(this.selectedSourceObj).subscribe(
            data=> {
                AlertService.success('Updated!');
                this.hideEdit = true;
                window.location.reload();
            },
            error=> {
                AlertService.error(error.error.message);
            }
        );
    }

    deleteSource() {
        this.sourceConfigService.deleteSource(this.selectedSourceObj).subscribe(
            data=>{
                AlertService.success('Deleted source');
                this.hideEdit = true;
                window.location.reload();
            },
            error=>{
                AlertService.error(error.error.message);
            }
        );
    }

    createSourceButton() {
        this.hideCreate = false;
        this.newSourceObj = {
            address: '',
            password: '',
            payload: '',
            port: -1,
            source: '',
            id: '',
            username: '',
            private_key: '',
            consumer_key: '',
            token: '',
        };
    }

    createSource() {
        this.newSourceObj.port = +this.newSourceObj.port//converts string port back to an integer
        this.hideCreate = true;
        this.sourceConfigService.createSource(this.newSourceObj).subscribe(
            data=>{
                AlertService.success('Source config created!');
                this.sourcesFromApi.sources.push(this.newSourceObj);
            },
            error=>{
                AlertService.error(error.error.message);
            }
        )
    }

    cancelCreate() {
        this.hideCreate = true;
    }

    cancelSource() {
        this.hideEdit = true;
    }
}