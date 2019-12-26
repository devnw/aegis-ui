import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class JiraService {
    constructor(private httpClient: HttpClient) { }

    getTicketPieChartData() {
        return this.httpClient.get<any>(environment.apiServer + '/ticketCountByStatus');
    }

    getFieldsForProject() {
        return this.httpClient.get<any>(environment.apiServer + '/tags/jira');
    }

    getJiraUrls() {
        return this.httpClient.get<any>(environment.apiServer + '/jira/urls');
    }

    getStatusesForMapping(sourceConfigId: string) {
        return this.httpClient.get<any>(environment.apiServer + '/jira/statuses/' + sourceConfigId);
    }

    getFieldsForMapping(sourceConfigId: string) {
        return this.httpClient.get<any>(environment.apiServer + '/jira/fields/' + sourceConfigId);
    }
}
