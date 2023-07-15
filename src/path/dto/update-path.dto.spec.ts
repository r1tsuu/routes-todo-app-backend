import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { UpdatePathDTO } from './update-path.dto';
import { validate } from 'class-validator';

describe('Update path DTO', () => {
  const id = 0;

  it('Should not fail', async () => {
    const dto = plainToInstance(UpdatePathDTO, {
      id,
      inFavorites: true,
      points: [
        {
          lat: 10,
          lng: 20,
        },
        {
          lat: 30,
          lng: 10,
        },
      ],
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should fail because id is empty', async () => {
    const dto = plainToInstance(UpdatePathDTO, {
      inFavorites: true,
      points: [
        {
          lat: 10,
          lng: 20,
        },
        {
          lat: 30,
          lng: 10,
        },
      ],
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(JSON.stringify(errors)).toContain('ID must be not empty');
  });

  it('Should fail because of points length < 2', async () => {
    const dto = plainToInstance(UpdatePathDTO, {
      id,
      points: [{ lat: 20, lng: 10 }],
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(JSON.stringify(errors)).toContain(
      'Points must have length more than 1',
    );
  });

  it('Should fail because of invalid point type', async () => {
    const dto = plainToInstance(UpdatePathDTO, {
      id,
      points: [{ lat: 30 }, { lat: 30, lng: 40 }],
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(JSON.stringify(errors)).toContain('Lng must be a number');
  });
});
