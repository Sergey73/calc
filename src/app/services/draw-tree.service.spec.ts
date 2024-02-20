import { TestBed } from '@angular/core/testing';

import { DrawTreeService } from './draw-tree.service';

describe('DrawTreeService', () => {
  let service: DrawTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
