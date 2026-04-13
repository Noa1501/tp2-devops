import { PromoCode } from '../pricing';

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'BIENVENUE20',
    type: 'percentage',
    value: 20,
    minOrder: 15.00,
    expiresAt: '2099-12-31',
  },
  {
    code: 'REMISE5',
    type: 'fixed',
    value: 5,
    minOrder: 10.00,
    expiresAt: '2099-12-31',
  },
  {
    code: 'EXPIRE',
    type: 'percentage',
    value: 10,
    minOrder: 0,
    expiresAt: '2000-01-01',
  },
];