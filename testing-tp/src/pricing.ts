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