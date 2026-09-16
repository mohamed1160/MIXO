export const calculateTotals = (cart, shippingCost = 0, discount = 0) => {
  const subtotal = (cart || []).reduce((total, item) => total + ((item?.price || 0) * (item?.quantity || 1)), 0);
  const total = Math.max(0, subtotal + shippingCost - discount);
  return { subtotal, tax: 0, total };
};
