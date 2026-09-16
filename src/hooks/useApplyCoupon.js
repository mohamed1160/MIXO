import { useMutation } from '@tanstack/react-query';
import { couponService } from '../services/coupon.service';

export const useApplyCoupon = () => {
  return useMutation({
    mutationFn: (code) => couponService.applyCoupon(code),
  });
};
