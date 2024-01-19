import { TestBed } from '@angular/core/testing';

import { Erc20ManagerService } from './erc20-manager.service';

describe('Erc20ManagerService', () => {
  let service: Erc20ManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Erc20ManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
