import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20ReceiveComponent } from './erc20-receive.component';

describe('Erc20ReceiveComponent', () => {
  let component: Erc20ReceiveComponent;
  let fixture: ComponentFixture<Erc20ReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Erc20ReceiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Erc20ReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
