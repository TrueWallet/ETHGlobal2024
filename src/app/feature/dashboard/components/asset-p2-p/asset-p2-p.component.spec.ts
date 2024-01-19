import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetP2PComponent } from './asset-p2-p.component';

describe('AssetP2PComponent', () => {
  let component: AssetP2PComponent;
  let fixture: ComponentFixture<AssetP2PComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetP2PComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetP2PComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
