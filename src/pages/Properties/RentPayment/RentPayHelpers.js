export const getGst = (charge) => {
  if (!charge || charge <= 0) return 0;
  return Number((charge * 0.18).toFixed(2));
};