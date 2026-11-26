import { AuthProvider } from './features/auth/AuthContext';
import { AuthModal } from './features/auth/AuthModal';
import { AppRouter } from './routes/AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <AuthModal />
      <AppRouter />
    </AuthProvider>
  );
}