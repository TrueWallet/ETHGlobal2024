import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20BorrowComponent } from './erc20-borrow.component';

describe('Erc20BorrowComponent', () => {
  let component: Erc20BorrowComponent;
  let fixture: ComponentFixture<Erc20BorrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Erc20BorrowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Erc20BorrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
