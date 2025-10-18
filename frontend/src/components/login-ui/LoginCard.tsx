// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   Checkbox,
//   CssBaseline,
//   FormControl,
//   FormControlLabel,
//   Divider,
//   TextField,
//   Stack,
//   Card as MuiCard,
//   CardMedia,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import Tooltip from '@mui/material/Tooltip';
// import GoogleIcon from '@mui/icons-material/Google';
// import { useLogin } from '../../hooks/UseLogin'; 

// const Card = styled(MuiCard)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignSelf: 'center',
//   width: '100%',
//   padding: theme.spacing(2),
//   gap: theme.spacing(2),
//   margin: 'auto',
//   [theme.breakpoints.up('sm')]: {
//     maxWidth: '450px',
//   },
//   boxShadow:
//     'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
// }));

// const SignInContainer = styled(Stack)(({ theme }) => ({
//   height: '100vh',
//   padding: theme.spacing(2),
//   [theme.breakpoints.up('sm')]: {
//     padding: theme.spacing(4),
//   },
//   justifyContent: 'center',
//   alignItems: 'center',
//   backgroundColor: '#f0f2f5',
// }));

// interface LoginCardProps {
//   onGoogleSignIn?: () => void;
//   onSubmit?: (data: { email: string; password: string }) => void;
//   topImageUrl?: string; 
// }

// const LoginCard: React.FC<LoginCardProps> = ({ onGoogleSignIn, topImageUrl }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); 

//   const handleSubmit = () => {
//     if (email === 'abc@gmail.com' && password === '1234') {
//       console.log('Login successful');
//       navigate('/home', { replace: true}); 
//     } else {
//       console.log('Invalid credentials');
//       alert('Invalid email or password');
//     }
//   };

//   return (
//     <SignInContainer direction="column">
//       <CssBaseline />
//       <Card variant="outlined">
//         {/* Top Image */}
//         {topImageUrl && (
//           <CardMedia
//             component="img"
//             image={topImageUrl}
//             alt="Login"
//             sx={{ borderRadius: 2,  maxHeight: 230, objectFit: 'contain' }}
//           />
//         )}
//         <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//           <FormControl>
//             <TextField
//           label="Email"
//           variant="outlined"
//           fullWidth
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//           </FormControl>
//           <FormControl>
//             <TextField
//           label="Password"
//           type="password"
//           variant="outlined"
//           fullWidth
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//           </FormControl>
//           <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
//           <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
//           Login
//         </Button>
//         </Box>

//         <Divider sx={{ my: 2 }}>or</Divider>
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//         {onGoogleSignIn && (
//           <Button
//           variant="outlined"
//           color="primary"
//           fullWidth
//           onClick={onGoogleSignIn}
//           startIcon={<GoogleIcon />} // Add the Google icon here
//         >
//           Sign in with Google
//         </Button>
//         )}
//         </Box>

// {/* Add the ZeroTier link here */}
// <div
//   className="zerotier-container"
//   style={{ textAlign: 'center', }}
// >
//   <a
//     href="https://accounts.zerotier.com/realms/zerotier/protocol/openid-connect/auth?client_id=zt-central&redirect_uri=https%3A%2F%2Fmy.zerotier.com%2Fauth%2Fcallback&response_type=code&scope=openid+profile+email+offline_access&state=b77fa9c6931a4307a44008534e7e4c6c&code_challenge=QW40uJ08L3MfH-Yir8NoSqu26n8TcXhPnO2-WF_RAtw&code_challenge_method=S256&response_mode=query"
//     target="_blank"
//     className="zerotier-link"
//     style={{
//       textDecoration: 'none',
//       color: 'inherit',
//       display: 'inline-flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '6px', 
//     }}
//   >
//     <Tooltip title="Manage your network and devices on ZeroTier." arrow slotProps={{
//       tooltip: {
//         style: {
//           backgroundColor: '#333', 
//           color: '#fff', 
//           boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', 
//           fontSize: '14px', 
//           borderRadius: '4px', 
//           padding: '8px 12px',
//         },
//       },
//     }}>
//       <img
//         src="/images/ZeroTierIcon.png"
//         alt="ZeroTier Icon"
//         style={{
//           width: '16px',
//           height: '16px',
//           display: 'block', 
//         }}
//       />
//     </Tooltip>
//     <br/>
//     <br/>

//   </a>
// </div>


//       </Card>
//     </SignInContainer>
//   );
// };

// export default LoginCard;

import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Divider,
  TextField,
  Stack,
  Card as MuiCard,
  CardMedia,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { useLogin } from '../../hooks/UseLogin';

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
  topImageUrl?: string;
}

const LoginCard: React.FC<LoginCardProps> = ({ topImageUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { sendLoginRequest, error } = useLogin();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (email === 'abc@gmail.com' && password === '1234') {
      console.log('Login successful');
      navigate('/home', { replace: true });
    } else {
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
            sx={{ borderRadius: 2, maxHeight: 230, objectFit: 'contain' }}
          />
        )}

        {/* Email/Password Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
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

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>or</Divider>

        {/* Google Sign-in Button */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={sendLoginRequest}
          >
            Sign in with Google
          </Button>

          {error && (
            <Box
              sx={{
                color: 'red',
                fontSize: '0.9rem',
                textAlign: 'center',
                mt: 1,
              }}
            >
              {error}
            </Box>
          )}
        </Box>

        {/* ZeroTier Link */}
        <div className="zerotier-container" style={{ textAlign: 'center', marginTop: 16 }}>
          <a
            href="https://accounts.zerotier.com/realms/zerotier/protocol/openid-connect/auth?client_id=zt-central&redirect_uri=https%3A%2F%2Fmy.zerotier.com%2Fauth%2Fcallback&response_type=code&scope=openid+profile+email+offline_access&state=b77fa9c6931a4307a44008534e7e4c6c&code_challenge=QW40uJ08L3MfH-Yir8NoSqu26n8TcXhPnO2-WF_RAtw&code_challenge_method=S256&response_mode=query"
            target="_blank"
            className="zerotier-link"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Tooltip title="Manage your network and devices on ZeroTier." arrow>
              <img
                src="/images/ZeroTierIcon.png"
                alt="ZeroTier Icon"
                style={{
                  width: '16px',
                  height: '16px',
                  display: 'block',
                }}
              />
            </Tooltip>
          </a>
        </div>
      </Card>
    </SignInContainer>
  );
};

export default LoginCard;
