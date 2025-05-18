// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Base URL to the backend API user endpoints
  private apiUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get all users (Admin use only)
   * @returns Observable of User array
   */
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Get a single user by ID (Admin use only)
   * @param id - User's unique ID
   * @returns Observable of User
   */
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new user (Admin use only)
   * @param user - Partial user object with required creation fields
   * @returns Observable of created User
   */
  create(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Update an existing user by ID (Admin use only)
   * @param id - User's unique ID
   * @param user - Partial user object containing updated fields
   * @returns Observable of updated User
   */
  update(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Delete a user by ID (Admin use only)
   * @param id - User's unique ID
   * @returns Observable of any server response
   */
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Get the profile of the logged-in user
   * Calls GET /users/me
   * @returns Observable of current User profile
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  /**
   * Update the profile of the logged-in user
   * Calls PUT /users/me
   * @param user - Partial user object with profile fields to update
   * @returns Observable of updated User profile
   */
  updateProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, user);
  }
}
