import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import Alert from '@mui/material/Alert';


function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [socialMedia, setSocialMedia] = useState([{ social_media_name: '', username: '' }]);
  const [notification, setNotification] = useState('');
  const [isNotif, setIsNotif] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/customers', {
        params: {
          includes: 'socialMedia'
        }
      });
      console.log(response, 'data get')
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSocialMediaChange = (index, field, value) => {
    const updatedSocialMedia = [...socialMedia];
    updatedSocialMedia[index][field] = value;
    setSocialMedia(updatedSocialMedia);
  };

  const handleAddSocialMedia = () => {
    setSocialMedia([...socialMedia, { social_media_name: '', username: '' }]);
  };

  const handleRemoveSocialMedia = (index) => {
    const updatedSocialMedia = [...socialMedia];
    updatedSocialMedia.splice(index, 1);
    setSocialMedia(updatedSocialMedia);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSendData = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/customers', {
        name,
        email,
        social_media: socialMedia,
        description,
      });

      handleCloseDialog();
      setIsNotif(true);
      setNotification(res.data.message);
      setTimeout(() => {
        setIsNotif(false);
      }, 1200);
      fetchData();
    } catch (error) {
      setIsNotif(true);
      setTimeout(() => {
        setIsNotif(false);
      }, 1900);
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/customers/${id}`);
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const isError = (val) => {
    if (val) return val;
    return true;
  };

  return (
    <div className="bg-gray-100 h-screen">
      <div className="p-9 ">
        <div className="flex justify-end my-2">
          <Button variant="contained" onClick={handleOpenDialog}>
            Add Data
          </Button>
        </div>

        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Social Media</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers && customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      {customer.social_media && customer.social_media.map((socialMediaItem) => (
                        <div key={socialMediaItem.id}>
                          <div>Social Media Name: {socialMediaItem.social_media_name}</div>
                          <div>Username: {socialMediaItem.username}</div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{customer.description}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleDelete(customer.id)}>
                        <div className="text-red-500">Delete</div>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add Customer</DialogTitle>

          {isNotif && (
            <Alert style={{ zIndex: 100 }} severity={isError() ? 'error' : 'success'}>
              {notification || 'This is an error alert — check it out!'}
            </Alert>
          )}

          <DialogContent>
            <TextField label="Name" value={name} onChange={handleNameChange} fullWidth margin="normal" />
            <TextField label="Email" value={email} onChange={handleEmailChange} fullWidth margin="normal" />

            <div>
              <div>Social Media:</div>
              { socialMedia && socialMedia.map((item, index) => (
                <div key={index}>
                  <TextField
                    label="Social Media Name"
                    value={item.social_media_name}
                    onChange={(event) => handleSocialMediaChange(index, 'social_media_name', event.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Username"
                    value={item.username}
                    onChange={(event) => handleSocialMediaChange(index, 'username', event.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <Button onClick={() => handleRemoveSocialMedia(index)}>Remove</Button>
                </div>
              ))}
              <Button onClick={handleAddSocialMedia}>Add Social Media</Button>
            </div>

            <TextField
              label="Description"
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSendData} color="primary">
              Kirim
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default CustomerTable;
