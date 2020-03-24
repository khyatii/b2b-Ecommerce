import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { ChatService } from '../layout/chat-sidebar/chat.service';

@Injectable()
export class NotificationService extends CommonService {
  private socket = io('http://localhost:8000');
  constructor(http: Http, private ChatService: ChatService) {
    super(http);
    this.socket.emit('join', localStorage.getItem('email'));
  }

  getNotification() {
    return super.getValue('notification/getNotification');
  }
  getNotificationLogistics() {
    return super.getValue('notification/getNotificationLogistics');
  }

  getNewNotification() {
    return super.getValue('notification/newNotifications')
  }

  sendUserNotification(data) {
    data['senderId'] = localStorage.getItem('email');
    data['pageLink'] = data.pageLink;
    this.socket.emit('sendNotification', data);
  }

  sendNotLogedInUserNotification(data) {
    data['pageLink'] = data.pageLink;
    this.socket.emit('sendNotification', data);
  }

  getUserNotification() {
    let observable = new Observable((observer: any) => {
      this.socket.on('recievNotification', (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  statusRead(data) { //when user open's message mark it to read
    let filtered = data.filter(message => {
      if (message.notificationState == false) {
        return message._id;
      }
    })
    let newRead = filtered.map(item => item._id);
    this.socket.emit('readMessage', newRead)

  }


}
