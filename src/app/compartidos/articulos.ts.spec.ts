import { TestBed } from '@angular/core/testing';

import { ArticulosTs } from './articulos.ts';

describe('ArticulosTs', () => {
  let service: ArticulosTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticulosTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
