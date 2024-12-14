import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'; // Add dependency for modals
import { BookingService } from '../../../core/services/booking.service'; // Assuming you have a booking service
import { AuthenticationService } from '../../../core/services/authentication.service';
import { IBooking } from '../../../core/interfaces/i-booking';
import { IExtendBooking } from '../../../core/interfaces/i-extend';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
})
export class MyBookingsComponent implements OnInit {
  bookings: IBooking[] = []; // Your array of bookings
  confirmationCode!: number;
  extensionDate: string = '';
  extendReason: string = '';
  modalRef!: BsModalRef;
  selectedBookingId: number | null = null; // Property to store selected booking ID
  filteredBookings: IBooking[] = [];
  statusOptions = [
    { value: '0', label: 'Booked', checked: false },
    { value: '1', label: 'Ongoing', checked: false },
    { value: '2', label: 'Selesai', checked: false },
    { value: '3', label: 'Batal', checked: false },
  ];

  selectedSortOrder: string = 'nearest'; // Sorting order: 'nearest' or 'farthest'

  constructor(
    private modalService: BsModalService,
    private authService: AuthenticationService,
    private bookingService: BookingService // Assuming you have a service to handle the bookings
  ) {}

  ngOnInit(): void {
    this.bookingService.getMyBookings(this.authService.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.bookings = data;
        this.filteredBookings = [...this.bookings]; // Initialize filteredBookings with all bookings
        console.log('bookings: ', this.bookings);
      },
      error: (err) => console.error('error fetching bookings: ', err),
    });
  }

  applyFiltersAndSorting(): void {
    // Step 1: Get selected statuses
    const selectedStatuses = this.statusOptions
      .filter((status) => status.checked)
      .map((status) => status.value);

    // Step 2: Filter bookings by status
    let result = this.bookings;
    if (selectedStatuses.length > 0) {
      result = result.filter((booking) =>
        selectedStatuses.includes(booking.bookingStatus)
      );
    }

    // Step 3: Sort bookings by nearest date
    result = result.sort((a, b) => {
      const dateA = new Date(a.bookingDate + 'T' + a.startTime).getTime();
      const dateB = new Date(b.bookingDate + 'T' + b.startTime).getTime();
      return this.selectedSortOrder === 'nearest'
        ? dateA - dateB
        : dateB - dateA;
    });

    this.filteredBookings = result;
  }

  // Get status text based on booking status value
  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Booked';
      case 1:
        return 'Ongoing';
      case 2:
        return 'Selesai';
      case 3:
        return 'Batal';
      default:
        return 'Unknown';
    }
  }

  loadBookings() {
    this.bookingService.getMyBookings(this.authService.userId).subscribe({
      next: (data) => {
        this.bookings = data;
        this.applyFiltersAndSorting();
      },
      error: (err) => console.error('error fetching bookings: ', err),
    });
  }

  openConfirmationModal(bookingId: number, template: TemplateRef<any>) {
    this.selectedBookingId = bookingId;
    this.modalRef = this.modalService.show(template);
  }

  confirmBooking(): void {
    if (!this.confirmationCode) {
      console.log('Please enter a confirmation code');
      return;
    }

    if (this.selectedBookingId !== null) {
      this.bookingService
        .confirmBooking(this.selectedBookingId, this.confirmationCode)
        .subscribe({
          next: (response) => {
            console.log('booking confirmed: ', response);
            this.modalRef.hide();
            this.loadBookings();
          },
          error: (err) => {
            console.error('error: ', err);
          },
        });
    } else {
      console.log('Booking ID is missing');
    }
  }

  openExtendModal(bookingId: number, template: TemplateRef<any>) {
    this.selectedBookingId = bookingId;
    this.modalRef = this.modalService.show(template);
  }

  extendBooking() {
    if (!this.extensionDate || !this.extendReason) {
      console.error('Extension date and reason are required');
      return;
    }

    if (this.selectedBookingId !== null) {
      const extensionData: IExtendBooking = {
        newEndTime: this.extensionDate,
        reason: this.extendReason,
      };

      if (this.selectedBookingId !== null) {
        this.bookingService
          .extendBooking(this.selectedBookingId, extensionData)
          .subscribe({
            next: (response) => {
              console.log('extend booking success: ', response);
              this.loadBookings();
              this.modalRef.hide();
            },
            error: (err) => {
              console.error('error', err);
            },
          });
      } else {
        console.log('Please provide all details');
      }
    }
  }

  openCancelModal(bookingId: number, template: TemplateRef<any>) {
    this.selectedBookingId = bookingId;
    this.modalRef = this.modalService.show(template);
  }

  cancelBooking() {
    if (this.selectedBookingId !== null) {
      this.bookingService.cancelBooking(this.selectedBookingId).subscribe({
        next: (response) => {
          console.log('cancel booking success: ', response);
          this.modalRef.hide();
          this.loadBookings();
        },
        error: (err) => {
          console.error('error: ', err);
        },
      });
    } else {
      console.log('Booking ID is missing');
    }
  }

  openCompleteModal(bookingId: number, template: TemplateRef<any>): void {
    this.selectedBookingId = bookingId;
    this.modalRef = this.modalService.show(template);
  }

  // completeBooking() {
  //   if (this.selectedBookingId !== null) {
  //     this.bookingService.confirmBooking(this.selectedBookingId, this.confirmationCode).subscribe({
  //       next: (response) => {
  //         console.log('cancel booking success: ', response);
  //         this.loadBookings();
  //         this.modalRef.hide();
  //       },
  //       error: (err) => {
  //         console.error('error: ', err);
  //       },
  //     });
  //   } else {
  //     console.log('Booking ID is missing');
  //   }
  // }
}
