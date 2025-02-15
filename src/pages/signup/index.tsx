import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthContext } from "@/contexts/AuthContext";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";
import logoImg from "../../../public/logo.svg";
import styles from "../../styles/home.module.scss";

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (name === "" || email === "" || password === "") {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    let data = {
      name,
      email,
      password,
    };

    await signUp(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Faça seu cadastro</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo" />

        <div className={styles.login}>
          <h1>Criando sua conta</h1>
          <form onSubmit={handleRegister}>
            <Input placeholder="Digite seu nome" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" loading={loading}>
              Cadastrar
            </Button>
          </form>

          <Link href="/" className={styles.text}>
            Já possui uma conta? Faça login!
          </Link>
        </div>
      </div>
    </>
  );
}
