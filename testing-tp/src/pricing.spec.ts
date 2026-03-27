import { calculateDeliveryFee,applyPromoCode } from './pricing';

describe('calculateDeliveryFee', () => {
  // ── Cas normaux ────────────────────────────────────────────
  it('should return 2.00 for 2km and 1kg', () => {
    expect(calculateDeliveryFee(2, 1)).toBe(2.00);
  });

  it('should return 2.00 for exactly 3km (included in base)', () => {
    expect(calculateDeliveryFee(3, 1)).toBe(2.00);
  });

  it('should return 3.50 for 6km and 2kg', () => {
    // 2.00 + (3 * 0.50) = 3.50
    expect(calculateDeliveryFee(6, 2)).toBe(3.50);
  });

  it('should return 5.50 for 10km and 2kg', () => {
    // 2.00 + (7 * 0.50) = 5.50
    expect(calculateDeliveryFee(10, 2)).toBe(5.50);
  });

  // ── Supplément poids ───────────────────────────────────────
  it('should not add surcharge for exactly 5kg', () => {
    expect(calculateDeliveryFee(2, 5)).toBe(2.00);
  });

  it('should add 1.50 surcharge for weight above 5kg', () => {
    // 2.00 + 1.50 = 3.50
    expect(calculateDeliveryFee(2, 8)).toBe(3.50);
  });

  it('should return 7.00 for 10km and 6kg', () => {
    // 2.00 + (7 * 0.50) + 1.50 = 7.00
    expect(calculateDeliveryFee(10, 6)).toBe(7.00);
  });

  it('should return 2.00 for distance 0 and 1kg', () => {
    expect(calculateDeliveryFee(0, 1)).toBe(2.00);
  });

  // ── Cas d'erreur ───────────────────────────────────────────
  it('should return null for distance above 10km', () => {
    expect(calculateDeliveryFee(15, 1)).toBeNull();
  });

  it('should throw for negative distance', () => {
    expect(() => calculateDeliveryFee(-1, 1)).toThrow();
  });

  it('should throw for negative weight', () => {
    expect(() => calculateDeliveryFee(2, -1)).toThrow();
  });
});
const promoCodes = [
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
	{
	  code: 'BIGDISCOUNT',
	  type: 'fixed',
	  value: 10,
	  minOrder: 0,
	  expiresAt: '2099-12-31',
	},
	{
	  code: 'TOTAL100',
	  type: 'percentage',
	  value: 100,
	  minOrder: 0,
	  expiresAt: '2099-12-31',
	},
  ];
  
  describe('applyPromoCode', () => {
	// ── Cas normaux ────────────────────────────────────────────
	it('should apply 20% discount on 50€', () => {
	  const result = applyPromoCode(50, 'BIENVENUE20', promoCodes);
	  expect(result.total).toBe(40);
	  expect(result.discount).toBe(10);
	});
  
	it('should apply fixed 5€ discount on 30€', () => {
	  const result = applyPromoCode(30, 'REMISE5', promoCodes);
	  expect(result.total).toBe(25);
	  expect(result.discount).toBe(5);
	});
  
	it('should accept code when minOrder is exactly met', () => {
	  const result = applyPromoCode(15, 'BIENVENUE20', promoCodes);
	  expect(result.total).toBe(12);
	});
  
	// ── Refus du code ──────────────────────────────────────────
	it('should throw when promo code is expired', () => {
	  expect(() => applyPromoCode(50, 'EXPIRE', promoCodes)).toThrow(
		'Code promo expiré',
	  );
	});
  
	it('should throw when order is below minOrder', () => {
	  expect(() => applyPromoCode(10, 'BIENVENUE20', promoCodes)).toThrow(
		'Commande minimum non atteinte',
	  );
	});
  
	it('should throw when promo code is unknown', () => {
	  expect(() => applyPromoCode(50, 'INCONNU', promoCodes)).toThrow(
		'Code promo inconnu',
	  );
	});
  
	// ── Cas limites ────────────────────────────────────────────
	it('should return 0 when fixed discount exceeds subtotal', () => {
	  // 10€ de réduction sur 5€ → ne peut pas être négatif
	  const result = applyPromoCode(5, 'BIGDISCOUNT', promoCodes);
	  expect(result.total).toBe(0);
	});
  
	it('should return 0 when percentage is 100%', () => {
	  const result = applyPromoCode(50, 'TOTAL100', promoCodes);
	  expect(result.total).toBe(0);
	});
  
	it('should return subtotal unchanged when promoCode is null', () => {
	  const result = applyPromoCode(50, null, promoCodes);
	  expect(result.total).toBe(50);
	  expect(result.discount).toBe(0);
	});
  
	it('should throw when subtotal is negative', () => {
	  expect(() => applyPromoCode(-10, 'BIENVENUE20', promoCodes)).toThrow(
		'Sous-total invalide',
	  );
	});
  });