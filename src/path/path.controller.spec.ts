import { Test, TestingModule } from '@nestjs/testing';
import { PathController } from './path.controller';
import { PathService } from './path.service';
import { CreatePathDTO } from './dto/create-path.dto';
import { UpdatePathDTO } from './dto/update-path.dto';

describe('Path Controller', () => {
  let controller: PathController;
  let service: PathService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PathController],
      providers: [
        {
          provide: PathService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              {
                id: 0,
                title: 'Path1',
                description: 'Description path1',
                shortDescription: 'Short description path',
                distance: 200,
                points: [
                  { lat: 10, lng: 20 },
                  { lat: 30, lng: 10 },
                ],
              },
              {
                id: 1,
                title: 'Path2',
                description: 'Description path2',
                shortDescription: 'Short description path2',
                distance: 400,
                points: [
                  { lat: 30, lng: 20 },
                  { lat: 20, lng: 10 },
                ],
              },
            ]),
            getOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                id,
                title: 'Path title',
                description: 'Path description',
                shortDescription: 'Path short description',
                distance: 500,
                points: [
                  { lat: 30, lng: 40 },
                  { lat: 50, lng: 10 },
                ],
              }),
            ),
            insertOne: jest.fn().mockImplementation((dto: CreatePathDTO) =>
              Promise.resolve({
                id: 3,
                inFavorites: false,
                ...dto,
              }),
            ),
            updateOne: jest.fn().mockImplementation((dto: UpdatePathDTO) =>
              Promise.resolve({
                title: 'Title Path',
                description: 'Description path',
                shortDescription: 'Short path description',
                inFavorites: false,
                points: [
                  { lat: 30, lng: 10 },
                  { lat: 40, lng: 10 },
                ],
                distance: 300,
                ...dto,
              }),
            ),
            deleteOne: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get(PathController);
    service = module.get(PathService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPaths', () => {
    it('Should return an array of paths', async () => {
      await expect(controller.getPaths()).resolves.toEqual([
        {
          id: 0,
          title: 'Path1',
          description: 'Description path1',
          shortDescription: 'Short description path',
          distance: 200,
          points: [
            { lat: 10, lng: 20 },
            { lat: 30, lng: 10 },
          ],
        },
        {
          id: 1,
          title: 'Path2',
          description: 'Description path2',
          shortDescription: 'Short description path2',
          distance: 400,
          points: [
            { lat: 30, lng: 20 },
            { lat: 20, lng: 10 },
          ],
        },
      ]);
    });
  });

  describe('getOnePath', () => {
    it('Should get a single path with the same id', async () => {
      await expect(controller.getOnePath(10)).resolves.toEqual({
        id: 10,
        title: 'Path title',
        description: 'Path description',
        shortDescription: 'Path short description',
        distance: 500,
        points: [
          { lat: 30, lng: 40 },
          { lat: 50, lng: 10 },
        ],
      });
      await expect(controller.getOnePath(20)).resolves.toEqual({
        id: 20,
        title: 'Path title',
        description: 'Path description',
        shortDescription: 'Path short description',
        distance: 500,
        points: [
          { lat: 30, lng: 40 },
          { lat: 50, lng: 10 },
        ],
      });
    });
  });

  describe('newPath', () => {
    it('Should create a new path', async () => {
      const dto: CreatePathDTO = {
        title: 'Path crated',
        description: 'Path description created',
        shortDescription: 'Path short description created',
        distance: 500,
        points: [
          { lat: 30, lng: 40 },
          { lat: 50, lng: 10 },
        ],
      };

      await expect(controller.newPath(dto)).resolves.toEqual({
        id: 3,
        inFavorites: false,
        ...dto,
      });
    });
  });

  describe('updatePath', () => {
    it('Should update a path ', async () => {
      const dto: UpdatePathDTO = {
        id: 15,
        distance: 900,
        inFavorites: true,
        description: 'Updated description',
      };

      await expect(controller.updatePath(dto)).resolves.toEqual({
        title: 'Title Path',
        shortDescription: 'Short path description',
        points: [
          { lat: 30, lng: 10 },
          { lat: 40, lng: 10 },
        ],
        ...dto,
      });
    });
  });

  describe('deletePath', () => {
    const idThatExists = 3;
    const idThatDoesNotExist = 5;

    it('Should return that it deleted a path', async () => {
      await expect(controller.deletePath(idThatExists)).resolves.toEqual({
        deleted: true,
      });
    });

    it('Should return that it did not delete a path', async () => {
      const deleteSpy = jest
        .spyOn(service, 'deleteOne')
        .mockResolvedValueOnce({ deleted: false });

      await expect(controller.deletePath(idThatDoesNotExist)).resolves.toEqual({
        deleted: false,
      });
      expect(deleteSpy).toBeCalledWith(idThatDoesNotExist);
    });
  });
});
