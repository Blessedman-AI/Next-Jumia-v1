'use client';

import useCartService from '@/lib/hooks/useCartStore';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartDetails() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, itemsPrice, decrease, increase } = useCartService();

  const handleCheckoutClick = async () => {
    console.log(session);
    if (session) {
      // User is logged in, navigate to shipping page
      router.push('/shipping');
    } else {
      // User is not logged in, redirect to sign-in
      router.push(
        `/signin?callbackUrl=${process.env.NEXT_PUBLIC_BASE_URL}/shipping`
      );
      // router.push(
      //   `/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fshipping`
      // );
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;

  return (
    <>
      <h1 className="py-4 text-2xl">Shopping Cart</h1>

      {items.length === 0 ? (
        <div>
          Cart is empty <Link href="/">Back to Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-4 ">
          <div className="overflow-x-auto md:col-span-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        ></Image>
                        <span className="px-2 text-white">{item.name}</span>
                      </Link>
                    </td>

                    <td>
                      <button
                        className="btn"
                        type="button"
                        onClick={() => decrease(item)}
                      >
                        -
                      </button>
                      <span className="px-2 text-white">{item.qty}</span>
                      <button
                        className="btn"
                        type="button"
                        onClick={() => increase(item)}
                      >
                        +
                      </button>
                    </td>
                    <td className="text-white">₦{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card bg-base-300">
            <div className="card-body">
              <ul>
                <li>
                  <div className="pb-3 text-xl">
                    Subtotal ({items.reduce((a, c) => a + c.qty, 0)}) : $
                    {itemsPrice}
                  </div>
                </li>
                <li>
                  <button
                    // onClick={() => router.push('/shipping')}
                    onClick={handleCheckoutClick}
                    className="btn btn-primary p-0 bg-orange-light hover:bg-orange-dark border-none text-white w-full"
                  >
                    Proceed to Checkout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
