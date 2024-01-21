import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowToPaymasterComponent } from './borrow-to-paymaster.component';

describe('BorrowToPaymasterComponent', () => {
  let component: BorrowToPaymasterComponent;
  let fixture: ComponentFixture<BorrowToPaymasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowToPaymasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BorrowToPaymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
