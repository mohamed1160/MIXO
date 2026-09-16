import { useMutation } from '@tanstack/react-query';
import { shippingService } from '../services/shipping.service';

export const useSaveShipping = () => {
  return useMutation({
    mutationFn: (methodId) => shippingService.saveShippingMethod(methodId),
  });
};
