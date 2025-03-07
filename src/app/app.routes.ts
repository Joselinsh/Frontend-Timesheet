import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AssignRolesComponent } from './assign-roles/assign-roles.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeDashboardContentComponent } from './employee-dashboard-content/employee-dashboard-content.component';
import { ProfileComponent } from './profile/profile.component';
import { TimesheetsComponent } from './timesheets/timesheets.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardContentComponent, pathMatch: 'full' },
      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'assign-roles', component: AssignRolesComponent }
    ]
  },
  {
    path: 'employee',
    component: EmployeeDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: EmployeeDashboardContentComponent, pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },     
      { path: 'timesheets', component: TimesheetsComponent }, // Added timesheets route
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'leaves', component: EmployeeDashboardContentComponent } // Placeholder
    ]
  },
  { path: '**', redirectTo: '' }
];