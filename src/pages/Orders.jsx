import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

const CustomTypography = styled(Typography)({
  color: 'black',
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const textFieldStyle = {
  '& .MuiInputBase-input': {
    color: 'black', // Text color
  },
  '& .MuiInputLabel-root': {
    color: 'black', // Label color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black', // Default border color
    },
    '&:hover fieldset': {
      borderColor: 'black', // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: 'black', // Border color when focused
    },
  },
};

const tableCellStyle = {
  color: 'black', // Text color for table cells
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    year: '',
    make: '',
    model: '',
    damageType: '',
    notes: '',
    imagePath: ''
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Fetch user role
    const token = localStorage.getItem('token');
    const role = JSON.parse(atob(token.split('.')[1])).Role;
    setUserRole(role);

    // Fetch orders if user is a manager
    if (role === 'Manager') {
      const fetchOrders = async () => {
        try {
          const response = await axios.get('http://localhost:5203/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrders(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchOrders();
    }
  }, []);

  const handleOpenModal = () => {
    setOrderData({
      year: '',
      make: '',
      model: '',
      damageType: '',
      notes: '',
      imagePath: ''
    });
    setEditingOrder(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    if (editingOrder) {
      // Update order
      try {
        await axios.put(`http://localhost:5203/api/orders/${editingOrder.orderId}`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(orders.map(order => (order.orderId === editingOrder.orderId ? orderData : order)));
      } catch (error) {
        console.error(error);
      }
    } else {
      // Add new order
      try {
        if (userRole !== 'InventoryWorker') {
          alert('Only Inventory Workers can add orders');
          return;
        }

        console.log('Order Data:', orderData); // Log the order data

        await axios.post('http://localhost:5203/api/orders', orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders([...orders, orderData]);
        setSnackbarMessage('Order added. Login as manager to view orders.');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error adding order:', error); // Log the error
      }
    }

    handleCloseModal();
  };

  const handleEdit = (order) => {
    setOrderData(order);
    setEditingOrder(order);
    setModalOpen(true);
  };

  const handleDelete = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      if (userRole !== 'Manager') {
        alert('Only Managers can delete orders');
        return;
      }
      await axios.delete(`http://localhost:5203/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.filter(order => order.orderId !== orderId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <CustomTypography variant="h4" component="h1" gutterBottom>
        Here are the Orders
      </CustomTypography>
      {userRole === 'InventoryWorker' && (
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Order
        </Button>
      )}
      {userRole === 'Manager' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableCellStyle}>Order ID</TableCell>
                <TableCell sx={tableCellStyle}>Year</TableCell>
                <TableCell sx={tableCellStyle}>Make</TableCell>
                <TableCell sx={tableCellStyle}>Model</TableCell>
                <TableCell sx={tableCellStyle}>Damage Type</TableCell>
                <TableCell sx={tableCellStyle}>Notes</TableCell>
                <TableCell sx={tableCellStyle}>Image Path</TableCell>
                <TableCell sx={tableCellStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell sx={tableCellStyle}>{order.orderId}</TableCell>
                  <TableCell sx={tableCellStyle}>{order.year}</TableCell>
                  <TableCell sx={tableCellStyle}>{order.make}</TableCell>
                  <TableCell sx={tableCellStyle}>{order.model}</TableCell>
                  <TableCell sx={tableCellStyle}>{order.damageType}</TableCell>
                  <TableCell sx={tableCellStyle}>{order.notes}</TableCell>
                  <TableCell sx={tableCellStyle}>{order.imagePath}</TableCell>
                  <TableCell sx={tableCellStyle}>
                    {userRole === 'Manager' && (
                      <>
                        <Button variant="contained" color="primary" onClick={() => handleEdit(order)}>
                          Edit
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(order.orderId)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            {editingOrder ? 'Edit Order' : 'Add Order'}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Year"
            name="year"
            value={orderData.year}
            onChange={handleInputChange}
            sx={textFieldStyle}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Make"
            name="make"
            value={orderData.make}
            onChange={handleInputChange}
            sx={textFieldStyle}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Model"
            name="model"
            value={orderData.model}
            onChange={handleInputChange}
            sx={textFieldStyle}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Damage Type"
            name="damageType"
            value={orderData.damageType}
            onChange={handleInputChange}
            sx={textFieldStyle}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Notes"
            name="notes"
            value={orderData.notes}
            onChange={handleInputChange}
            sx={textFieldStyle}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Image Path"
            name="imagePath"
            value={orderData.imagePath}
            onChange={handleInputChange}
            sx={textFieldStyle}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editingOrder ? 'Save Changes' : 'Add Order'}
          </Button>
        </Box>
      </Modal>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Orders;
