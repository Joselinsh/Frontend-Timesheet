import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AssignRolesComponent } from './assign-roles/assign-roles.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: DashboardComponent, // Layout with sidebar, header, and router-outlet
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default redirect to dashboard
      { path: 'dashboard', component: DashboardContentComponent, pathMatch: 'full' }, // Use DashboardContent for dashboard content
      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'assign-roles', component: AssignRolesComponent }
    ]
  }
];