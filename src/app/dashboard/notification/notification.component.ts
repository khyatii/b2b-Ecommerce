import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  traderId: any;
  notificationArray=[];
  constructor(private notificationService:NotificationService,private userService:UserService) { }

  ngOnInit() {    
    this.userService.getUser().subscribe(resp=>{
      this.traderId = resp.doc[0]._id;

      this.notificationService.getNotification().subscribe(res=>{
        for(let i=0;i<res.length;i++){
          if(res[i].traderId._id == this.traderId){
            this.notificationArray.push(res[i])
          }
        }
      })
    })
  }

  timeSince(date) {
    date = new Date(date)
    let newDate:any= new Date()
    var seconds = Math.floor((newDate - date) / 1000);
  
    var interval = Math.floor(seconds / 31536000);
  
    if (interval >= 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

}
