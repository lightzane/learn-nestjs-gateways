import { TestBed } from '@angular/core/testing';

import { MySocketService } from './my-socket.service';

describe('MySocketService', () => {
  let service: MySocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MySocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
