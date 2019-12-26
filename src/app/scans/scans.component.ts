import { AlertService } from '../_services/alert.service';
import { Component, OnInit } from '@angular/core';
import { ScanService } from '../_services/scan.service';
import { Scan } from '../_models/scan';
import { CheckboxModule } from 'primeng/checkbox';
import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';
import { environment } from '../../environments/environment';

@Component({
    templateUrl: 'scans.component.html'
})

export class ScansComponent implements OnInit {
    // Holds field names contained within scans
    cols: any;
    // Populates the table with information pulled from API
    scans: Scan[];

    // The following attributes are user for the popup on row select
    selectedScan: Scan;
    ticketsMessage: string;
    devicesMessage: string;
    display: boolean;
    // End popup attributes

    filterFinished: boolean = false;
    onlyShowRunning: boolean = false;

    methodsOfDiscovery = [
        {label: 'Nexpose', value: 'Nexpose'},
        {label: 'Qualys', value: 'Qualys'}
    ];
    selectedMethod: string;//method of discovery (i.e. Nexpose or Qualys)

    socket: WebSocket;

    loadingScans: boolean = true;

    constructor(private scanService: ScanService) {}

    ngOnInit() {
        this.initWebSocket();

        this.cols = [
            { field: 'scan_id', header: 'Scan' },
            { field: 'status', header: 'Status' },
            { field: 'start', header: 'Start Time' },
            { field: 'duration', header: 'Duration' },
            { field: 'group_name', header: 'Assignment Group Name' },
            { field: 'group_id', header: 'Assignment Group Id' }
        ];
    }

    initWebSocket() {
        var component = this;
        // TODO create environment constant for ws
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.socket = new WebSocket(environment.scanWebsocket);

        this.socket.onopen = function() {
            component.socket.send('Bearer=' + `${currentUser.response}`);
            console.log("Socket is open");
        };

        this.socket.onmessage = function (e) {
            var currentScans = component.scans;

            if (currentScans != null) {
                var newScans: Scan[];
                newScans = JSON.parse(e.data);

                if (newScans != null) {
                    for (let newScan of newScans) {

                        if (newScan.source.toLowerCase() == component.selectedMethod.toLowerCase()) {
                            if (newScan.group_name.length == 0) {
                                newScan.group_name = "N/A"
                            }

                            var newScanFound: boolean = false;

                            for (let currentScan of currentScans) {

                                if (newScan.scan_id == currentScan.scan_id) {
                                    newScanFound = true;
                                    currentScan.status = newScan.status;
                                    currentScan.duration = newScan.duration;
                                    break;
                                }
                            }

                            if (!newScanFound) {
                                newScan.duration = "0s";
                                currentScans.unshift(newScan);
                            }
                        }
                    }
                }
            }
        };

        this.socket.onclose = function () {
            console.log("Socket closed");
        }
    }

    onRowSelect(event) {
        this.display = true;
        if (this.selectedScan != null) {
            for (let scan of this.scans) {
                if (scan.scan_id == this.selectedScan.scan_id) {
                    if (scan.tickets.length > 0) {
                        this.ticketsMessage = scan.tickets;
                    } else {
                        this.ticketsMessage = "N/A"
                    }

                    if (scan.devices.length > 0) {
                        this.devicesMessage = scan.devices;
                    } else {
                        this.devicesMessage = "N/A"
                    }

                    break;
                }
            }
        }
    }

    onRowUnselect(event) {
        this.display = false;
        this.ticketsMessage = '';
        this.devicesMessage = '';
    }

    selectMod(event) {
        this.scans = [];
        this.loadingScans = true;

        if (this.selectedMethod != null) {
            this.scanService.getScans(this.selectedMethod).subscribe(
                data => {
                    this.loadingScans = false;
                    this.scans = data.response;
                    if (this.scans != null) {
                        for (let scan of this.scans) {
                            scan.status = scan.status.toLowerCase();
                            if (scan.group_name.length == 0) {
                                scan.group_name = "N/A"
                            }
                        }
                    }
                },
                error => {
                    AlertService.error(error.error.message);
                }
            );
        }
    }

    getColor(status: string) {
        status = status.toLowerCase();
        if (status == 'finished') {
            return 'black';
        } else if (status == 'error' || status == 'canceled' || status == 'stopped') {
            return 'red';
        } else {
            return 'green';
        }
    }
}
