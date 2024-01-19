import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20SendComponent } from './erc20-send.component';

describe('Erc20SendComponent', () => {
  let component: Erc20SendComponent;
  let fixture: ComponentFixture<Erc20SendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Erc20SendComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Erc20SendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
