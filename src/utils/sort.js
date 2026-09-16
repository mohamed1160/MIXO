export const applySort = (products, sort) => {
  if (!products || !Array.isArray(products)) return [];
  const sorted = [...products];

  switch (sort) {
    case "Newest":
    case "newest":
      return sorted.sort((a, b) =>
        a.isNewArrival === b.isNewArrival ? 0 : a.isNewArrival ? -1 : 1,
      );

    case "Highest Rated":
    case "Rating":
    case "rating":
      return sorted.sort(
        (a, b) => Number(b.rating || b.ratings || 0) - Number(a.rating || a.ratings || 0)
      );

    case "Price Low → High":
    case "PriceLowHigh":
    case "price-low":
    case "lowToHigh":
      return sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

    case "Price High → Low":
    case "PriceHighLow":
    case "price-high":
    case "highToLow":
      return sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));

    case "Alphabetical A-Z":
    case "aToZ":
      return sorted.sort((a, b) =>
        (a.title || a.name || "").localeCompare(b.title || b.name || "")
      );

    case "Alphabetical Z-A":
    case "zToA":
      return sorted.sort((a, b) =>
        (b.title || b.name || "").localeCompare(a.title || a.name || "")
      );

    case "Best Selling":
    case "Most Popular":
    case "popular":
    case "Featured":
    default:
      return sorted.sort((a, b) => {
        const revA = Number(a.reviewCount || a.reviewsCount || 0);
        const revB = Number(b.reviewCount || b.reviewsCount || 0);
        if (revA !== revB) return revB - revA;
        const scoreA = (a.isBestSeller ? 2 : 0) + (a.isNewArrival ? 1 : 0);
        const scoreB = (b.isBestSeller ? 2 : 0) + (b.isNewArrival ? 1 : 0);
        return scoreB - scoreA;
      });
  }
};
