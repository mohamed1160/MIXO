import { useQuery } from '@tanstack/react-query';
import { shippingService } from '../services/shipping.service';

export const useShippingMethods = () => {
  return useQuery({
    queryKey: ['shippingMethods'],
    queryFn: shippingService.getShippingMethods,
  });
};
