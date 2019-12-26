import { Component, OnInit } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AlertService } from '../_services/alert.service';
import { BulkUpdateService } from '../_services/bulk_update.service';
import { OrganizationService } from '../_services/organization.service';
import { Organization } from '../_models/org';
import { FileUploadModule } from 'primeng/primeng';
import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';
import { environment } from '../../environments/environment';
import { JiraService } from '../_services/jira.service';
import { DropdownModule } from 'primeng/dropdown';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'bulk_update.component.html'
})

export class BulkUpdateComponent implements OnInit {

    fileChosen: boolean;

    // ticketingURL: string;
    // ticketingUsername: string;

    // Socket variables
    ioConnection: any;
    messageContent: string;
    // ----------------
    socket: WebSocket;

    serverMessages: string[] = [];

    urls: any[] = [];
    selectedUrl: any;

    fileUploaded: boolean = false;

    display: boolean = false;
    displayMessage: string = "";
    repeatFile: string = "";

    constructor(
        private router: Router,
        private alertService: AlertService,
        private bulkUpdateService: BulkUpdateService,
        private organizationService: OrganizationService,
        private jiraService: JiraService,
    ) {
        this.fileChosen = false;
    }

    initWebSocket() {
        var component = this;

        // TODO create environment constant for ws

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.socket = new WebSocket(environment.bulkUpdateWebsocket);

        class message {
            success: string;
            failure: string;
        }


        this.socket.onopen = function() {
            component.socket.send('Bearer=' + `${currentUser.response}`);
            component.serverMessages.unshift("Client connected to server");
        }

        this.socket.onmessage = function (e) {
            var message = JSON.parse(e.data);

            if (message.success) {
                component.serverMessages.unshift(message.success);
            } else if (message.failure) {
                component.serverMessages.unshift(message.failure);
            } else if (message.repeat) {

                if (message.repeat_count == 0) {
                    component.displayMessage = 'File completed successfully! Are you finished creating bulk updates?';
                    component.display = true;
                } else {
                    component.repeatFile = message.repeat;
                    component.displayMessage = 'There were ' + message.repeat_count + ' failed commands. Would you like to retry them?';
                    component.display = true;
                }

            }
        }

        this.socket.onclose = function () {
            component.serverMessages.unshift("Client disconnected from server");
        }
    }

    ngOnInit() {
        this.getUrls();
        this.initWebSocket();
    }

    verifyDescriptionLine(descriptionLine: string) {

    }


    fileChange(event) {
        this.serverMessages = ['Waiting for job to start...'];

        if (this.selectedUrl.length > 0) {
            // Grab files
            let fileList: FileList = event.target.files;
            if(fileList.length == 1) {
                let file: File = fileList[0];

                // Max size is 512kb
                const maxSize = 2**19;

                // TODO separate code for file upload on job creation

                // Read the file in base64
                let reader = new FileReader();
                let result: string;
                reader.onload = (e) => {
                    result = reader.result;

                    // Split the filecontents into an array
                    var fileContentsArray = result.split("\n");

                    // this holds all the file upload api calls. we wait for each api call to finish before making the job create call
                    let pendingApiCalls: Observable<any>[] = [];

                    if (fileContentsArray.length > 0) {
                        var uploadedFileNames: string[] = [];

                        // The very first line of the file should be a description line
                        var descriptionLine = fileContentsArray[0];
                        // TODO verifyDescriptionLine

                        var buildRequestFile = descriptionLine + '\n';
                        var fileIndex = 0;
                        for (var index = 1; index < fileContentsArray.length; index++) {
                            if ((buildRequestFile + fileContentsArray[index]).length > maxSize) {

                                var filename = fileIndex + '_' + file.name;
                                uploadedFileNames.push(filename);

                                pendingApiCalls.push(this.bulkUpdateService.postBulkUpdateFile(buildRequestFile, filename));

                                fileIndex++;

                                buildRequestFile = descriptionLine + '\n';
                            } else {
                                buildRequestFile += fileContentsArray[index] + '\n';
                            }
                        }

                        // There's still some leftover data from not reaching > maxSize before loop termination, POST it
                        if (buildRequestFile.length > descriptionLine.length + 1) {
                            var filename = fileIndex + '_' + file.name;
                            uploadedFileNames.push(filename);

                            pendingApiCalls.push(this.bulkUpdateService.postBulkUpdateFile(buildRequestFile, filename));
                        }
                    }

                    Observable.forkJoin(pendingApiCalls).subscribe(
                        data => {
                            this.bulkUpdateService.postBulkUpdateJob(uploadedFileNames, this.selectedUrl).subscribe(
                                data => {
                                    AlertService.success(data.response.message);
                                    this.fileUploaded = true;
                                },
                                error => {
                                    AlertService.error(error.error.message);
                                }
                            );
                        },

                        error => {
                            AlertService.error(error.error.message);
                        },
                    );

                }

                reader.readAsText(file);
            } else {
                AlertService.error('Must upload a single file');
            }
        } else {
            AlertService.error('Must upload a single file');
        }

    }

    showFileInput(): boolean {
        var show = false;
        if (this.selectedUrl != undefined && this.selectedUrl != null && this.selectedUrl.length > 0) {
            show = true;
        }

        return show;
    }

    handleClick(event) {
        var files: string[] = [];

        if (this.repeatFile.length > 0) {
            files.push(this.repeatFile);
        }

        if (files.length > 0) {
            this.bulkUpdateService.postBulkUpdateJob(files, this.selectedUrl).subscribe(
                data => {
                    AlertService.success(data.response.message);
                    this.fileUploaded = true;
                    this.display = false;
                },
                error => {
                    AlertService.error(error.error.message);
                    this.display = false;
                }
            );
        } else {
            this.router.navigate(['']);
        }

    }

    getUrls() {
        this.jiraService.getJiraUrls().subscribe(
            data => {
                for (let i = 0; i < data.response.length; i++) {
                    this.urls.push({label:data.response[i], value:data.response[i]})
                }
            },
            error => {
                AlertService.error(error.error.message);
            }
        )
    }
}
