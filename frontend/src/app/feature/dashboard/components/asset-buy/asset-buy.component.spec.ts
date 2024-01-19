import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetBuyComponent } from './asset-buy.component';

describe('AssetBuyComponent', () => {
  let component: AssetBuyComponent;
  let fixture: ComponentFixture<AssetBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetBuyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
