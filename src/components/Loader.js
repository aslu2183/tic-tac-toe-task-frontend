import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function Loader() {
  return (
    <Box sx={{ display: 'flex', alignItems:'center',justifyContent:'center',flexDirection:'column',height:'100%' }}>
      <CircularProgress />
      <Typography variant='h5'>Please wait...</Typography>
    </Box>
  );
}