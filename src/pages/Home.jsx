// src/pages/Home.jsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import backgroundImage from '../assets/background3.jpg';

const HeroContent = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: theme.palette.common.white,
  padding: theme.spacing(12, 0),
  textAlign: 'center',
  width: '100%',
  minHeight: '60vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: '#101012', // semi-transparent white
  color: theme.palette.text.primary, // Ensure text color is appropriate
  boxShadow: theme.shadows[5],
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[10],
  },
}));

const Home = () => {
  return (
    <Box sx={{ width: '100%', pt: '64px' }}>
      <HeroContent >
        <Container maxWidth="sm">
          <Typography variant="h1" gutterBottom>
            Welcome to Wheel Factory
          </Typography>
          <Typography variant="h5">
            Your one-stop solution for wheel remanufacturing.
          </Typography>
        </Container>
      </HeroContent>
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <Typography variant="h5" component="h2">
                High Quality
              </Typography>
              <Typography>
                We provide top-notch remanufacturing services ensuring high quality.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <Typography variant="h5" component="h2">
                Expert Team
              </Typography>
              <Typography>
                Our team consists of industry experts with years of experience.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <Typography variant="h5" component="h2">
                Customer Support
              </Typography>
              <Typography>
                We offer 24/7 customer support to assist you with any queries.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
