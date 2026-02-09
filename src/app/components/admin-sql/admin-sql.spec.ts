import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSqlComponent } from './admin-sql'; // Cambiado de AdminSql a AdminSqlComponent

describe('AdminSqlComponent', () => {
  let component: AdminSqlComponent;
  let fixture: ComponentFixture<AdminSqlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSqlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});