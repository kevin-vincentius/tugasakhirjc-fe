import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../core/services/room.service';
import { IRoom } from '../../../core/interfaces/i-room';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit {
  rooms: IRoom[] = [];
  filteredRooms: IRoom[] = [];     
  showFilterModal: boolean = false;
  errorMessage: string | null = null;

  // Filter criteria
  filterFloor: number[] = [6, 7, 8];
  filterCapacity: string[] = ['Small', 'Medium', 'Large'];
  filterStatus: string[] = ['Available', 'Occupied'];
  filterProjector: boolean[] = [true, false];

  selectedFloor: any = '';
  selectedCapacity: any = '';
  selectedStatus: any = '';
  selectedProjector: any = '';

  constructor(private roomService: RoomService, private router: Router) {}

  ngOnInit(): void {
    this.getRooms(); 
  }

  getRooms(): void {
    const filters = {
      floor: this.selectedFloor,
      capacity: this.selectedCapacity,
      status: this.selectedStatus,
      hasProjector: this.selectedProjector !== '' ? this.selectedProjector : undefined,
    };

    this.roomService.getRooms(filters).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.filteredRooms = rooms; 
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.error(err);
      },
    });
  }

  openFilterModal(): void {
    this.showFilterModal = true;
  }

  closeFilterModal(): void {
    this.showFilterModal = false;
  }

  applyFilters(): void {
    this.getRooms(); 
    this.closeFilterModal(); 
  }

  resetFilters(): void {
    this.selectedFloor = '';
    this.selectedCapacity = '';
    this.selectedStatus = '';
    this.selectedProjector = '';
    this.getRooms();
  }

  navigateToRoomDetail(roomNumber: string): void {
    this.router.navigate([`/room/${roomNumber}`]);
  }
}