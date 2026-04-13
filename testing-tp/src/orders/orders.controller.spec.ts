import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { OrdersService } from './orders.service';

describe('Orders API (integration)', () => {
  let app: INestApplication;
  let ordersService: OrdersService;

  const validOrder = {
    items: [{ name: 'Pizza', price: 12.50, quantity: 2 }],
    distance: 5,
    weight: 2,
    hour: 15,
    dayOfWeek: 'tuesday',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    ordersService = moduleFixture.get<OrdersService>(OrdersService);
  });

  beforeEach(() => {
    ordersService.resetData();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /orders/simulate', () => {
    it('should return 200 with correct price detail', () => {
      return request(app.getHttpServer())
        .post('/orders/simulate')
        .send(validOrder)
        .expect(200)
        .expect((res) => {
          expect(res.body.subtotal).toBe(25);
          expect(res.body.deliveryFee).toBe(3.00);
          expect(res.body.surge).toBe(1.0);
          expect(res.body.total).toBe(28.00);
        });
    });

    it('should apply valid promo code', () => {
      return request(app.getHttpServer())
        .post('/orders/simulate')
        .send({ ...validOrder, promoCode: 'BIENVENUE20' })
        .expect(200)
        .expect((res) => {
          expect(res.body.discount).toBe(5);
          expect(res.body.total).toBe(23.00);
        });
    });

    it('should return 400 for expired promo code', () => {
      return request(app.getHttpServer())
        .post('/orders/simulate')
        .send({ ...validOrder, promoCode: 'EXPIRE' })
        .expect(400);
    });

    it('should return 400 for empty items', () => {
      return request(app.getHttpServer())
        .post('/orders/simulate')
        .send({ ...validOrder, items: [] })
        .expect(400);
    });

    it('should return 400 for distance above 10km', () => {
      return request(app.getHttpServer())
        .post('/orders/simulate')
        .send({ ...validOrder, distance: 15 })
        .expect(400);
    });

    it('should return 400 when restaurant is closed at 23h', () => {
      return request(app.getHttpServer())
        .post('/orders/simulate')
        .send({ ...validOrder, hour: 23 })
        .expect(400);
    });

    it('should apply surge on friday at 20h', () => {
      return request(app.getHttpServer())
        .post('/orders/simulate')
        .send({ ...validOrder, hour: 20, dayOfWeek: 'friday' })
        .expect(200)
        .expect((res) => {
          expect(res.body.surge).toBe(1.8);
          expect(res.body.deliveryFee).toBe(5.40);
        });
    });
  });

  describe('POST /orders', () => {
    it('should return 201 with order and unique ID', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send(validOrder)
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.id).toBe(1);
          expect(res.body.total).toBeDefined();
        });
    });

    it('should be retrievable via GET /orders/:id', async () => {
      const postRes = await request(app.getHttpServer())
        .post('/orders')
        .send(validOrder)
        .expect(201);

      const id = postRes.body.id;

      return request(app.getHttpServer())
        .get(`/orders/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(id);
        });
    });

    it('should generate different IDs for two orders', async () => {
      const res1 = await request(app.getHttpServer())
        .post('/orders')
        .send(validOrder)
        .expect(201);

      const res2 = await request(app.getHttpServer())
        .post('/orders')
        .send(validOrder)
        .expect(201);

      expect(res1.body.id).not.toBe(res2.body.id);
    });

    it('should return 400 for invalid order', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({ ...validOrder, distance: 15 })
        .expect(400);
    });

    it('should not save invalid order', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({ ...validOrder, distance: 15 })
        .expect(400);

      return request(app.getHttpServer())
        .get('/orders/1')
        .expect(404);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return 200 with complete order', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send(validOrder)
        .expect(201);

      return request(app.getHttpServer())
        .get('/orders/1')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(1);
          expect(res.body.items).toBeDefined();
          expect(res.body.total).toBeDefined();
          expect(res.body.createdAt).toBeDefined();
        });
    });

    it('should return 404 for unknown ID', () => {
      return request(app.getHttpServer())
        .get('/orders/999')
        .expect(404);
    });

    it('should return correct structure', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send(validOrder)
        .expect(201);

      return request(app.getHttpServer())
        .get('/orders/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('items');
          expect(res.body).toHaveProperty('subtotal');
          expect(res.body).toHaveProperty('discount');
          expect(res.body).toHaveProperty('deliveryFee');
          expect(res.body).toHaveProperty('surge');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('createdAt');
        });
    });
  });

  describe('POST /promo/validate', () => {
    it('should return 200 with discount details for valid code', () => {
      return request(app.getHttpServer())
        .post('/promo/validate')
        .send({ code: 'BIENVENUE20', subtotal: 50 })
        .expect(200)
        .expect((res) => {
          expect(res.body.total).toBe(40);
          expect(res.body.discount).toBe(10);
        });
    });

    it('should return 400 for expired code', () => {
      return request(app.getHttpServer())
        .post('/promo/validate')
        .send({ code: 'EXPIRE', subtotal: 50 })
        .expect(400);
    });

    it('should return 400 when order is below minimum', () => {
      return request(app.getHttpServer())
        .post('/promo/validate')
        .send({ code: 'BIENVENUE20', subtotal: 5 })
        .expect(400);
    });

    it('should return 400 for unknown code', () => {
      return request(app.getHttpServer())
        .post('/promo/validate')
        .send({ code: 'INCONNU', subtotal: 50 })
        .expect(400);
    });

    it('should return 400 when code is missing', () => {
      return request(app.getHttpServer())
        .post('/promo/validate')
        .send({ subtotal: 50 })
        .expect(400);
    });
	it('should return 400 when required fields are missing', () => {
		return request(app.getHttpServer())
		.post('/orders/simulate')
		.send({ items: [] })   
		.expect(400);
	});
	
	it('should return 400 when required fields are missing', () => {
		return request(app.getHttpServer())
		.post('/orders')
		.send({ items: [] })   
		.expect(400);
	});
  });
});