import api from '../api/axios';

export const couponService = {
  applyCoupon: async (code) => {
    const response = await api.post('/coupons/apply', { code });
    return response.data;
  },
};
