import { Component, OnInit, ElementRef } from '@angular/core';
import { ChatService } from './chat.service';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs/Rx';


declare let jQuery: any;
declare let Hammer: any;

@Component({
  selector: '[chat-sidebar]',
  templateUrl: './chat-sidebar.template.html'
})
export class ChatSidebar implements OnInit {
  onlineUsers:any=[];
  conversations: ChatService;
  newMessage: string = '';
  activeConversation: any;
  chatMessageOpened: boolean = false;
  $el: any;
  connection:any;
  searchText: string = '';
  todayConversations;
  userConversation;

  constructor(el: ElementRef,private ChatService:ChatService) {
    // this.ChatService.connectServer();

    // this.conversations = new ChatService();

    this.$el = jQuery(el.nativeElement);
    // this.activeConversation = this.conversations.todayConversati ons[0];
  }

  openConversation(conversation): void {
    this.userConversation = conversation;
    this.activeConversation = conversation;
    this.chatMessageOpened = true;
  }

  deactivateLink(e): void {
    jQuery(e.currentTarget).removeClass('active').find('.badge').remove();
  }

  initChatSidebarScroll(): void {
    let $sidebarContent = jQuery('.chat-sidebar-contacts', this.$el);
    if (this.$el.find('.slimScrollDiv').length !== 0) {
      $sidebarContent.slimscroll({
        destroy: true
      });
    }
    $sidebarContent.slimscroll({
      height: window.innerHeight,
      width: '',
      size: '4px'
    });
  }

  enableSwipeCollapsing(): void {
    let $chatContainer = jQuery('layout');
    let chatSidebarSwipe = new Hammer(document.getElementById('content-wrap'));

    chatSidebarSwipe.on('swipeleft', () => {
      if ($chatContainer.is('.nav-collapsed')) {
        $chatContainer.addClass('chat-sidebar-opened');
      }
    });

    chatSidebarSwipe.on('swiperight', () => {
      setTimeout(() => {
        if ($chatContainer.is('.chat-sidebar-opened')) {
          $chatContainer.removeClass('chat-sidebar-opened');
        }
      });
    });
  }

  ngOnInit(): void {

    // this.connection = this.ChatService.getActiveUsers().subscribe(users=>{
    //   this.onlineUsers = users;
    // })

 // this.ChatService.getActiveUsers().subscribe(users => {
 // })

    // this.onlineUser                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        s this.ChatService.getActiveUsers().subscribe(users =>{
    // // this.todayConversations  = new ChatService()
    //   users.map(user=>{
    //     return user
    //   })
    // })
    jQuery('layout').addClass('chat-sidebar-container');

    if ('ontouchstart' in window) {
      this.enableSwipeCollapsing();
    }

    jQuery(window).on('sn:resize', this.initChatSidebarScroll.bind(this));
    this.initChatSidebarScroll();
  }


}
