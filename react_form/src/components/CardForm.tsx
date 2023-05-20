import { Grid, Typography, TextField } from '@mui/material';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreditCardPaymentMethod } from 'types/PaymentMethod';

const schema = z.object({
  cardNumber: z.string().regex(/^[0-9]{12}(?:[0-9]{3})?$/),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/),
  cvv: z.string().regex(/^[0-9]{3,4}$/),
});

type CardFormProps = {
  paymentMethod: CreditCardPaymentMethod;
  updateFields: (fields: { paymentMethod: CreditCardPaymentMethod }) => void;
};

export default function CardForm({
  paymentMethod,
  updateFields,
}: CardFormProps) {
  const {
    register,
    formState: { errors },
  } = useForm<CreditCardPaymentMethod>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          required
          id="cardNumber"
          label="Card number"
          fullWidth
          autoComplete="cc-number"
          variant="standard"
          value={paymentMethod.cardNumber}
          {...register('cardNumber')}
          onChange={(e) =>
            updateFields({
              paymentMethod: { ...paymentMethod, cardNumber: e.target.value },
            })
          }
        />
        <Typography sx={{ color: 'red' }}>
          {errors.cardNumber?.message}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          required
          id="expDate"
          label="Expiry date"
          fullWidth
          autoComplete="cc-exp"
          variant="standard"
          value={paymentMethod.expirationDate}
          {...register('expirationDate')}
          onChange={(e) =>
            updateFields({
              paymentMethod: {
                ...paymentMethod,
                expirationDate: e.target.value,
              },
            })
          }
        />
        <Typography sx={{ color: 'red' }}>
          {errors.expirationDate?.message}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          required
          id="cvv"
          label="CVV"
          helperText="Last three digits on signature strip"
          fullWidth
          autoComplete="cc-csc"
          variant="standard"
          value={paymentMethod.cvv}
          {...register('cvv')}
          onChange={(e) =>
            updateFields({
              paymentMethod: { ...paymentMethod, cvv: e.target.value },
            })
          }
        />
        <Typography sx={{ color: 'red' }}>{errors.cvv?.message}</Typography>
      </Grid>
    </Grid>
  );
}
