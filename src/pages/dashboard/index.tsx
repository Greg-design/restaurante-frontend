import { Header } from "@/components/Header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Painel</title>
      </Head>
      <div>
        <Header />
        <h1>Painel</h1>
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
