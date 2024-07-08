import { Header } from "@/components/Header";
import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.css";

export default function Category() {
  const [name, setName] = useState("");

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (name === "") {
      return;
    }

    const apiClient = setupAPIClient();
    await apiClient.post("/category", {
      name: name,
    });

    toast.success("Categoria cadastrada com sucesso!");
    setName("");
  }

  return (
    <>
      <Head>
        <title>Nova categoria</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <h1>Cadastrar categorias</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Digite o nome da categoria"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button type="submit" className={styles.buttonAdd}>
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

// Aqui indica que só usuarios logados podem acessar
export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
