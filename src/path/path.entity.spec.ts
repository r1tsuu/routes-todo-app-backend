import 'reflect-metadata';
import { Path } from './path.entity';

describe('Path Entity', () => {
  const title = 'Test path';
  const description = 'Test description';
  const shortDescription = 'Test short description';
  const distance = 1000;
  const points = [
    {
      lat: 20,
      lng: 10,
    },
    {
      lat: 30,
      lng: 20,
    },
  ];

  it('Should make a path ', () => {
    const path = new Path({
      title,
      description,
      shortDescription,
      points,
      distance,
    });
    expect(path).toBeTruthy();
    expect(path.title).toBe(title);
    expect(path.description).toBe(description);
    expect(path.shortDescription).toBe(shortDescription);
    expect(path.distance).toBe(distance);
    expect(path.points).toEqual(points);
    expect(path.inFavorites).toBe(false);
  });
});
