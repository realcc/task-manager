import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as request from 'supertest';

export class TestUtils {
  app: INestApplication;
  prisma: PrismaService;

  async init() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalPipes(new ValidationPipe());
    this.prisma = this.app.get(PrismaService);
    await this.app.init();
  }

  async cleanup() {
    // Clean up in reverse order of dependencies
    await this.prisma.refreshToken.deleteMany();
    await this.prisma.task.deleteMany();
    await this.prisma.project.deleteMany();
    await this.prisma.user.deleteMany();
  }

  async close() {
    await this.cleanup();
    await this.app.close();
  }

  graphql(query: string, variables?: object, token?: string) {
    const req = request(this.app.getHttpServer())
      .post('/graphql')
      .send({ query, variables });

    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }

    return req;
  }

  async createTestUser(email = 'test@test.com', password = 'password123') {
    const mutation = `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          accessToken
          refreshToken
          user { id email name }
        }
      }
    `;

    const response = await this.graphql(mutation, {
      input: { email, password, name: 'Test User' },
    });

    return response.body.data.register;
  }
}
