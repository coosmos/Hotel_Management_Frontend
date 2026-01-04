import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService, Hotel } from '../../../services/hotel.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-admin-operations',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './admin-operations.html',
    styleUrl: './admin-operations.css',
})
export class AdminOperations implements OnInit {
    currentView: 'home' | 'create-hotel' | 'view-hotels' | 'create-user' = 'home';
    hotels: Hotel[] = [];
    loading: boolean = false;

    hotelForm: FormGroup;
    userForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private hotelService: HotelService,
        private authService: AuthService,
        private router: Router
    ) {
        this.hotelForm = this.fb.group({
            hotelName: ['', Validators.required],
            description: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            state: ['DEL', Validators.required], // Default for now
            country: ['INDIA', Validators.required], // Default
            pincode: ['10001', Validators.required], // Default
            contactNumber: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            starRating: [5],
            amenities: ['Wifi, Pool, Gym'], // Default
            status: ['ACTIVE']
        });

        this.userForm = this.fb.group({
            role: ['MANAGER', Validators.required],
            hotelId: ['', Validators.required],
            fullName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            phoneNumber: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadHotels();
    }

    switchView(view: 'home' | 'create-hotel' | 'view-hotels' | 'create-user') {
        this.currentView = view;
        if (view === 'view-hotels' || view === 'create-user') {
            this.loadHotels(); // Refresh list
        }
    }

    loadHotels() {
        this.loading = true;
        this.hotelService.getAllHotels().subscribe({
            next: (response) => {
                if (response.success) {
                    this.hotels = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading hotels', err);
                this.loading = false;
            }
        });
    }

    submitHotel() {
        if (this.hotelForm.invalid) return;

        this.loading = true;
        const hotelData = {
            name: this.hotelForm.value.hotelName, // mao to hotelDto
            ...this.hotelForm.value
        };

        const payload = {
            ...this.hotelForm.value,
            name: this.hotelForm.value.hotelName
        };

        this.hotelService.createHotel(payload).subscribe({
            next: (res) => {
                alert('Hotel created successfully!');
                this.hotelForm.reset({ status: 'ACTIVE', state: 'NY', country: 'USA', starRating: 5, amenities: 'Wifi, Pool' });
                this.switchView('view-hotels');
            },
            error: (err) => {
                alert('Failed to create hotel');
                console.error(err);
                this.loading = false;
            }
        });
    }

    submitUser() {
        if (this.userForm.invalid) return;

        this.loading = true;
        this.authService.createUser(this.userForm.value).subscribe({
            next: (res) => {
                alert('Staff account created successfully!');
                this.userForm.reset({ role: 'MANAGER' });
                this.loading = false;
                // Stay on page or go details?
            },
            error: (err) => {
                alert('Failed to create user');
                console.error(err);
                this.loading = false;
            }
        });
    }

    navigateToAnalytics() {
        this.router.navigate(['/admin/dashboard']);
    }
}
