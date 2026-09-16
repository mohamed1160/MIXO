import { useMutation } from '@tanstack/react-query';
import { checkoutService } from '../services/checkout.service';

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (orderData) => checkoutService.createOrder(orderData),
  });
};
