'use client';

import useCartService from '@/lib/hooks/useCartStore';
import { OrderItem } from '@/lib/models/OrderModel';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AddToCart({ item }: { item: OrderItem }) {
  const router = useRouter();
  const { items, increase, decrease } = useCartService();
  const [isAdded, setIsAdded] = useState<OrderItem | undefined>();

  useEffect(() => {
    setIsAdded(items.find((x) => x.slug === item.slug));
  }, [item, items]);

  const AddToCartHandler = () => {
    increase(item);
  };

  return isAdded ? (
    <div>
      <button className="btn" type="button" onClick={() => decrease(isAdded)}>
        -
      </button>
      <span className="px-2">{isAdded.qty}</span>
      <button className="btn" type="button" onClick={() => increase(isAdded)}>
        +
      </button>
    </div>
  ) : (
    <button
      className="btn btn-primary bg-orange-light hover:bg-orange-dark border-none text-white w-full"
      type="button"
      onClick={AddToCartHandler}
    >
      Add to Cart
    </button>
  );
}
