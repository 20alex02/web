import { Grid, Typography, TextField } from '@mui/material';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { BillingInfoData } from 'types/OrderFormData';

const schema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .regex(/^(\+\d{1,3}\s?)?(\(\d{1,3}\)\s?)?[\d\s-]{6,}$/i),
  billingAddress: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
});

type AddressFormProps = BillingInfoData & {
  updateFields: (fields: Partial<BillingInfoData>) => void;
};

export default function AddressForm({
  name,
  surname,
  email,
  phoneNumber,
  billingAddress,
  updateFields,
}: AddressFormProps) {
  const {
    register,
    formState: { errors },
  } = useForm<BillingInfoData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="name"
          label="Name"
          fullWidth
          autoComplete="name"
          variant="standard"
          value={name}
          {...register('name')}
          onChange={(e) => updateFields({ name: e.target.value })}
        />
        <Typography sx={{color: 'red'}}>{errors.name?.message}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="surname"
          label="Surname"
          fullWidth
          autoComplete="surname"
          variant="standard"
          value={surname}
          {...register('surname')}
          onChange={(e) => updateFields({ surname: e.target.value })}
        />
        <Typography sx={{color: 'red'}}>{errors.surname?.message}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="email"
          label="Email"
          fullWidth
          autoComplete="email"
          variant="standard"
          type="email"
          value={email}
          {...register('email')}
          onChange={(e) => updateFields({ email: e.target.value })}
        />
        <Typography sx={{color: 'red'}}>{errors.email?.message}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="phoneNumber"
          label="Phone number"
          fullWidth
          autoComplete="phone number"
          variant="standard"
          value={phoneNumber}
          {...register('phoneNumber')}
          onChange={(e) => updateFields({ phoneNumber: e.target.value })}
        />
        <Typography sx={{color: 'red'}}>{errors.phoneNumber?.message}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="address"
          label="Address"
          fullWidth
          autoComplete="address"
          variant="standard"
          value={billingAddress.address}
          {...register('billingAddress.address')}
          onChange={(e) =>
            updateFields({
              billingAddress: { ...billingAddress, address: e.target.value },
            })
          }
        />
        <Typography sx={{color: 'red'}}>{errors.billingAddress?.address?.message}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="city"
          label="City"
          fullWidth
          autoComplete="city"
          variant="standard"
          value={billingAddress.city}
          {...register('billingAddress.city')}
          onChange={(e) =>
            updateFields({
              billingAddress: { ...billingAddress, city: e.target.value },
            })
          }
        />
        <Typography sx={{color: 'red'}}>{errors.billingAddress?.city?.message}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="state"
          label="State/Province/Region"
          fullWidth
          variant="standard"
          value={billingAddress.stateOrProvince}
          {...register('billingAddress.stateOrProvince')}
          onChange={(e) =>
            updateFields({
              billingAddress: {
                ...billingAddress,
                stateOrProvince: e.target.value,
              },
            })
          }
        />
        <Typography>
          {errors.billingAddress?.stateOrProvince?.message}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="zip"
          label="Zip / Postal code"
          fullWidth
          autoComplete="postal code"
          variant="standard"
          value={billingAddress.zipCode}
          {...register('billingAddress.zipCode')}
          onChange={(e) =>
            updateFields({
              billingAddress: { ...billingAddress, zipCode: e.target.value },
            })
          }
        />
        <Typography sx={{color: 'red'}}>{errors.billingAddress?.zipCode?.message}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="country"
          label="Country"
          fullWidth
          autoComplete="country"
          variant="standard"
          value={billingAddress.country}
          {...register('billingAddress.country')}
          onChange={(e) =>
            updateFields({
              billingAddress: { ...billingAddress, country: e.target.value },
            })
          }
        />
        <Typography sx={{color: 'red'}}>{errors.billingAddress?.country?.message}</Typography>
      </Grid>
    </Grid>
  );
}
