import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

export default function SelectContent() {
  return (
    <MenuItem  
    sx={{
      display: 'flex',
      color: 'black', // Override the default gray color
      cursor: 'default', // Prevent the pointer cursor
    }}>
      <img
        src="/images/logo.jpg"
        alt="Logo"
        style={{
          width: '50px',
          height: '50px',
          marginRight: '8px',
        }}
      />
     <Typography fontFamily={'"Roboto", "Arial", sans-serif'}> DataNest </Typography>
    </MenuItem>
  );
}