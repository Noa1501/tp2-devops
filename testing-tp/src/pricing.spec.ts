import { calculateDeliveryFee,applyPromoCode,calculateSurge } from './pricing';

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
  describe('calculateSurge', () => {
	// ── Chaque multiplicateur ──────────────────────────────────
	it('should return 1.0 for tuesday at 15h (normal)', () => {
	  expect(calculateSurge(15, 'tuesday')).toBe(1.0);
	});
  
	it('should return 1.3 for wednesday at 12h30 (lunch)', () => {
	  expect(calculateSurge(12.5, 'wednesday')).toBe(1.3);
	});
  
	it('should return 1.5 for thursday at 20h (dinner)', () => {
	  expect(calculateSurge(20, 'thursday')).toBe(1.5);
	});
  
	it('should return 1.8 for friday at 21h (weekend evening)', () => {
	  expect(calculateSurge(21, 'friday')).toBe(1.8);
	});
  
	it('should return 1.8 for saturday at 20h (weekend evening)', () => {
	  expect(calculateSurge(20, 'saturday')).toBe(1.8);
	});
  
	it('should return 1.2 for sunday at 14h', () => {
	  expect(calculateSurge(14, 'sunday')).toBe(1.2);
	});
  
	// ── Fermé ─────────────────────────────────────────────────
	it('should return 0 before opening at 9h59', () => {
	  expect(calculateSurge(9.59, 'monday')).toBe(0);
	});
  
	it('should return 0 after closing at 22h01', () => {
	  expect(calculateSurge(22.01, 'monday')).toBe(0);
	});
  
	// ── Transitions et limites ─────────────────────────────────
	it('should return 1.0 at exactly 10h (opening)', () => {
	  expect(calculateSurge(10, 'monday')).toBe(1.0);
	});
  
	it('should return 1.3 at exactly 12h (lunch starts)', () => {
	  expect(calculateSurge(12, 'monday')).toBe(1.3);
	});
  
	it('should return 1.0 at exactly 11h30 (still normal)', () => {
	  expect(calculateSurge(11.5, 'monday')).toBe(1.0);
	});
  
	it('should return 1.5 at exactly 19h (dinner starts)', () => {
	  expect(calculateSurge(19, 'monday')).toBe(1.5);
	});
  
	it('should return 0 at exactly 22h (closed)', () => {
	  expect(calculateSurge(22, 'monday')).toBe(0);
	});
  });