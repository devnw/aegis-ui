import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { TagService } from '../_services/tag.service';
import { AlertService } from '../_services/alert.service';
import { DragDropModule } from 'primeng/dragdrop';
import { JiraService } from '../_services/jira.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Tag } from '../_models/tag';

@Component({
    templateUrl: 'tags.component.html'
})

export class TagComponent {

    // contains tags that already exist in the database
    existingTags: Tag[];

    cols: any[];
    selectedSource: string;
    sources: any[];

    draggedString: string;
    selectedString: string[];

    // the list of draggable tags
    availableAwsTags: string[];
    availableAzureTags: string[];

    // availableTagsForSource holds the values of availableAwsTags or availableAzureTags depending on the selected source
    availableTagsForSource: string[];

    selectedJiraTag: string;
    filteredJiraTags: string[];
    jiraTags: string[];
    validJiraTagSelected: boolean;

    // this variable maps the jira field to an array of aws fields
    jiraTagMap: Map<string, string[]>;

    // this variable holds the tags waiting to be created
    tags: Tag[];

    mapOptions: any[];

    displayMessage: string = "";
    display: boolean = false;
    retryTag: Tag;

    cloudSource: string;

    constructor(private tagService: TagService,
    private jiraService: JiraService) {}

    ngOnInit() {

        this.jiraTagMap = new Map<string, string[]>();

        this.selectedString = [];

        this.tags = [];

        this.mapOptions = [
            { field: "Append", header: "Append"},
            { field: "Overwrite", header: "Overwrite"},
            { field: "Delete Mapping", header: "Delete Mapping"},
        ];

        this.cols = [
            { field: 'source', header: 'Source' },
            { field: 'cloudtag', header: 'Cloud Tag' },
            { field: 'mappedto', header: 'Mapped To' },
            { field: 'options', header: 'Options' },
        ];

        this.sources = [
            {label: 'AWS', value: 'AWS'},
            {label: 'Azure', value: 'Azure'}
        ];

        this.tagService.getAwsTags().subscribe(
            data => {
                this.availableAwsTags = data.response.name;
            },
            error => {
                AlertService.error(error.message);
            }
        )

        this.tagService.getAzureTags().subscribe(
            data => {
                this.availableAzureTags = data.response.name;
            },
            error => {
                AlertService.error(error.message);
            }
        )

        this.jiraService.getFieldsForProject().subscribe(
            data => {
                this.jiraTags = data.response;

                for (let i = 0; i < this.jiraTags.length; i++) {
                    this.jiraTagMap.set(this.jiraTags[i], []);
                }
            },
            error => {
                AlertService.error(error.message);
            }
        );
    }

    drop(event) {

        if(this.draggedString) {
            let tagCloudDropLocation = event.target.innerText;

            // tag container is jira html element that contains the cloud tags
            let tagContainer = this.jiraTagMap.get(tagCloudDropLocation);

            if (tagContainer == undefined) {
                // If the user clicked on an html element that wasn't the header, find which tag
                // set the user clicked on
                this.jiraTagMap.forEach((value:string[], key: string) => {

                    for (let i = 0; i < this.jiraTagMap.get(key).length; i++) {
                        if (this.jiraTagMap.get(key)[i] == tagCloudDropLocation) {
                            tagCloudDropLocation = key;
                            tagContainer = this.jiraTagMap.get(key);
                            break
                        }
                    }

                })
            }

            if (tagContainer != undefined) {
                let alreadyExists = false;

                for (let i = 0; i < tagContainer.length; i++) {
                    if (tagContainer[i] == this.draggedString) {
                        alreadyExists = true;
                    }
                }

                if (!alreadyExists) {
                    tagContainer.push(this.draggedString);
                    this.jiraTagMap.set(tagCloudDropLocation, tagContainer);

                    // let dragIndex = this.findIndex(this.draggedString);
                    this.selectedString = [...this.selectedString, this.draggedString];

                    // removes the cloud tag from the left column upon drop
                    // this.availableAwsTags = this.availableAwsTags.filter((val,i) => i!=dragIndex);

                    let newTag: Tag = {
                        cloud_source: this.selectedSource,
                        cloud_tag: this.draggedString,
                        ticket_source: 'JIRA',
                        ticket_tag: tagCloudDropLocation,
                        overwrite: false,
                        option: this.mapOptions[0].field, // Append default?
                        new: true,
                    };
                    this.tags.push(newTag);

                    this.draggedString = null;
                }

            }

        }
    }

    // findIndex(tag: string) {
    //     let index = -1;
    //     for(let i = 0; i < this.availableAwsTags.length; i++) {
    //         if(tag === this.availableAwsTags[i]) {
    //             index = i;
    //             break;
    //         }
    //     }
    //     return index;
    // }

    dragStart(event, dragged: string) {
        this.draggedString = dragged;
    }

    dragEnd(event) {
        this.draggedString = null;
    }

    // sets the option of append or overwrite to the tag
    optionSelected(event, tag) {
        tag.option = this.mapOptions.find(option => option.field === event.value.field);
    }

    // when the final create button is hit
    buttonSaveTags() {
        for (let i = 0; i < this.tags.length; i++) {
            let currentTag = this.tags[i];

            // An object is stored in the option property so the p-dropdown can be properly binded to it
            // here we reduce that object back to the string value
            let copyOption = "";
            if (currentTag.option.field) {
                copyOption = currentTag.option.field;
            } else {
                copyOption = currentTag.option;
            }

            let copyTag: Tag = {
                cloud_source: currentTag.cloud_source,
                cloud_tag: currentTag.cloud_tag,
                ticket_source: currentTag.ticket_source,
                ticket_tag: currentTag.ticket_tag,
                overwrite: false,
                option: copyOption,
                new: true,
            };

            let newTag = true;
            if (this.existingTags != null) {
            for (let i = 0; i < this.existingTags.length; i++) {
                let checkTag = this.existingTags[i]
                if (checkTag.cloud_tag === copyTag.cloud_tag && checkTag.ticket_tag === copyTag.ticket_tag) {
                    newTag = false;
                }
            }
          }

            if (newTag && copyOption === "Delete Mapping") {
                AlertService.error('Cannot create a new tag with the option \'Delete Mapping\'');
            } else if (newTag) {
                this.tagService.createAwsTags(copyTag, false).subscribe(
                    data => {
                        if (data.response.response.retry) {
                            this.displayMessage = data.response.response.retry;
                            this.display = true;
                            this.retryTag = copyTag;
                        } else {
                            AlertService.success(data.response.response);
                        }

                    },
                    error => {
                        AlertService.error(error.message);
                    },
                );
            } else {
                if (copyOption === "Delete Mapping") {
                    this.tagService.deleteAwsTags(copyTag).subscribe(
                        data => {
                            AlertService.success(data.response.response);
                        },
                        error => {
                            AlertService.error(error.message);
                        },
                    );
                } else {
                    this.tagService.updateAwsTags(copyTag).subscribe(
                        data => {
                            AlertService.success(data.response.response);
                        },
                        error => {
                            AlertService.error(error.message);
                        },
                    );
                }
            }

        }
    }

    // from step 1 (Select Cloud Provider)
    cloudServiceSelected(event: any, stepper: MatStepper) {
        stepper.next();
        this.cloudSource = event.value;

        if (this.cloudSource == 'AWS') {
            this.availableTagsForSource = this.availableAwsTags;
        } else {
            this.availableTagsForSource = this.availableAzureTags;
        }
        
        // Reset the tags if a new cloud provider is selected
        this.updateExistingTagsFromDb();
    }

    updateExistingTagsFromDb() {
        let newTagsWaitingToBeCreated = [];
        for (let tag of this.tags) {
            if (tag.new) {
                newTagsWaitingToBeCreated.push(tag);
            }
        }

        this.tags = [];
        
        // this.tags = []; doing this removes newly created tags
        this.jiraTagMap.forEach((value:string[], key: string) => {
            this.jiraTagMap.set(key, []);
        })

        // Grab the existing tag mappings for that cloud provider
        this.tagService.getTagsFromDb(this.cloudSource).subscribe(
            data => {
                this.existingTags = data.response;

                if (this.existingTags != null) {
                    for (let i = 0; i < this.existingTags.length; i++) {

                        // we set the option of the tag to the option object because the pdropdown
                        // needs an object to bind to (checks reference, not value of option)
                        this.existingTags[i].option = this.mapOptions.find(option => option.field === this.existingTags[i].option);

                        if (this.jiraTagMap.get(this.existingTags[i].ticket_tag) == null) {
                            this.jiraTagMap.set(this.existingTags[i].ticket_tag, []);
                        }

                        this.jiraTagMap.get(this.existingTags[i].ticket_tag).push(this.existingTags[i].cloud_tag);
                        this.tags.push(this.existingTags[i]);
                    }
                }

            },
            error => {
                AlertService.error(error.message);
            },
        );

        for (let tag of newTagsWaitingToBeCreated) {
            this.tags.push(tag);
        }
    }

    forceCreateTag(event) {
        if (this.retryTag != null && this.retryTag != undefined) {
            this.tagService.createAwsTags(this.retryTag, true).subscribe(
                data => {
                    AlertService.success(data.response.response);
                },
                error => {
                    AlertService.error(error.message);
                },
            );

            this.retryTag = null;
        }

        this.display = false;
    }
}
