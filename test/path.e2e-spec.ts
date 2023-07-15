import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Path } from '../src/path/path.entity';
import { PathModule } from '../src/path/path.module';
import { Repository } from 'typeorm';
import * as request from 'supertest';

describe('Path (e2e)', () => {
  let app: NestApplication;
  let repository: Repository<Path>;
  let http: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PathModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          entities: [Path],
          synchronize: true,
          logging: true,
          url: process.env.DB_URL_TEST,
        }),
      ],
    }).compile();
    app = module.createNestApplication();
    http = request(app.getHttpServer());
    repository = module.get(getRepositoryToken(Path));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  it('Path CRUD', async () => {
    const data = await http.get('/path').expect(200);
    expect(data.body).toEqual([]);

    const path = {
      title: 'Path Test',
      shortDescription: 'Path Test short description',
      description: 'Path Test description',
      distance: 300,
      points: [
        { lat: 20, lng: 10 },
        { lat: 50, lng: 10 },
      ],
    };

    const createdPath = await http.post('/path/new').send(path).expect(201);
    expect(createdPath.body).toEqual({
      ...path,
      inFavorites: false,
      id: expect.any(Number),
    });

    const paths = await http.get('/path').expect(200);
    expect(paths.body).toEqual([
      {
        ...path,
        inFavorites: false,
        id: expect.any(Number),
      },
    ]);

    const pathData = await http
      .get(`/path/id/${createdPath.body.id}`)
      .expect(200);

    expect(pathData.body).toEqual({
      ...path,
      inFavorites: false,
      id: expect.any(Number),
    });

    const updatedPath = await http
      .put(`/path/update`)
      .send({
        id: pathData.body.id,
        inFavorites: true,
        description: 'Updated description',
      })
      .expect(200);

    expect(updatedPath.body).toEqual({
      ...path,
      id: expect.any(Number),
      inFavorites: true,
      description: 'Updated description',
    });

    const deleteData = await http
      .delete(`/path/delete/${pathData.body.id}`)
      .expect(200);

    expect(deleteData.body).toEqual({ deleted: true });

    const pathsAfterDelete = await http.get('/path').expect(200);
    expect(pathsAfterDelete.body).toEqual([]);
  });
});
