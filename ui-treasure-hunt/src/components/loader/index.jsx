import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const Loader = ({ variant = 'normal', text = '', color = 'primary', size = 40 }) => {
  const isOverlay = variant === 'overlay';

  return (
    <Box
      sx={{
        position: isOverlay ? 'fixed' : 'relative',
        top: isOverlay ? 0 : 'auto',
        left: isOverlay ? 0 : 'auto',
        width: isOverlay ? '100%' : 'auto',
        height: isOverlay ? '100%' : '23px',
        backgroundColor: isOverlay ? 'rgba(0,0,0,0.4)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: isOverlay ? 9999 : 'auto',
      }}
    >
      <CircularProgress color={color} size={isOverlay ? 70 : size} thickness={isOverlay ? 5 : 4} />
      {text && (
        <Typography mt={2} color={isOverlay ? '#fff' : '#000'}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;

