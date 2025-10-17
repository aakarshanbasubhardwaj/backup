import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Divider,
  Link,
  TextField,
  Stack,
  Card as MuiCard,
  CardMedia,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0f2f5',
}));

interface LoginCardProps {
  onGoogleSignIn?: () => void;
  onSubmit?: (data: { email: string; password: string }) => void;
  topImageUrl?: string; 
}

const LoginCard: React.FC<LoginCardProps> = ({ onGoogleSignIn, topImageUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = () => {
    if (email === 'abc@gmail.com' && password === '1234') {
      console.log('Login successful');
      navigate('/home', { replace: true}); 
    } else {
      console.log('Invalid credentials');
      alert('Invalid email or password');
    }
  };

  return (
    <SignInContainer direction="column">
      <CssBaseline />
      <Card variant="outlined">
        {/* Top Image */}
        {topImageUrl && (
          <CardMedia

            component="img"
            image={topImageUrl}
            alt="Login"
            sx={{ borderRadius: 2,  maxHeight: 230, objectFit: 'contain' }}
          />
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl>
            <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
          </FormControl>
          <FormControl>
            <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
          </FormControl>
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Login
        </Button>
        </Box>

        <Divider sx={{ my: 2 }}>or</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {onGoogleSignIn && (
          <Button variant="outlined" color="secondary" fullWidth onClick={onGoogleSignIn}>
            Sign in with Google
          </Button>
        )}
        </Box>
      </Card>
    </SignInContainer>
  );
};

export default LoginCard;
