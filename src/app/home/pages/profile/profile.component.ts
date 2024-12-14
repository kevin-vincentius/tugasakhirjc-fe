import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { IUser } from '../../../core/interfaces/i-user'; // Assuming IUser is defined
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userId: number = 0;
  user: IUser | null = null; // Define user as IUser type
  oldPassword: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = true; // To manage loading state

  constructor(private userService: UserService, private route: ActivatedRoute, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.loadUserData();
  }
  // this.isLoading = true;
  // this.bookingService.getAllBookings().subscribe({
  //   next: (response: IBooking[]) => {
  //     this.bookings = response;
  //     this.isLoading = false;
  //   },
  //   error: (err) => {
  //     this.errorMessage = 'Failed to load bookings. Please try again later.';
  //     this.isLoading = false;
  //     console.error(err);
  //   },
  // });

  loadUserData(): void {
    // Assuming that the user ID is available via authentication or session
    this.userId = this.authService.userId;

    this.userService.getUserDetail(Number(this.userId)).subscribe({
      next: (response: IUser) => {
        this.user = response;
        this.isLoading = false; // Data has been loaded
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load user data. Please try again later.';
        this.isLoading = false; // Data load failed
        console.error(err);
      },
    });
    console.log(this.user);
    
  }

  changePassword(): void {
    // Call the service to change the password
    const passwordData = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };

    this.userService.changePassword(this.userId, passwordData).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully';
        this.errorMessage = '';
        this.oldPassword = '';
        this.newPassword = '';
      },
      error: (err: any) => {
        console.error('Error changing password:', err);
        this.errorMessage = 'Failed to change password';
        this.successMessage = '';
      },
    });
  }
}
