import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';
import { IBooking } from '../../../core/interfaces/i-booking';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-booking',
  templateUrl: './list-booking.component.html',
  styleUrls: ['./list-booking.component.css'],
})
export class ListBookingComponent implements OnInit {
  bookings: IBooking[] = []; // Store bookings
  selectedBookingId: number | null = null; // Track selected booking for code generation
  isLoading: boolean = true; // Show loading spinner
  errorMessage: string | null = null; // Error message display
  confirmationCode: number | null = null;

  constructor(
    private bookingService: BookingService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (response: IBooking[]) => {
        this.bookings = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load bookings. Please try again later.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  generateCodeAndOpenModal(modalTemplate: any, bookingId: number): void {
    this.selectedBookingId = bookingId;
    this.confirmationCode = null; // Reset confirmation code
    this.errorMessage = null; // Reset error message

    // Call the API to generate the code
    this.bookingService.generateBookingCode(bookingId).subscribe({
      next: (response: any) => {
        console.log(response)
        this.confirmationCode = response.data.confirmationCode; // Save confirmation code
        this.modalService.open(modalTemplate, { centered: true }); // Open modal
      },
      error: (err) => {
        this.errorMessage = 'Failed to generate code. Please try again.';
        console.error(err);
        this.modalService.open(modalTemplate, { centered: true }); // Open modal to show error
      },
    });
    console.log(this.confirmationCode);
    
  }
}
