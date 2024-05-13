import { Metadata } from 'next';
import Form from './Form';

//02:54:00
export const metadata: Metadata = {
  title: 'Place Order',
};

export default async function PlaceOrderPage() {
  return <Form />;
}
