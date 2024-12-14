import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isSidebarCollapsed: boolean = false; // Track the sidebar state

  currentRoute: string = ''; // Holds the active route
  menuItems = [
    { name: 'Home', route: '/home', icon: 'bi-house-door' },
    { name: 'My Bookings', route: '/my-bookings', icon: 'bi-bookmark' },
    { name: 'Profile', route: '/profile', icon: 'bi-person' },
    { name: 'ListBookings', route: '/list-bookings', icon: 'bi-list' },
    { name: 'User Management', route: '/user-management', icon: 'bi-person-lines-fill' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Update `currentRoute` whenever the route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Function to return icon based on route
  getIcon(route: string): string {
    switch (route) {
      case '/home':
        return 'home';
      case '/my-bookings':
        return 'book_online';
      case '/profile':
        return 'account_circle';
      case '/list-bookings':
        return 'list_alt';
      case '/user-management':
        return 'group';
      default:
        return 'home'; // Default icon
    }
  }
}
