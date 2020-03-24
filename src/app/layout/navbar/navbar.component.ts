import { Component, EventEmitter, OnInit, ElementRef, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import { UserService } from '../../services/user.service';
import { ChatService } from '../chat-sidebar/chat.service';
import { NotificationService } from '../../services/notification.service';

declare let jQuery: any;

@Component({
	selector: '[navbar]',
	templateUrl: './navbar.template.html'
})
export class Navbar implements OnInit {
	@Output() openNotificationEvent = new EventEmitter<Event>();
	[x: string]: any;
	@Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
	@Output() toggleChatEvent: EventEmitter<any> = new EventEmitter();
	$el: any;
	config: any;
	router: Router;
	allNotifications=[];
	unreadCount;

	constructor(el: ElementRef, config: AppConfig, router: Router,
		private userService: UserService,private ChatService:ChatService,private NotificationService:NotificationService) {
		// let userEmail = localStorage.getItem('email');
		// alert(userEmail)
		// this.ChatService.connectServer();
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
		this.router.navigate(['/app', 'extra', 'search'], { queryParams: { search: f.value.search } });
	}

	ngOnInit(): void {
	

// if there users connects first time get all previous notifications
	this.NotificationService.getNotification().subscribe(resp=>{
		this.allNotifications = resp.allNotifications.reverse();
		//count for unread
		this.unreadCount = resp['unreadCount'];
		// if unread is greater then 0 alert unread
		if(this.unreadCount > 0){
			alert('you have '+this.unreadCount+' new Notifications');
		}
		//else nothing
	});
// if user online and have a new notifications
	this.NotificationService.getUserNotification().subscribe(newNotif=>{
	let tempArr = this.allNotifications;
	tempArr.splice(0,0,newNotif)
	this.allNotifications = tempArr;
	// add that notification to all notification Array
		this.unreadCount++;
	})

	// if already notification tab open no alert show message
	//else count size of new notification array and alert and add to notification





		//
		// this.NotificationService.getNewNotification().subscribe(resp=>{
		// })


		this.userService.getUser().subscribe(res => {
			this.userName = res.doc[0].registration_name;
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

		this.$el.find('.input-group-addon + .form-control').on('blur focus', function (e): void {
			jQuery(this).parents('.input-group')
			[e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
		});
	}
	openNotificatioin(allNotifications){
		this.NotificationService.statusRead(allNotifications)
		this.unreadCount = 0;
	}

	logout() {
		localStorage.clear();
		this.router.navigate(['/b2b-store']);
	}
}
