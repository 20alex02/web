import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Container,
  Button,
  ListItemText,
} from '@mui/material';
import type { CartItem } from 'types/CartItem';

type OrderSummaryProps = {
  products: CartItem[];
  updateFields: (fields: { products: CartItem[] }) => void;
};

const OrderSummary = ({ products, updateFields }: OrderSummaryProps) => {
  const removeItem = (index: number) => {
    const updatedItems = [...products];
    updatedItems.splice(index, 1);
    updateFields({ products: updatedItems });
  };

  const changeQuantity = (index: number, quantity: number) => {
    if (quantity === 0) {
      removeItem(index);
    } else {
      const updatedItems = [...products];
      updatedItems[index].quantity = quantity;
      updateFields({ products: updatedItems });
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    products.forEach((item) => {
      total += (item.salePrice ?? item.price) * item.quantity;
    });
    return total;
  };

  return (
    <>
      <List>
        {products.map((item, index) => (
          <ListItem key={item.name}>
            <Container
              maxWidth={false}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ListItemAvatar>
                  <Avatar src={item.thumbnailUri} alt={item.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={() => changeQuantity(index, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <Typography>{item.quantity}</Typography>
                      <Button
                        onClick={() => changeQuantity(index, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </Box>
                  }
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyItems: 'space-between',
                }}
              >
                <Typography
                  component="span"
                  sx={{ textDecoration: 'line-through', color: 'grey', pr: 2 }}
                >
                  {item.salePrice !== undefined &&
                    '$' + (item.price * item.quantity).toFixed(2) + '$ '}
                </Typography>
                <Typography>
                  {'$' +
                    ((item.salePrice ?? item.price) * item.quantity).toFixed(2)}
                </Typography>
                <Button onClick={() => removeItem(index)}>X</Button>
              </Box>
            </Container>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="h6">
          Total: ${calculateTotalPrice().toFixed(2)}
        </Typography>
      </Box>
    </>
  );
};

export default OrderSummary;
