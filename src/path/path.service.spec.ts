import { Repository } from 'typeorm';
import { PathService } from './path.service';
import { Path } from './path.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

const onePath = {
  id: 0,
  title: 'Path1',
  description: 'Descript1',
  shortDescription: 'ShortDescr1',
  distance: 100,
  inFavorites: false,
  points: [
    {
      lat: 20,
      lng: 30,
    },
    {
      lat: 10,
      lng: 40,
    },
  ],
};

const pathsArray = [
  onePath,
  {
    id: 1,
    title: 'Path2',
    description: 'Descript2',
    shortDescription: 'ShortDescr2',
    distance: 100,
    inFavorites: false,
    points: [
      {
        lat: 20,
        lng: 30,
      },
      {
        lat: 10,
        lng: 40,
      },
      {
        lat: 50,
        lng: 20,
      },
    ],
  },
];

describe('PathService', () => {
  let service: PathService;
  let repo: Repository<Path>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PathService,
        {
          provide: getRepositoryToken(Path),
          useValue: {
            find: jest.fn().mockResolvedValue(pathsArray),
            findOneOrFail: jest.fn().mockResolvedValue(onePath),
            create: jest.fn().mockResolvedValue(onePath),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<PathService>(PathService);
    repo = module.get<Repository<Path>>(getRepositoryToken(Path));
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('Should return an array of paths', async () => {
      const paths = await service.getAll();
      expect(paths).toEqual(pathsArray);
    });
  });

  describe('getOne', () => {
    it('Should return a single path', async () => {
      expect(service.getOne(0)).resolves.toEqual(onePath);
      expect(repo.findOneOrFail).toBeCalledTimes(1);
      expect(repo.findOneOrFail).toBeCalledWith({ where: { id: 0 } });
    });
  });

  describe('insertOne', () => {
    it('Should successfully insert a path', async () => {
      const path = {
        title: onePath.title,
        description: onePath.description,
        shortDescription: onePath.shortDescription,
        points: onePath.points,
        distance: onePath.distance,
      };
      expect(service.insertOne(path)).resolves.toEqual({
        ...path,
        inFavorites: false,
      });
      expect(repo.save).toBeCalledTimes(1);
      expect(repo.save).toBeCalledWith({
        ...path,
        inFavorites: false,
      });
    });
  });

  describe('updateOne', () => {
    it('Should call the update method', async () => {
      const path = await service.updateOne({
        id: 0,
        title: 'Title',
        inFavorites: true,
      });
      expect(path).toEqual(onePath);
      expect(repo.update).toBeCalledTimes(1);
      expect(repo.update).toBeCalledWith(
        {
          id: 0,
        },
        { title: 'Title', inFavorites: true },
      );
    });
  });

  describe('deleteOne', () => {
    it('Should return {deleted: true}', async () => {
      expect(service.deleteOne(0)).resolves.toEqual({ deleted: true });
      expect(repo.delete).toBeCalledTimes(1);
      expect(repo.delete).toBeCalledWith({ id: 0 });
    });

    it('Should return {deleted: true, message: err.message', async () => {
      const repoSpy = jest
        .spyOn(repo, 'delete')
        .mockRejectedValueOnce(new Error('Delete Method Error'));
      expect(service.deleteOne(0)).resolves.toEqual({
        deleted: false,
        message: 'Delete Method Error',
      });
      expect(repoSpy).toBeCalledWith({ id: 0 });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
});
