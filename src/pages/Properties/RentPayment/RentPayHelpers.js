export const SERVICE_CHARGE = 1299; 
export const getGst = (charge = SERVICE_CHARGE) => Number((charge * 0.18).toFixed(2));
