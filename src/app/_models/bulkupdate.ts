export class BulkUpdateJob {
    files: string[];
    serviceURL: string;
}

export class BulkUpdateFile {
    name: string;
    contents: string;
}

export class BulkUpdateJobRequest {
    update: BulkUpdateJob;
}

export class BulkUpdateFileRequest {
    upload: BulkUpdateFile;
}