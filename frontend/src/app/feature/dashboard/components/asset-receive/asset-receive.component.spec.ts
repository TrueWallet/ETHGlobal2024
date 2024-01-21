import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetReceiveComponent } from './asset-receive.component';

describe('AssetReceiveComponent', () => {
  let component: AssetReceiveComponent;
  let fixture: ComponentFixture<AssetReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetReceiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
