import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RequestOptions } from '@angular/http';
import { BulkUpdateFile, BulkUpdateJob, BulkUpdateJobRequest, BulkUpdateFileRequest } from '../_models/bulkupdate';

@Injectable()
export class BulkUpdateService {

    constructor(private httpClient: HttpClient) { }

    postBulkUpdateJob(files: string[], ticketingURL) {
        const bulkUpdate: BulkUpdateJob = {
            files: files,
            serviceURL: ticketingURL
        }

        const bulkUpdateRequest: BulkUpdateJobRequest = {
            update: bulkUpdate
        }

        return this.httpClient.post<any>(environment.apiServer + '/BulkUpdate', bulkUpdateRequest);
    }

    postBulkUpdateFile(fileToUpload: string, name: string) {
        const bulkUpdate: BulkUpdateFile = {
            name: name,
            contents: fileToUpload
        }

        const bulkUpdateRequest: BulkUpdateFileRequest = {
            upload: bulkUpdate
        }

        return this.httpClient.post<any>(environment.apiServer + '/BulkUpdateUpload', bulkUpdateRequest);
    }
}