import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response} from '@angular/http';
import { environment } from '../../environments/environment';
import { Tag, TagRequest } from '../_models/tag';

@Injectable()
export class TagService {

    private static readonly tagsApi = environment.apiServer + '/tags';
    private static readonly getAwsTagsApi = environment.apiServer + '/tags/aws';
    private static readonly getAzureTagsApi = environment.apiServer + '/tags/azure';

    constructor(private httpClient: HttpClient) { }

    getTagsFromDb(cloudService: string) {
        return this.httpClient.get<any>(TagService.tagsApi + '/existing/' + cloudService);
    }

    getAwsTags() {
        return this.httpClient.get<any>(TagService.getAwsTagsApi);
    }

    getAzureTags() {
        return this.httpClient.get<any>(TagService.getAzureTagsApi);
    }
    
    createAwsTags(tag: Tag, overwrite: boolean) {
        tag.overwrite = overwrite;

        const tagReq: TagRequest = {
            tag: tag,
        }

        return this.httpClient.post<any>(TagService.tagsApi, tagReq);
    }

    updateAwsTags(tag: Tag) {
        const tagReq: TagRequest = {
            tag: tag,
        }

        return this.httpClient.put<any>(TagService.tagsApi, tagReq);
    }

    deleteAwsTags(tag: Tag) {
        const tagReq: TagRequest = {
            tag: tag,
        }

        return this.httpClient.put<any>(TagService.tagsApi + '/delete', tagReq);
    }
}