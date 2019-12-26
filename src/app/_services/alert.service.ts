import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Message } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange  = false;

  static messageService: MessageService;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
            if (this.keepAfterNavigationChange) {
                // only keep for a single location change
                this.keepAfterNavigationChange = false;
            } else {
                // clear alert
                this.subject.next();
            }
        }
    });
    }

    static success(message: string, keepAfterNavigationChange = false) {
        this.createMessage('info', 'Information', message);
    }

    static error(message: string, keepAfterNavigationChange = false) {
        this.createMessage('error', 'Error', message);
    }

    static createMessage(severity: string, summary: string, message: string) {
        // this.msgs.pop();
        this.messageService.add({ severity: severity, summary: summary, detail: message });
    }

    static setService(messageService: MessageService) {
        this.messageService = messageService;
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
