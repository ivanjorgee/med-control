
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Key, Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoginHints } from "./LoginHints";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  // Load remembered email if exists
  useState(() => {
    const savedEmail = localStorage.getItem("medcontrol-email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Iniciando processo de login...");
      if (email && password) {
        if (rememberMe) {
          localStorage.setItem("medcontrol-email", email);
        } else {
          localStorage.removeItem("medcontrol-email");
        }
        
        console.log(`Tentando login com: ${email}`);
        const success = await login(email, password);
        console.log("Resultado do login:", success);
        
        if (success) {
          toast({
            title: "Sucesso!",
            description: "Login realizado com sucesso!"
          });
          
          // Redirecionar para a página anterior ou para o dashboard
          const from = location.state?.from?.pathname || "/";
          console.log(`Redirecionando para: ${from}`);
          navigate(from, { replace: true });
        } else {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: "Email ou senha incorretos."
          });
        }
      } else {
        console.log("Campos de login incompletos");
        toast({
          variant: "destructive",
          title: "Erro!",
          description: "Por favor, preencha todos os campos."
        });
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-200">
      <CardContent className="pt-6">
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>Esqueceu sua senha?</strong> Entre em contato com o administrador do sistema para redefinir sua senha.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
              <Key className="h-4 w-4 mr-2 text-primary" />
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                Lembrar meu email
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2" 
            disabled={isLoading}
          >
            {isLoading ? "Autenticando..." : (
              <>
                <LogIn className="h-4 w-4" />
                Entrar no Sistema
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <Separator className="my-2" />
        <div className="w-full">
          <LoginHints />
        </div>
      </CardFooter>
    </Card>
  );
}
