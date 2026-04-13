export function calculateDeliveryFee(
	distance: number,
	weight: number,
  ): number | null {
	if (distance < 0) throw new Error('Distance invalide');
	if (weight < 0) throw new Error('Poids invalide');
	if (distance > 10) return null;
  
	let fee = 2.00;
  
	if (distance > 3) {
	  fee += (distance - 3) * 0.50;
	}
  
	if (weight > 5) {
	  fee += 1.50;
	}
  
	return Math.round(fee * 100) / 100;
}
  export interface PromoCode {
	code: string;
	type: 'percentage' | 'fixed';
	value: number;
	minOrder: number;
	expiresAt: string;
  }
  
  export interface PromoResult {
	total: number;
	discount: number;
  }
  
export function applyPromoCode(
	subtotal: number,
	promoCode: string | null,
	promoCodes: PromoCode[],
  ): PromoResult {
	// Sous-total invalide
	if (subtotal < 0) throw new Error('Sous-total invalide');
  
	// Pas de code promo → pas de réduction
	if (!promoCode) return { total: subtotal, discount: 0 };
  
	// Cherche le code dans la liste
	const promo = promoCodes.find((p) => p.code === promoCode);
	if (!promo) throw new Error('Code promo inconnu');
  
	// Vérifie l'expiration
	const today = new Date().toISOString().split('T')[0];
	if (promo.expiresAt < today) throw new Error('Code promo expiré');
  
	// Vérifie le montant minimum
	if (subtotal < promo.minOrder) throw new Error('Commande minimum non atteinte');
  
	// Calcule la réduction
	let discount = 0;
	if (promo.type === 'percentage') {
	  discount = Math.round((subtotal * promo.value) / 100 * 100) / 100;
	} else if (promo.type === 'fixed') {
	  discount = promo.value;
	}
  
	// Le total ne peut pas être négatif
	const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
  
	return { total, discount };
}
type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export function calculateSurge(hour: number, dayOfWeek: DayOfWeek): number {
  // Fermé avant 10h et à partir de 22h
  if (hour < 10 || hour >= 22) return 0;

  // Dimanche → multiplicateur fixe toute la journée
  if (dayOfWeek === 'sunday') return 1.2;

  // Vendredi et samedi soir 19h-22h
  if (
    (dayOfWeek === 'friday' || dayOfWeek === 'saturday') &&
    hour >= 19
  ) {
    return 1.8;
  }

  // Lundi-Jeudi
  if (['monday', 'tuesday', 'wednesday', 'thursday'].includes(dayOfWeek)) {
    // Déjeuner 12h-13h30
    if (hour >= 12 && hour < 13.5) return 1.3;

    // Dîner 19h-21h
    if (hour >= 19 && hour < 21) return 1.5;
  }

  // Toutes les autres heures ouvertes → normal
  return 1.0;
}