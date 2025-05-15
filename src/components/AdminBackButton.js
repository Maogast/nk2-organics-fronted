import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminBackButton = () => {
  const navigate = useNavigate();
  
  // Using a button that navigates directly to the admin dashboard.
  return (
    <Button 
      variant="contained" 
      color="primary"
      onClick={() => navigate('/admin-dashboard')}
      sx={{ mb: 2 }} 
    >
      Back to Dashboard
    </Button>
  );
};

export default AdminBackButton;