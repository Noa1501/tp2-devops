import {
	Controller,
	Post,
	Get,
	Body,
	Param,
	BadRequestException,
	HttpCode,
  } from '@nestjs/common';
  import { OrdersService } from './orders.service';
  
  @Controller()
  export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}
  
	@Post('orders/simulate')
	@HttpCode(200)
	simulate(@Body() body: any) {
	  const { items, distance, weight, promoCode, hour, dayOfWeek } = body;
	  if (!items || !distance || !hour || !dayOfWeek) {
		throw new BadRequestException('Paramètres manquants');
	  }
	  return this.ordersService.simulate(
		items,
		distance,
		weight ?? 1,
		promoCode ?? null,
		hour,
		dayOfWeek,
	  );
	}
  
	@Post('orders')
	create(@Body() body: any) {
	  const { items, distance, weight, promoCode, hour, dayOfWeek } = body;
	  if (!items || !distance || !hour || !dayOfWeek) {
		throw new BadRequestException('Paramètres manquants');
	  }
	  return this.ordersService.create(
		items,
		distance,
		weight ?? 1,
		promoCode ?? null,
		hour,
		dayOfWeek,
	  );
	}
  
	@Get('orders/:id')
	findOne(@Param('id') id: string) {
	  const numId = parseInt(id, 10);
	  if (isNaN(numId)) throw new BadRequestException('ID invalide');
	  return this.ordersService.findOne(numId);
	}
  
	@Post('promo/validate')
	@HttpCode(200)
	validatePromo(@Body() body: any) {
	  const { code, subtotal } = body;
	  if (!code) throw new BadRequestException('Code promo manquant');
	  if (subtotal === undefined) throw new BadRequestException('Montant manquant');
	  return this.ordersService.validatePromo(code, subtotal);
	}
  }