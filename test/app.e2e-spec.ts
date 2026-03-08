import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) should render home page', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('Ana Sayfa');
        expect(res.text).toContain('Hesap Makinesi');
      });
  });

  it('/hesapla (GET) should return calculator result', () => {
    return request(app.getHttpServer())
      .get('/hesapla?sayi1=5&sayi2=3&islem=topla')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('Hesaplama sonucu: 8');
      });
  });

  it('/kelimeler (POST) should print uploaded words', () => {
    return request(app.getHttpServer())
      .post('/kelimeler')
      .attach('textDosyasi', Buffer.from('Merhaba dunya nest js'), 'ornek.txt')
      .expect(201)
      .expect((res) => {
        expect(res.text).toContain('Merhaba, dunya, nest, js');
      });
  });
});
