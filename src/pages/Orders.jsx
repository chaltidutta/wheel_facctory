// src/pages/Orders.jsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const CustomTypography = styled(Typography)({
  color: 'black',
});

const Orders = () => {
  return (
    <Container component="main" maxWidth="md">
      <CustomTypography variant="h4" component="h1" gutterBottom>
        Here are the Orders
      </CustomTypography>
    </Container>
  );
};

export default Orders;