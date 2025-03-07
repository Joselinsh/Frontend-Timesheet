import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDashboardContentComponent } from './employee-dashboard-content.component';

describe('EmployeeDashboardContentComponent', () => {
  let component: EmployeeDashboardContentComponent;
  let fixture: ComponentFixture<EmployeeDashboardContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDashboardContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDashboardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
