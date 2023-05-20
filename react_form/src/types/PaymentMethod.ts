export type PaymentMethodType = 'Credit Card' | 'Bank Transfer' | 'Paypal';

export type CreditCardPaymentMethod = {
  type: PaymentMethodType;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
};

export type BankTransferPaymentMethod = {
  type: PaymentMethodType;
  bankName: string;
  iban: string;
  accountHolderName: string;
};

export type PaypalPaymentMethod = {
  type: PaymentMethodType;
  username: string;
};

export type PaymentMethod =
  | CreditCardPaymentMethod
  | BankTransferPaymentMethod
  | PaypalPaymentMethod;
