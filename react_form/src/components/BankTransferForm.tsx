import { Grid, Typography, TextField } from '@mui/material';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { BankTransferPaymentMethod } from 'types/PaymentMethod';

const schema = z.object({
  bankName: z.string(),
  iban: z
    .string()
    .regex(
      /^(?:(?:IT|SM)\d{2}[A-Z]\d{22}|CY\d{2}[A-Z]\d{23}|NL\d{2}[A-Z]{4}\d{10}|LV\d{2}[A-Z]{4}\d{13}|(?:BG|BH|GB|IE)\d{2}[A-Z]{4}\d{14}|GI\d{2}[A-Z]{4}\d{15}|RO\d{2}[A-Z]{4}\d{16}|KW\d{2}[A-Z]{4}\d{22}|MT\d{2}[A-Z]{4}\d{23}|NO\d{13}|(?:DK|FI|GL|FO)\d{16}|MK\d{17}|(?:AT|EE|KZ|LU|XK)\d{18}|(?:BA|HR|LI|CH|CR)\d{19}|(?:GE|DE|LT|ME|RS)\d{20}|IL\d{21}|(?:AD|CZ|ES|MD|SA)\d{22}|PT\d{23}|(?:BE|IS)\d{24}|(?:FR|MR|MC)\d{25}|(?:AL|DO|LB|PL)\d{26}|(?:AZ|HU)\d{27}|(?:GR|MU)\d{28})$/
    ),
  accountHolderName: z.string(),
});

type BankTransferProps = {
  paymentMethod: BankTransferPaymentMethod;
  updateFields: (fields: { paymentMethod: BankTransferPaymentMethod }) => void;
};

export default function BankTransferForm({
  paymentMethod,
  updateFields,
}: BankTransferProps) {
  const {
    register,
    formState: { errors },
  } = useForm<BankTransferPaymentMethod>({
    resolver: zodResolver(schema),
  });
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          required
          id="bankName"
          label="Bank name"
          fullWidth
          autoComplete="bank name"
          variant="standard"
          value={paymentMethod.bankName}
          {...register('bankName')}
          onChange={(e) =>
            updateFields({
              paymentMethod: { ...paymentMethod, bankName: e.target.value },
            })
          }
        />
        <Typography sx={{ color: 'red' }}>
          {errors.bankName?.message}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          required
          id="iban"
          label="IBAN"
          fullWidth
          autoComplete="iban"
          variant="standard"
          value={paymentMethod.iban}
          {...register('iban')}
          onChange={(e) =>
            updateFields({
              paymentMethod: { ...paymentMethod, iban: e.target.value },
            })
          }
        />
        <Typography sx={{ color: 'red' }}>{errors.iban?.message}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          required
          id="accountHolderName"
          label="Account holder name"
          fullWidth
          autoComplete="account holder name"
          variant="standard"
          value={paymentMethod.accountHolderName}
          {...register('accountHolderName')}
          onChange={(e) =>
            updateFields({
              paymentMethod: {
                ...paymentMethod,
                accountHolderName: e.target.value,
              },
            })
          }
        />
        <Typography sx={{ color: 'red' }}>
          {errors.accountHolderName?.message}
        </Typography>
      </Grid>
    </Grid>
  );
}
