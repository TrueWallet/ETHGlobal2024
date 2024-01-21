import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSendComponent } from './asset-send.component';

describe('AssetSendComponent', () => {
  let component: AssetSendComponent;
  let fixture: ComponentFixture<AssetSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetSendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
