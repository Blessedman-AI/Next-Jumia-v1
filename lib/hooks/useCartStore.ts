import { create } from 'zustand';
import { round2 } from '../utils';
import { OrderItem, ShippingAddress } from '../models/OrderModel';
import { persist } from 'zustand/middleware';

type Cart = {
  items: OrderItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;

  paymentMethod: string;
  shippingAddress: ShippingAddress;
};
const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,

  paymentMethod: 'PayPal',
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
};

//CREATE AND PERSIST CART - 01:07
export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: 'cartStore',
  })
);

export default function useCartService() {
  const {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
  } = cartStore();

  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
    increase: (item: OrderItem) => {
      const exists = items.find((x) => x.slug === item.slug);
      const updatedCartItems = exists
        ? items.map((x) =>
            x.slug === item.slug ? { ...exists, qty: exists.qty + 1 } : x
          )
        : [...items, { ...item, qty: 1 }];
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(updatedCartItems);

      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
    },

    decrease: (item: OrderItem) => {
      const exists = items.find((x) => x.slug === item.slug);

      if (!exists) return;

      const updatedCartItems = items.map((x) => {
        // Check if the current item is the one we want to decrease
        if (x.slug === item.slug) {
          // Reduce quantity only for this item
          return { ...x, qty: x.qty - 1 };
        } else {
          // Keep other items unchanged
          return x;
        }
      });

      // Filter out items with quantity less than 1 (remove from cart)
      const filteredCartItems = updatedCartItems.filter((x) => x.qty > 0);

      // Calculate prices based on the updated cart
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(filteredCartItems);

      // Update cart state with new items and prices
      cartStore.setState({
        items: filteredCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
    },

    saveShippingAddrress: (shippingAddress: ShippingAddress) => {
      cartStore.setState({
        shippingAddress,
      });
    },

    savePaymentMethod: (paymentMethod: string) => {
      cartStore.setState({
        paymentMethod,
      });
    },
    clear: () => {
      cartStore.setState({
        items: [],
      });
    },
    init: () => cartStore.setState(initialState),
  };
}

const calcPrice = (items: OrderItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
  const taxPrice = round2(Number(0.15 * itemsPrice));
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
