import React from 'react';
import { Button } from '@mui/material';

const CommonButton = ({ onClick , color = '', className , fullWidth = false, text, backgroundColor = "#2b2c30"}) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      fullWidth={fullWidth}
      color={color}
      backgroundColor={backgroundColor}
      className={`${className}`}
    >
      {text}
    </Button>
  );
};

export default CommonButton;
