import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../../../core/services/room.service';
import { IBookingRequest } from '../../../../../core/interfaces/i-booking-request'; // Import the IBookingRequest interface
import { IBooking } from '../../../../../core/interfaces/i-booking';
import { IApiResponse } from '../../../../../core/interfaces/i-api-response';
import { format } from 'date-fns'; // Import the date-fns library for formatting
import { ActivatedRoute } from '@angular/router';
import { IRoom } from '../../../../../core/interfaces/i-room';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css'],
})
export class RoomDetailComponent implements OnInit {
  room: any;
  schedules: IBooking[] = []; // All schedules
  filteredSchedules: IBooking[] = []; // Filtered schedules based on selected date
  selectedDate: string = ''; // For the filter date

  bookingDate: string = '';
  startTime: string = '';
  endTime: string = '';
  bookingType: string = '';
  description: string = '';
  showBookingModal: boolean = false;
  showFilterModal: boolean = false; // New property for filter modal

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const roomNumber = this.route.snapshot.paramMap.get('roomNumber') || '';

    this.getRoomDetail(roomNumber);
    this.setDefaultFilterDate();
  }

  setDefaultFilterDate(): void {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  }

  getRoomDetail(roomNumber: string): void {
    this.roomService.getRoomDetail(roomNumber).subscribe({
      next: (response: any) => {
        this.room = response;
        this.fetchSchedules(); // Fetch schedules when the component loads

      },
      error: (err) => {
        console.error('Error fetching room details:', err);
      },
    });
  }

  fetchSchedules(): void {
    const roomNumber = this.room.roomNumber;
    console.log(roomNumber);
    
    if (!roomNumber) return;

    this.roomService.getSchedules(roomNumber).subscribe({
      next: (response: any) => {
        if (response && response.length > 0) {
          console.log(response);
          
          this.schedules = response; // Store the schedules array from the response
          this.filterSchedules(); // Update filtered schedules
        } else {
          console.error('Error: No valid schedule data received or empty data');
        }
      },
      error: (error: any) => {
        console.error('Error fetching schedules:', error);
      },
    });
  }

  // Handle schedule filtering based on selected date
  filterSchedules(): void {
    if (!this.selectedDate) {
      this.filteredSchedules = [...this.schedules]; // Show all schedules if no date is selected
    } else {
      const selectedDateFormatted = new Date(this.selectedDate)
        .toISOString()
        .split('T')[0]; // Normalize to YYYY-MM-DD
      console.log('Selected Date:', selectedDateFormatted);

      this.filteredSchedules = this.schedules.filter(
        (schedule) => schedule.bookingDate?.startsWith(selectedDateFormatted) // Match only the date part
      );
    }
  }

  // Triggered when the booking date is changed
  onDateChange(): void {
    this.filterSchedules(); // Re-filter schedules when the date changes
  }

  openBookingModal(): void {
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
  }

  bookRoom(): void {
    console.log(this.bookingType);
    
    // Format the booking date and time
    const formattedBookingDate = format(
      new Date(this.selectedDate),
      'yyyy-MM-dd'
    );
    const formattedStartDateTime = format(
      new Date(`${formattedBookingDate}T${this.startTime}:00`),
      "yyyy-MM-dd'T'HH:mm:ss"
    );
    const formattedEndDateTime = format(
      new Date(`${formattedBookingDate}T${this.endTime}:00`),
      "yyyy-MM-dd'T'HH:mm:ss"
    );

    const bookingData: IBookingRequest = {
      bookingDate: formattedBookingDate, // Keep this as date only
      startTime: formattedStartDateTime, // Use formatted time
      endTime: formattedEndDateTime, // Use formatted time
      bookingType: this.bookingType,
      description: this.description,
    };

    this.roomService.bookRoom(this.room.roomNumber, bookingData).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        alert('Room booked successfully!');
        this.closeBookingModal();
        this.fetchSchedules(); // Refresh schedules after booking
      },
      error: (error) => {
        console.error('Error booking room:', error);
        alert('Error booking room. Please try again.');
      },
    });
  }

  openFilterModal(): void {
    this.showFilterModal = true;
  }

  closeFilterModal(): void {
    this.showFilterModal = false;
  }
}
