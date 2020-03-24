import { UserService } from './../../services/user.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AppConfig } from '../../app.config';
import { PermissionService } from '../../services/permission.service';
declare let jQuery: any;

@Component({
	selector: '[sidebarlogistic]',
	templateUrl: './sidebarlogistic.component.html',
	styleUrls: ['./sidebarlogistic.component.css']
})
export class SidebarlogisticComponent implements OnInit {

	public permission = {
		InventoryPermission: 'na',
		SettingsPermission: 'na',
		CustomersPermission: 'na',
		LogisticsPermission: 'na',
		admin: false,
	}
	traderBoth: any;
	trader: any;
	isAdmin: any;
	$el: any;
	config: any;
	router: Router;
	location: Location;
	logistics_type;
	multipletype:any[]

	constructor(config: AppConfig, el: ElementRef, router: Router, location: Location,
		public userService: UserService, private permissionService: PermissionService) {

		this.$el = jQuery(el.nativeElement);
		this.config = config.getConfig();
		this.router = router;
		this.location = location;

	}

	initSidebarScroll(): void {
		let $sidebarContent = this.$el.find('.js-sidebar-content');
		if (this.$el.find('.slimScrollDiv').length !== 0) {
			$sidebarContent.slimscroll({
				destroy: true
			});
		}
		$sidebarContent.slimscroll({
			height: window.innerHeight,
			size: '4px'
		});
	}

	changeActiveNavigationItem(location): void {
		let $newActiveLink = this.$el.find('a[href="#' + location.path().split('?')[0] + '"]');

		// collapse .collapse only if new and old active links belong to different .collapse
		if (!$newActiveLink.is('.active > .collapse > li > a')) {
			this.$el.find('.active .active').closest('.collapse').collapse('hide');
		}
		this.$el.find('.sidebar-nav .active').removeClass('active');

		$newActiveLink.closest('li').addClass('active')
			.parents('gili').addClass('active');
		// uncollagipse parent
		$newActiveLink.closest('.collapse').addClass('in').css('height', '')
			.siblings('a[data-toggle=collapse]').removeClass('collapsed');
	}

	ngAfterViewInit(): void {
		this.changeActiveNavigationItem(this.location);
	}

	ngOnInit(): void {
		var self = this
		this.userService.getLogisticData().subscribe(res => {
			if (res[0].logistics_type_multiple === true) {
				this.logistics_type = 'Multiple Logistics';
				this.multipletype= res[0].logistics_type
			  } else {
				this.logistics_type = res[0].logistics_type
			  }
			this.trader = res[0].trader_type;
			this.traderBoth = res[0].trader_type;
			if (this.traderBoth == 'Both') {
				this.trader = 'International';
			}
		})
		jQuery(window).on('sn:resize', this.initSidebarScroll.bind(this));
		this.initSidebarScroll();

		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.changeActiveNavigationItem(this.location);
			}
		});
	}

	callMultiple(data){
		this.router.navigate(['/logistic/logisticsUser/',  data ]);

	}

	selectBuyer(e) {
		this.trader = 'International'
		e.parentElement.getElementsByTagName('span')[0].style.color = '#aaa';
		e.parentElement.getElementsByTagName('span')[1].style.color = '#aaa';
		e.style.color = '#f0741b';
	}

	selectSeller(e) {
		this.trader = 'local'
		e.parentElement.getElementsByTagName('span')[0].style.color = '#aaa';
		e.parentElement.getElementsByTagName('span')[1].style.color = '#aaa';
		e.style.color = '#f0741b';
	}
}
