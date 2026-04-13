import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  calculateOrderTotal,
  OrderItem,
  OrderTotal,
  applyPromoCode,
} from '../pricing';
import { PROMO_CODES } from './promo-codes.data';

export interface Order extends OrderTotal {
  id: number;
  items: OrderItem[];
  createdAt: string;
}

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private nextId = 1;

  resetData(): void {
    this.orders = [];
    this.nextId = 1;
  }

  simulate(
    items: OrderItem[],
    distance: number,
    weight: number,
    promoCode: string | null,
    hour: number,
    dayOfWeek: string,
  ): OrderTotal {
    try {
      return calculateOrderTotal(
        items,
        distance,
        weight,
        promoCode,
        hour,
        dayOfWeek as any,
        PROMO_CODES,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  create(
    items: OrderItem[],
    distance: number,
    weight: number,
    promoCode: string | null,
    hour: number,
    dayOfWeek: string,
  ): Order {
    const total = this.simulate(items, distance, weight, promoCode, hour, dayOfWeek);
    const order: Order = {
      id: this.nextId++,
      items,
      createdAt: new Date().toISOString(),
      ...total,
    };
    this.orders.push(order);
    return order;
  }

  findOne(id: number): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) throw new NotFoundException(`Commande ${id} introuvable`);
    return order;
  }

  validatePromo(code: string, subtotal: number) {
    try {
      return applyPromoCode(subtotal, code, PROMO_CODES);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}