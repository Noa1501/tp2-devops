import { calculateDeliveryFee } from './pricing';

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