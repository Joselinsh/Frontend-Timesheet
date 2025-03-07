import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInitials = new BehaviorSubject<string>('E');
  private userFullName = new BehaviorSubject<string>('Employee');
  userInitials$ = this.userInitials.asObservable();
  userFullName$ = this.userFullName.asObservable();

  setUserInitials(fullName: string): void {
    const initials = fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
    this.userInitials.next(initials);
  }

  setUserFullName(fullName: string): void {
    this.userFullName.next(fullName);
  }
}