import { IBookingExtension } from "./i-booking-extension";
import { IRoom } from "./i-room";
import { IUser } from "./i-user";

export interface IBooking {
  bookingId: number;
  bookingsExtensions?: IBookingExtension | null;
  bookingStatus: string;
  bookingDate: string; // e.g., '2024-11-25'
  startTime: string; // e.g., '10:00'
  endTime: string; // e.g., '12:00'
  bookingType: string; // e.g., 'Meeting'
  description: string; // e.g., 'Team meeting'
  room: IRoom;
  user?: IUser;
}
