import { TestBed } from '@angular/core/testing';

import { ImgUploadServiceService } from './img-upload-service.service';

describe('ImgUploadServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImgUploadServiceService = TestBed.get(ImgUploadServiceService);
    expect(service).toBeTruthy();
  });
});
