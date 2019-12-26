export class Log {
    id: number;
    typeId: number;
    log: string;
    error: string;
    jobHistoryId: number;
    date: Date;
}


export class LogRequest {
    methodOfDiscovery: string;
    jobType: number;
    logType: number;
    jobHistoryId: number;
    fromDate: Date;
    toDate: Date;
}