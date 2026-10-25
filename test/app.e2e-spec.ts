import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Profile GraphQL API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('profile query returns complete profile with relations', async () => {
    const query = `
      query GetProfile {
        profile {
          name
          bio
          skills {
            name
            category
          }
          experience {
            company
            position
            achievements
          }
          projects {
            name
            repoUrl
            stack
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const body = response.body;
    expect(body.errors).toBeUndefined();
    expect(body.data).toBeDefined();

    const profile = body.data.profile;
    expect(profile.name).toBe('Игорь Дробот');
    expect(profile.bio).toContain('4.5+ годами опыта');

    expect(Array.isArray(profile.skills)).toBe(true);
    expect(profile.skills.length).toBeGreaterThanOrEqual(20);
    expect(profile.skills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Angular (13-22)',
          category: 'Frontend',
        }),
        expect.objectContaining({ name: 'NestJS', category: 'Backend' }),
        expect.objectContaining({ name: 'Docker', category: 'DevOps' }),
      ]),
    );

    expect(Array.isArray(profile.experience)).toBe(true);
    expect(profile.experience).toHaveLength(3);
    expect(profile.experience[0]).toEqual(
      expect.objectContaining({
        company: 'Стартап-студия',
        position: 'Frontend Developer',
      }),
    );
    expect(profile.experience[0].achievements.length).toBeGreaterThan(0);

    expect(Array.isArray(profile.projects)).toBe(true);
    expect(profile.projects).toHaveLength(2);
    expect(profile.projects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Isotope',
          repoUrl: 'https://github.com/IVKLD/Isotope',
          stack: expect.arrayContaining(['Angular', 'Signals']),
        }),
        expect.objectContaining({
          name: 'VortexDL',
          repoUrl: 'https://github.com/IVKLD/VortexDL',
          stack: expect.arrayContaining(['Angular', 'RxAngular']),
        }),
      ]),
    );
  });

  it('profiles query returns an array of profiles with DataLoader batching', async () => {
    const query = `
      query GetAllProfiles {
        profiles {
          id
          name
          skills {
            name
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(Array.isArray(response.body.data.profiles)).toBe(true);
    expect(response.body.data.profiles.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data.profiles[0].skills.length).toBeGreaterThanOrEqual(
      20,
    );
  });

  it('profileById query retrieves profile by ID or returns error/null', async () => {
    const getProfileQuery = `query { profile { id } }`;
    const getRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: getProfileQuery })
      .expect(200);

    const profileId = getRes.body.data.profile.id;

    const byIdQuery = `
      query GetById($id: ID!) {
        profileById(id: $id) {
          id
          name
          title
        }
      }
    `;

    const byIdRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: byIdQuery, variables: { id: profileId } })
      .expect(200);

    expect(byIdRes.body.errors).toBeUndefined();
    expect(byIdRes.body.data.profileById.id).toBe(profileId);
    expect(byIdRes.body.data.profileById.name).toBe('Игорь Дробот');
  });
});
