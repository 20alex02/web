import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CardForm from './CardForm';
import PaypalForm from './PaypalForm';
import BankTransferForm from './BankTransferForm';
import type {
  BankTransferPaymentMethod,
  CreditCardPaymentMethod,
  PaymentMethod,
  PaypalPaymentMethod,
  PaymentMethodType,
} from 'types/PaymentMethod';

const paymentMethods: PaymentMethodType[] = [
  'Credit Card',
  'Paypal',
  'Bank Transfer',
];

function getPaymentForm(
  data: PaymentMethod,
  updateFields: (fields: { paymentMethod: PaymentMethod }) => void
) {
  switch (data.type) {
    case paymentMethods[0]:
      return (
        <CardForm
          paymentMethod={data as CreditCardPaymentMethod}
          updateFields={updateFields}
        />
      );
    case paymentMethods[1]:
      return (
        <PaypalForm
          paymentMethod={data as PaypalPaymentMethod}
          updateFields={updateFields}
        />
      );
    case paymentMethods[2]:
      return (
        <BankTransferForm
          paymentMethod={data as BankTransferPaymentMethod}
          updateFields={updateFields}
        />
      );
    default:
      throw new Error('Unknown method');
  }
}

type PaymentFormProps = {
  paymentMethod: PaymentMethod;
  updateFields: (fields: { paymentMethod: PaymentMethod }) => void;
};

export default function PaymentForm({
  paymentMethod,
  updateFields,
}: PaymentFormProps) {
  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="demo-simple-select-label">Payment method</InputLabel>
        <Select
          labelId="paymentMethodSelect"
          id="paymentMethodSelect"
          value={paymentMethod.type}
          label="Payment method"
          onChange={(e) =>
            updateFields({
              paymentMethod: { ...paymentMethod, type: e.target.value as PaymentMethodType },
            })
          }
        >
          {paymentMethods.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {getPaymentForm(paymentMethod, updateFields)}
    </>
  );
}
