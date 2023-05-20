import type { FC } from 'react';

// Use this import to load the cart content
import cart from 'assets/cart.json';

// Use this import to load the list of users who can receive a gift from you
import userlist from 'assets/gift_recipients.json';
import Checkout from 'components/Checkout';
import PaymentForm from 'components/PaymentForm';

export type AppProps = {};

export const App: FC<AppProps> = () => {
  return (
    <Checkout />
  );
};
