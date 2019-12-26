import { Component, OnInit } from '@angular/core';
import { JiraService } from '../_services/jira.service';
import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';
import { environment } from '../../environments/environment';

@Component({
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    pieData: any;
    barData: any;

    socket: WebSocket;

    options: any;

    burnDownDoneLoading: boolean = false;

    constructor(private jiraService: JiraService) {}

    ngOnInit() {
        this.initBurnDownSocket();

        this.pieData = {
            labels: ['loading', 'loading', 'loading'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        '#2162b0',
                        '#e02365',
                        '#eeb210'
                    ]
                }]
        };

        this.jiraService.getTicketPieChartData().subscribe(
            data => {
                this.pieData = {
                    labels: data.response.labels,
                    datasets: [
                        {
                            data: data.response.data,
                            backgroundColor: [
                                '#C6F9D2',
                                '#CCCCB3',
                                '#CECEFF',
                                '#FFCAFF',
                                '#D0CCCD',
                                '#FFCC99',
                                '#FFCBB9',
                                '#EAEC93',
                                '#D7FBE6',
                                '#FFCACA',
                                '#00FF00'
                            ]
                        }
                    ]
                };

            },
            error => {
                console.log(error);
            }
        )
    }

    initBurnDownSocket() {
        var component = this;

        this.options = {
            animation: false
        };

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.socket = new WebSocket(environment.burnDownSocket);

        this.socket.onopen = function() {
            component.socket.send('Bearer=' + `${currentUser.response}`);
            console.log("Client connected to server")
        }

        this.socket.onmessage = function (e) {
            var message = JSON.parse(e.data);

            if (message) {
                component.barData = {
                    labels: ['0-30', '30-60', '60-90', '90+', 'Overdue'],
                    datasets: [
                        {
                            label: 'Medium',
                            data: [message.medium.zero_thirty, message.medium.thirty_sixty, message.medium.sixty_ninety, message.medium.ninety_up, message.medium.overdue],
                            backgroundColor: '#94CD58',
                            borderColor: '#94CD58'
                        },
                        {
                            label: 'High',
                            data: [message.high.zero_thirty, message.high.thirty_sixty, message.high.sixty_ninety, message.high.ninety_up, message.high.overdue],
                            backgroundColor: '#FDBF2E',
                            borderColor: '#FDBF2E'
                        },
                        {
                            label: 'Critical',
                            data: [message.crit.zero_thirty, message.crit.thirty_sixty, message.crit.sixty_ninety, message.crit.ninety_up, message.crit.overdue],
                            backgroundColor: '#FB0D1C',
                            borderColor: '#FB0D1C'
                        }
                    ]
                }

                component.burnDownDoneLoading = message.medium.done && message.high.done && message.crit.done;
            }

        }

        this.socket.onclose = function () {
            console.log("Client disconnected from server")
        }
    }

    getColor() {
        if (this.burnDownDoneLoading) {
            return 'green';
        } else {
            return 'red';
        }
    }
}
