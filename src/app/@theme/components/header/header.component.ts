import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserProfileService } from '../../../services/user.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  // userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  userMenu = [
    { title: 'Profile', data: { action: 'profile' } },
    { title: 'Log out', data: { action: 'logout' } },
  ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private router: Router,
              private userCustomService: UserProfileService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.menuService.onItemClick()
      .pipe(
        takeUntil(this.destroy$),
        filter(({ tag }) => tag === 'user-menu'),
        map(({ item }) => item)
      )
      .subscribe(item => {
        const action = item.data?.action;
        if (action === 'profile') this.router.navigate(['/pages/dashboard']);
        else if (action === 'logout') this.handleLogout();
      });

    this.userCustomService.getUserDetails()
    .pipe(takeUntil(this.destroy$))
    .subscribe((user: any) => {
      this.user = user.user;
    });
  
    
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/auth/login']);
  }
}
