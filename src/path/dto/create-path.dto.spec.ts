import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { CreatePathDTO } from './create-path.dto';
import { validate } from 'class-validator';

describe('Create path DTO', () => {
  const bodyBase = {
    title: 'To Shop',
    distance: 500,
    description: 'To shop description',
    shortDescription: 'To shop short description',
  };

  it('Should not fail', async () => {
    const body = {
      ...bodyBase,
      points: [
        { lat: 20, lng: 10 },
        { lat: 10, lng: 20 },
      ],
    };
    const dto = plainToInstance(CreatePathDTO, body);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should fail because of points length < 2', async () => {
    const body = {
      ...bodyBase,
      points: [{ lat: 20, lng: 10 }],
    };
    const dto = plainToInstance(CreatePathDTO, body);
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(JSON.stringify(errors)).toContain(
      'Points must have length more than 1',
    );
  });

  it('Should fail because of invalid point type', async () => {
    const body = {
      ...bodyBase,
      points: [{ lat: 30 }, { lat: 30, lng: 40 }],
    };
    const dto = plainToInstance(CreatePathDTO, body);
    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(JSON.stringify(errors)).toContain('Lng must be a number');
  });
});
