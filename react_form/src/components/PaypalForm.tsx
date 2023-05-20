import { Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PaypalPaymentMethod } from 'types/PaymentMethod';

const schema = z.object({
  username: z.string(),
});

type PaypalFormProps = {
  paymentMethod: PaypalPaymentMethod;
  updateFields: (fields: { paymentMethod: PaypalPaymentMethod }) => void;
};

export default function PaypalForm({
  paymentMethod,
  updateFields,
}: PaypalFormProps) {
  const {
    register,
    formState: { errors },
  } = useForm<PaypalPaymentMethod>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          required
          id="username"
          label="Username"
          fullWidth
          autoComplete="username"
          variant="standard"
          value={paymentMethod.username}
          {...register('username')}
          onChange={(e) =>
            updateFields({
              paymentMethod: { ...paymentMethod, username: e.target.value },
            })
          }
        />
        <Typography sx={{ color: 'red' }}>
          {errors.username?.message}
        </Typography>
      </Grid>
    </Grid>
  );
}
