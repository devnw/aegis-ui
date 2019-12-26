export interface Tag {
    cloud_source: string;
    cloud_tag: string;
    
    ticket_source: string;
    ticket_tag: string;
    overwrite: boolean;

    option: any;

    new: boolean;
}

export interface TagRequest {
    tag: Tag;
}