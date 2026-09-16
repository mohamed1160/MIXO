export const formatCurrency = (amount, currency = 'EGP') => {
  if (typeof amount !== 'number' || isNaN(amount)) return `${currency} 0`;
  const formatted = new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  
  // Clean up format to match design (e.g. EGP 799)
  return formatted.replace(/^EGP\s*/, 'EGP ').replace(/\.00$/, '');
};
