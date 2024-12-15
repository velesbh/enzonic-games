import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <Header />
      <div className="container mx-auto pt-24">
        <div className="mx-auto max-w-md">
          <h1 className="mb-8 text-3xl font-bold text-center neon-text">
            Welcome to Enzonic
          </h1>
          <div className="glass-panel p-6">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#10b981',
                      brandAccent: '#059669',
                      inputBackground: 'transparent',
                      inputText: 'white',
                      inputPlaceholder: 'gray',
                    },
                  },
                },
                className: {
                  container: 'auth-container',
                  button: 'auth-button',
                  input: 'auth-input',
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
              onlyThirdPartyProviders={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;