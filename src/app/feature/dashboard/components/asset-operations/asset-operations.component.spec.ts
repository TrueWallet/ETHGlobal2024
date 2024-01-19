import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetOperationsComponent } from './asset-operations.component';

describe('AssetOperationsComponent', () => {
  let component: AssetOperationsComponent;
  let fixture: ComponentFixture<AssetOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetOperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
