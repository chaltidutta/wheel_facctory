// src/components/Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  textAlign: 'center',
  position: 'fixed',
  bottom: 0,
  width: '100%',
}));

const Footer = () => {
  return (
    <FooterContainer>
      <Typography variant="body2">
        © 2024 Wheel Factory. All rights reserved.
      </Typography>
    </FooterContainer>
  );
};

export default Footer;
