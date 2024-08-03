// src/components/Navbar.jsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const Navbar = () => {
  return (
    <React.Fragment>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
            Wheel Factory
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/login" sx={{ color: 'secondary.main' }}>Login</Button>
          <Button color="inherit" component={Link} to="/register" sx={{ color: 'secondary.main' }}>Register</Button>
          <Button color="inherit" component={Link} to="/orders">Orders</Button>
          <Button color="inherit" component={Link} to="/tasks">Tasks</Button>
        </Toolbar>
      </AppBar>
      <Offset />
    </React.Fragment>
  );
};

export default Navbar;
