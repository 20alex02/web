import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import {
  CssBaseline,
  AppBar,
  Box,
  Container,
  Toolbar,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import GiftTo from './GiftTo';
import cart from '../assets/cart.json';
import giftRecipients from '../assets/gift_recipients.json';
import type { OrderFormData } from 'types/OrderFormData';

const steps = [
  'Order summary',
  'Gift to',
  'Payment details',
  'Shipping address',
];

function getStepContent(
  step: number,
  data: OrderFormData,
  updateFields: (fields: Partial<OrderFormData>) => void
) {
  switch (step) {
    case 0:
      return <OrderSummary {...data} updateFields={updateFields} />;
    case 1:
      return (
        <GiftTo
          {...data}
          recipients={giftRecipients}
          updateFields={updateFields}
        />
      );
    case 2:
      return <PaymentForm {...data} updateFields={updateFields} />;
    case 3:
      return <AddressForm {...data} updateFields={updateFields} />;
    default:
      throw new Error('Unknown step');
  }
}

const theme = createTheme();

const initialData: OrderFormData = {
  products: cart,
  giftRecipient: undefined,
  paymentMethod: {
    type: 'Credit Card',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  },
  name: '',
  surname: '',
  email: '',
  phoneNumber: '',
  billingAddress: {
    address: '',
    city: '',
    stateOrProvince: '',
    country: '',
    zipCode: '',
  },
};

export default function Checkout() {
  const [state, setState] = useState({ step: 0, isGift: false });
  const [data, setData] = useState(initialData);
  function updateFields(fields: Partial<OrderFormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }
  const { handleSubmit } = useForm<OrderFormData>();

  const handleNext = () => {
    if (state.step === 0) {
      setState({ step: state.step + 2, isGift: false });
    } else {
      setState({ ...state, step: state.step + 1 });
    }
    // console.log(data)
  };

  const handleBack = () => {
    if (state.step === 2 && !state.isGift) {
      setState({ ...state, step: state.step - 2 });
    } else {
      setState({ ...state, step: state.step - 1 });
    }
  };

  const handleGift = () => {
    setState({ step: state.step + 1, isGift: true });
  };

  const getButtonText = (step: number) => {
    switch (step) {
      case 0:
        return 'Purchase';
      case steps.length - 1:
        return 'Place order';
      default:
        return 'Next';
    }
  };

  const onSubmit: SubmitHandler<OrderFormData> = () => {
    handleNext();
    if (state.step === steps.length - 1) {
      if (!state.isGift) {
        data.giftRecipient = undefined;
      }
      console.log(data);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            PB138 Iteration 08
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={state.step} sx={{ pt: 3, pb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {state.step === steps.length ? (
            <Container
              sx={{ display: 'flex', justifyContent: 'center', my: 10 }}
            >
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
            </Container>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {getStepContent(state.step, data, updateFields)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {state.step !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                {state.step === 0 && (
                  <Button
                    variant="contained"
                    onClick={handleGift}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    Gift to
                  </Button>
                )}
                <Button
                  variant="contained"
                  // onClick={
                  //   state.step === steps.length - 1 ? undefined : handleNext
                  // }
                  type="submit"
                  sx={{ mt: 3, ml: 1 }}
                >
                  {getButtonText(state.step)}
                </Button>
              </Box>
            </form>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
