import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { VulnerabilityService } from '../_services/vulnerability.service';
import { VulnerabilityTable, VulnerabilityMatch, Vulnerability } from '../_models/vulnerability'; 
import { AlertService } from '../_services/alert.service';

@Component({
    templateUrl: 'vulnerabilities.component.html'
})

export class VulnerabilitiesComponent implements OnInit {

    tables: VulnerabilityTable[] = [];
    matches: VulnerabilityMatch[] = [];

    cols: any[] = [
        { field: 'source_id', header: 'Source Id' },
        { field: 'title', header: 'Title' },
        { field: 'cvss', header: 'CVSS' }
    ];

    matchCols: any[] = [
        { field: 'nexpose_title', header: 'Nexpose Title' },
        { field: 'nexpose_id', header: 'Nexpose Id' },
        { field: 'qualys_title', header: 'Qualys Title' },
        { field: 'qualys_id', header: 'Qualys Id' },
        { field: 'match_confidence', header: 'Match Confidence (percent)' },
        { field: 'match_reason', header: 'Match Reason' },
    ];
    
    constructor(private vulnerabilityService: VulnerabilityService,
                private alertService: AlertService) {}
    
    ngOnInit() {
        var qualysTable: VulnerabilityTable = new VulnerabilityTable;
        var nexposeTable: VulnerabilityTable = new VulnerabilityTable;

        qualysTable.source = "Qualys";
        nexposeTable.source = "Nexpose";

        this.tables.push(qualysTable);
        this.tables.push(nexposeTable);

        for (let table of this.tables) {
            this.vulnerabilityService.getBySource(table.source).subscribe(
                data => {
                    table.vulnerabilities = data.response;
                },
                error => {
                    AlertService.error(error.error.message);
                }
            ); 
        }

        this.vulnerabilityService.getMatchedVulns().subscribe(
            data => {
                this.matches = data.response;
            },
            error => {
                AlertService.error(error.error.message);
            }
        );
    }

    // onRowSelect(event) {

    // }

    // onRowUnselect(event) {

    // }
    
}