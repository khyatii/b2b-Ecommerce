import { Component, ElementRef, OnInit } from '@angular/core';
import { AppConfig } from '../../app.config';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

declare let jQuery: any;

@Component({
  selector: '[notifications]',
  templateUrl: './notifications.template.html',
  styleUrls: ['./notifications.style.scss']
})
export class Notifications implements OnInit {
  $el: any;
  config: any;
  notificationRefreshDate = new Date();
  allNotifications = [];
  unreadCount;
  logisticsId;
  notificationArray;

  constructor(el: ElementRef, config: AppConfig, private userService: UserService,
    private NotificationService: NotificationService, private router: Router) {
    this.$el = jQuery(el.nativeElement);
    this.config = config;
  }

  moveNotificationsDropdown(): void {
    jQuery('.sidebar-status .dropdown-toggle').after(jQuery('[notifications]').detach());
  }

  moveBackNotificationsDropdown(): void {
    jQuery('#notifications-dropdown-toggle').after(jQuery('[notifications]').detach());
  }

  ngOnInit(): void {

    this.userService.getLogisticData().subscribe(resp => {
      this.logisticsId = resp[0]._id;

      this.NotificationService.getNotificationLogistics().subscribe(res => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].traderId._id == this.logisticsId) {
            this.notificationArray.push(res[i])
          }
        }
      })
    })

    //user notification's
    this.NotificationService.getNotificationLogistics().subscribe(resp => {
      this.allNotifications = resp.allNotifications;
      //count for unread
      this.unreadCount = resp.unreadCount;
      // if unread is greater then 0 alert unread
      //else nothing
    });
    // if user online and have a new notifications
    this.NotificationService.getUserNotification().subscribe(newNotif => {
      // add that notification to all notification Array
      this.allNotifications.push(newNotif);
    })

    this.config.onScreenSize(['sm', 'xs'], this.moveNotificationsDropdown);
    this.config.onScreenSize(['sm', 'xs'], this.moveBackNotificationsDropdown, false);

    if (this.config.isScreen('sm')) { this.moveNotificationsDropdown(); }
    if (this.config.isScreen('xs')) { this.moveNotificationsDropdown(); }

    jQuery('.sidebar-status').on('show.bs.dropdown', () => {
      jQuery('#sidebar').css('z-index', 2);
    }).on('hidden.bs.dropdown', () => {
      jQuery('#sidebar').css('z-index', '');
    });

    jQuery(document).on('change', '[data-toggle="buttons"] > label', ($event) => {
      let $input = jQuery($event.target).find('input');
      $input.trigger('change');
    });
  }

  dateTimeFormat(val) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    let date = val.getDate();
    let month = monthNames[val.getMonth()];
    let year = val.getFullYear();
    let hours = val.getHours();
    let minutes = val.getMinutes();
    return '' + month + ' ' + date + ' ' + year + ' ' + hours + ':' + minutes
  }

  refreshNotification() {
    this.notificationRefreshDate = new Date();
  }
  redirectOnNotification(notify) {
    if (notify.redirectUrl !== '#')
      this.router.navigate([notify.redirectUrl]);
  }

}
