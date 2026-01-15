
export const calculateCurrentPrice = (originalPrice: number, createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Le prix diminue de 1/7ème du prix initial par jour.
  // Contrairement à avant, on ne bloque pas à 7 jours, 
  // mais on assure un prix minimum de 1€ pour que l'objet ne devienne pas gratuit.
  const dropAmount = (originalPrice / 7) * diffDays;
  const currentPrice = originalPrice - dropAmount;
  
  return Math.max(currentPrice, 1); // Minimum 1€
};

export const getDayCount = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};
