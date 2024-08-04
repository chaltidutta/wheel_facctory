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

const Tasks = () => {
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({});
  const [taskType, setTaskType] = useState('');
  const [tasks, setTasks] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Fetch user role and username
    const fetchRoleAndUsername = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5203/api/Tasks/GetRoleAndUsername', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRole(response.data[0]);
      setUsername(response.data[1]);
    };

    fetchRoleAndUsername();
  }, []);

  useEffect(() => {
    if (userRole === 'Manager') {
      // Fetch all tasks if user is a manager
      const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5203/api/Tasks/AllStatus', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
      };

      fetchTasks();
    }
  }, [userRole]);

  const handleOpenModal = (type) => {
    setTaskData({});
    setTaskType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
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
    let url = '';
    let data = {};

    if (taskType === 'SolderingSandblasting') {
      url = `http://localhost:5203/api/Tasks/SolderingSandblasting?orderId=${taskData.orderId}`;
      data = { level: taskData.level, note: taskData.note };
    } else if (taskType === 'Painting') {
      url = `http://localhost:5203/api/Tasks/Painting?orderId=${taskData.orderId}`;
      data = { color: taskData.color, type: taskData.type, note: taskData.note };
    } else if (taskType === 'Packaging') {
      url = `http://localhost:5203/api/Tasks/Packaging?orderId=${taskData.orderId}`;
      data = { inspectionRating: taskData.inspectionRating, note: taskData.note, ImagePath: taskData.imagePath };
    }

    try {
      await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbarMessage('Task performed successfully');
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error performing task:', error);
    }
  };

  const handleDelete = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5203/api/Tasks/DeleteTask/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.orderId !== orderId));
      setSnackbarMessage('Task deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting task:', error);
      setSnackbarMessage('Failed to delete task');
      setSnackbarOpen(true);
    }
  };

  const handleTaskClick = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5203/api/Orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaskData(response.data);
      setTaskType('OrderDetails');
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <CustomTypography variant="h4" component="h1" gutterBottom>
        Here are the Tasks
      </CustomTypography>

      {userRole === 'Solderer' && (
        <Button variant="contained" color="primary" onClick={() => handleOpenModal('SolderingSandblasting')}>
          Perform Soldering and Sandblasting
        </Button>
      )}

      {userRole === 'Painter' && (
        <Button variant="contained" color="primary" onClick={() => handleOpenModal('Painting')}>
          Perform Painting
        </Button>
      )}

      {userRole === 'PackagingWorker' && (
        <Button variant="contained" color="primary" onClick={() => handleOpenModal('Packaging')}>
          Perform Packaging
        </Button>
      )}

      {userRole === 'Manager' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableCellStyle}>Order ID</TableCell>
                <TableCell sx={tableCellStyle}>Status</TableCell>
                <TableCell sx={tableCellStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.orderId}>
                  <TableCell sx={tableCellStyle} onClick={() => handleTaskClick(task.orderId)}>
                    {task.orderId}
                  </TableCell>
                  <TableCell sx={tableCellStyle}>{task.status}</TableCell>
                  <TableCell sx={tableCellStyle}>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(task.orderId)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          {taskType === 'OrderDetails' ? (
            <>
              <Typography variant="h6" component="h2" style={{ color: 'black' }}>
                Order Details
              </Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Order ID:</strong> {taskData.orderId}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Year:</strong> {taskData.year}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Make:</strong> {taskData.make}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Model:</strong> {taskData.model}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Damage Type:</strong> {taskData.damageType}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Notes:</strong> {taskData.notes}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Image Path:</strong> {taskData.imagePath}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Created At:</strong> {taskData.createdAt}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Updated At:</strong> {taskData.updatedAt}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Deleted At:</strong> {taskData.deletedAt}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Created By:</strong> {taskData.createdBy}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Updated By:</strong> {taskData.updatedBy}</Typography>
              <Typography variant="body1" style={{ color: 'black' }}><strong>Deleted By:</strong> {taskData.deletedBy}</Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" component="h2">
                {taskType === 'SolderingSandblasting' && 'Perform Soldering and Sandblasting'}
                {taskType === 'Painting' && 'Perform Painting'}
                {taskType === 'Packaging' && 'Perform Packaging'}
              </Typography>

              <TextField
                margin="normal"
                required
                fullWidth
                label="Order ID"
                name="orderId"
                value={taskData.orderId}
                onChange={handleInputChange}
                sx={textFieldStyle}
              />

              {taskType === 'SolderingSandblasting' && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Level"
                    name="level"
                    value={taskData.level}
                    onChange={handleInputChange}
                    sx={textFieldStyle}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Note"
                    name="note"
                    value={taskData.note}
                    onChange={handleInputChange}
                    sx={textFieldStyle}
                  />
                </>
              )}

              {taskType === 'Painting' && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Color"
                    name="color"
                    value={taskData.color}
                    onChange={handleInputChange}
                    sx={textFieldStyle}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Type"
                    name="type"
                    value={taskData.type}
                    onChange={handleInputChange}
                    sx={textFieldStyle}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Note"
                    name="note"
                    value={taskData.note}
                    onChange={handleInputChange}
                    sx={textFieldStyle}
                  />
                </>
              )}

              {taskType === 'Packaging' && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Inspection Rating"
                    name="inspectionRating"
                    value={taskData.inspectionRating}
                    onChange={handleInputChange}
                    sx={textFieldStyle}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Note"
                    name="note"
                    value={taskData.note}
                    onChange={handleInputChange}
                    sx={textFieldStyle}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Image Path"
                    name="imagePath"
                    value={taskData.imagePath}
                    onChange={handleInputChange}
                    sx={textFieldStyle}
                  />
                </>
              )}

              <Button variant="contained" color="primary" onClick={handleSubmit}>
                {taskType === 'SolderingSandblasting' && 'Perform Soldering and Sandblasting'}
                {taskType === 'Painting' && 'Perform Painting'}
                {taskType === 'Packaging' && 'Perform Packaging'}
              </Button>
            </>
          )}
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

export default Tasks;
