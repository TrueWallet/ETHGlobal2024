import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDepositComponent } from './asset-deposit.component';

describe('AssetP2PComponent', () => {
  let component: AssetDepositComponent;
  let fixture: ComponentFixture<AssetDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetDepositComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
