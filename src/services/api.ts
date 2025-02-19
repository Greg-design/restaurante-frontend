import { signOut } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookies["@nextauth.token"]}`,
    },
  });

  api.interceptors.response.use(
    (res) => {
      return res;
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        // qualquer erro 401(nao autorizado) devemos deslogar o usuario
        if (typeof window !== undefined) {
          // deslogar o usuario
          signOut();
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
