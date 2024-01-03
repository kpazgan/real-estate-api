import { BadRequestException } from '@nestjs/common';
import { MaxFilesCountValidationPipe } from './max-files-count-validation.pipe';

describe('MaxFilesCountValidationPipe', () => {
  let maxFileCountPipe: MaxFilesCountValidationPipe;

  beforeEach(() => {
    maxFileCountPipe = new MaxFilesCountValidationPipe(2);
  });

  it(`should throw an exception if number of files is grater then the max allowed`, () => {
    const file = {} as Express.Multer.File;

    const result = () => maxFileCountPipe.transform([file, file, file]);

    expect(result).toThrow(BadRequestException);
  });

  it(`should return files if number of files is lower then the max allowed`, () => {
    const file = {} as Express.Multer.File;
    const payload = [file];

    const result = maxFileCountPipe.transform(payload);

    expect(result).toEqual(payload);
  });

  it(`should return files if number of files is equal to the max allowed`, () => {
    const file = {} as Express.Multer.File;
    const payload = [file, file];

    const result = maxFileCountPipe.transform(payload);

    expect(result).toEqual(payload);
  });

  it('should be defined', () => {
    expect(maxFileCountPipe).toBeDefined();
  });
});
