import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { IUser } from '../../../core/interfaces/i-user'; // Assuming IUser is defined

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: IUser[] = [];
  newUser: IUser = {
    userId: 0,
    namaLengkap: '',
    password: '',
    email: '',
    unitKerja: '',
    nomorHP: '',
  };
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = true;
  aksesOptions = [
    { value: '1', label: 'Admin' },
    { value: '2', label: 'Resepsionis' },
    { value: '3', label: 'Staff' },
  ];


  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAllUsers();
  }

  // Load all users from the API
  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: IUser[]) => {
        this.users = response;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load users. Please try again later.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  // Handle delete user action
  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully';
          this.loadAllUsers(); // Reload user list after deletion
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to delete user. Please try again later.';
          console.error(err);
        },
      });
    }
  }

  // Handle user registration
  registerUser(): void {
    if (
      this.newUser.namaLengkap &&
      this.newUser.password &&
      this.newUser.email &&
      this.newUser.userId &&
      this.newUser.unitKerja &&
      this.newUser.nomorHP
    ) {
      this.userService.registerUser(this.newUser).subscribe({
        next: (response) => {
          this.successMessage = 'User registered successfully';
          this.errorMessage = '';
          console.log(response);
          
          this.loadAllUsers(); // Reload user list after registration
        },
        error: (err: any) => {
          this.errorMessage =
            'Failed to register user. Please try again later.';
          this.successMessage = '';
          console.error(err);
        },
      });
    } else {
      this.errorMessage = 'Please fill in all fields.';
    }
  }
}
