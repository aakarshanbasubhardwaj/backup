import LoginCard from '../components/login-ui/LoginCard';

export default function LoginPage() {
  return (
    <LoginCard
      topImageUrl="/images/login.jpg" 
      onGoogleSignIn={() => alert('Google login')}
      onSubmit={(data) => console.log('Form submitted:', data)}
    />
  );
}
