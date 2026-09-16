export const applyPagination = (products, page, limit) => {
  const startIndex = (page - 1) * limit;
  return products.slice(startIndex, startIndex + limit);
};
