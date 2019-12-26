export interface Source {
    id: string;
    source: string
    address: string;
    port: number;
    username: string;
    password: string;
    payload: string;
    private_key: string;
    consumer_key: string;
    token: string;
}

export interface SourceContainer {
    sources: Source[];
    unique_names: string[];
    source_to_payload: SourceToPayload;
}

export interface SourceToPayload {
    AWS: string;
    Azure: string;
    JIRA: string;
    Nexpose: string;
    Qualys: string;
}