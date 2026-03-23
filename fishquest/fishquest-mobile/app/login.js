import { router } from "expo-router";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import GradientBackground from "../components/GradientBackground";
export default function LoginScreen() {
  const { login } = useAuth();

  function handleLogin(email, password) {
    login(email);
    router.replace("/(tabs)/home");
  }

  return (
    <GradientBackground>
      <AuthForm
        title="Welcome Back"
        buttonText="Log In"
        onSubmit={handleLogin}
        footerText="Don't have an account?"
        footerLinkText="Sign up"
        footerHref="/signup"
      />
    </GradientBackground>
  );
}
