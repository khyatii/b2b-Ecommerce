import { Component, EventEmitter, OnInit, ElementRef, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import { UserService } from '../../services/user.service';
import { PermissionService } from '../../services/permission.service';
import { NotificationService } from '../../services/notification.service';
declare let jQuery: any;

@Component({
selector: '[navbar]',
templateUrl: './navbar.template.html'
})
export class NavbarComponent implements OnInit {
[x: string]: any;
@Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
@Output() toggleChatEvent: EventEmitter<any> = new EventEmitter();
$el: any;
config: any;
router: Router;
allNotifications=[];
unreadCount = 0;

constructor(el: ElementRef, config: AppConfig, router: Router,private userService:UserService
  ,public permissionService:PermissionService,private notificationService:NotificationService) {
  this.$el = jQuery(el.nativeElement);
  this.config = config.getConfig();
  this.router = router;

}

toggleSidebar(state): void {
  this.toggleSidebarEvent.emit(state);
}

toggleChat(): void {
  this.toggleChatEvent.emit(null);
}

onDashboardSearch(f): void {
  this.router.navigate(['/logistic', 'extra', 'search'], { queryParams: { search: f.value.search } });
}

ngOnInit(): void {
//  this.notificationService.test()
  var self = this
  this.userService.getLogisticData().subscribe(res=>{
  this.userName = res[0].registration_name
  // let permission = {}
  // permission['InventoryPermission'] = res.doc[1].txtInventoryPermission
  // permission['SettingsPermission'] = res.doc[1].txtSettingsPermission
  // permission['CustomersPermission'] = res.doc[1].txtCustomerManagement
  // permission['LogisticsPermission'] = res.doc[1].txtLogisticsPermission
  // permission['admin'] = res.doc[1].admin
  // self.permissionService.permission(permission)

	this.notificationService.getNotificationLogistics().subscribe(resp=>{
    this.allNotifications = resp.allNotifications;
		//count for unread
		this.unreadCount = resp.unreadCount;
		// if unread is greater then 0 alert unread
		if(this.unreadCount > 0){
			alert('you have '+this.unreadCount+' new Notifications');
		}
		//else nothing
	});
    // if user online and have a new notifications
    this.notificationService.getUserNotification().subscribe(newNotif=>{
    let tempArr = this.allNotifications;
    tempArr.splice(0,0,newNotif)
    this.allNotifications = tempArr;
    // add that notification to all notification Array
      this.unreadCount++;
    })
  })

  setTimeout(() => {
  let $chatNotification = jQuery('#chat-notification');
  $chatNotification.removeClass('hide').addClass('animated fadeIn')
    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
    $chatNotification.removeClass('animated fadeIn');
    setTimeout(() => {
      $chatNotification.addClass('animated fadeOut')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd' +
        ' oanimationend animationend', () => {
        $chatNotification.addClass('hide');
      });
    }, 8000);
    });
  $chatNotification.siblings('#toggle-chat')
    .append('<i class="chat-notification-sing animated bounceIn"></i>');
  }, 4000);

  this.$el.find('.input-group-addon + .form-control').on('blur focus', function(e): void {
  jQuery(this).parents('.input-group')
    [e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
  });
}
openNotificatioin(allNotifications){
	this.notificationService.statusRead(allNotifications)
	this.unreadCount = 0;
}

logout(){
  localStorage.clear();
  this.router.navigate(['/b2b-store']);
}
}
