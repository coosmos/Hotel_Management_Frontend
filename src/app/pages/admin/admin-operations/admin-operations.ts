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
    errorMessage: string = '';
    successMessage: string = '';

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
                    // Ensure errorMessage is cleared on successful load if desired, 
                    // or leave it if it's unrelated.
                }
                this.loading = false;
            },
            error: (err) => {
                this.handleError(err);
                this.loading = false;
            }
        });
    }

    submitHotel() {
        if (this.hotelForm.invalid) return;

        this.loading = true;
        this.clearMessages();

        const payload = {
            ...this.hotelForm.value,
            name: this.hotelForm.value.hotelName
        };

        this.hotelService.createHotel(payload).subscribe({
            next: (res) => {
                this.successMessage = 'Hotel created successfully!';
                this.hotelForm.reset({ status: 'ACTIVE', state: 'DEL', country: 'INDIA', starRating: 5, amenities: 'Wifi, Pool' });
                this.loading = false;
                // Optional: switch view automatically or just show success
                setTimeout(() => {
                    this.switchView('view-hotels');
                    this.successMessage = '';
                }, 1500);
            },
            error: (err) => {
                this.handleError(err);
                this.loading = false;
            }
        });
    }

    submitUser() {
        if (this.userForm.invalid) return;

        this.loading = true;
        this.clearMessages();

        this.authService.createUser(this.userForm.value).subscribe({
            next: (res) => {
                this.successMessage = 'Staff account created successfully!';
                this.userForm.reset({ role: 'MANAGER' });
                this.loading = false;
            },
            error: (err) => {
                this.handleError(err);
                this.loading = false;
            }
        });
    }

    handleError(error: any): void {
        console.error('API Error:', error);
        if (error.status === 409) {
            this.errorMessage = error.error?.message || 'Conflict: This record already exists (e.g., email or username).';
        } else if (error.status === 504) {
            this.errorMessage = 'Server Gateway Timeout. The server is not responding, please try again later.';
        } else if (error.status === 403) {
            this.errorMessage = 'You do not have permission to perform this action.';
        } else {
            this.errorMessage = error.error?.message || 'An unexpected error occurred. Please try again.';
        }
    }

    clearMessages() {
        this.errorMessage = '';
        this.successMessage = '';
    }

    navigateToAnalytics() {
        this.router.navigate(['/admin/dashboard']);
    }
}
