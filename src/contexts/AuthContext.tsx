import { api } from "@/services/apiClient";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credential: SignUpProps) => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/");
  } catch {
    console.log("Erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();

  const isAuthenticated = !!user; // converte para booleano caso user não tenha nada

  // Permanecendo login
  useEffect(() => {
    // tentar pegar algo no cookie, que é nosso token
    const { "@nextauth.token": token } = parseCookies();
    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { id, name, email } = response.data;

          setUser({
            id,
            name,
            email,
          });
        })
        .catch(() => {
          // se deu erro, deslogamos o user.
          signOut();
        });
    }
  }, []);

  // login
  async function signIn({ email, password }: SignInProps) {
    try {
      const res = await api.post("/session", {
        email,
        password,
      });

      const { id, name, token } = res.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // expira em 1 mes
        path: "/", // quais caminhos terao acesso ao token
      });

      setUser({
        id,
        name,
        email,
      });

      // passar para as proximas requisiçoes o nosso token
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      toast.success("Logado com sucesso!");

      // redirecionar o user para /dashboard
      Router.push("/dashboard");
    } catch (err) {
      toast.error("Erro ao acessar.");
      console.log("Erro ao acessar ", err);
    }
  }

  // cadastro
  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const res = await api.post("/users", {
        name,
        email,
        password,
      });

      toast.success("Cadastrado com sucesso!");

      Router.push("/");
    } catch (err) {
      toast.error("Erro ao realizar cadastro.");
      console.log("erro ao cadastrar ", err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>{children}</AuthContext.Provider>
  );
}
