import { Header } from "@/components/Header";
import { ModalOrder } from "@/components/ModalOrder";
import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import Modal from "react-modal";
import styles from "./styles.module.scss";

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
};

interface HomeProps {
  orders: OrderProps[];
}

// ModalItem
export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  };
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  };
};

export default function Dashboard({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || []);

  const [modalItem, setModalItem] = useState<OrderItemProps[]>();
  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModal(id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/order/detail", {
      params: {
        order_id: id,
      },
    });

    setModalItem(response.data);
    setModalVisible(true);
  }

  // botão concluir pedido
  async function handleFinishItem(id: string) {
    const apiClient = setupAPIClient();
    await apiClient.put("/order/finish", {
      order_id: id,
    });

    const response = await apiClient.get("/orders");

    setOrderList(response.data);

    setModalVisible(false);
  }

  async function handleRefreshOrders() {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/orders");
    setOrderList(response.data);
  }

  Modal.setAppElement("#__next");

  return (
    <>
      <Head>
        <title>Painel</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Últimos pedidos</h1>
            <button onClick={handleRefreshOrders}>
              <FiRefreshCcw size={25} style={{ color: "#3fffa3" }} />
            </button>
          </div>

          <article className={styles.listOrders}>
            {orderList.length === 0 && <span className={styles.emptyList}>Nenhum pedido aberto...</span>}

            {orderList.map((item) => (
              <section key={item.id} className={styles.orderItem}>
                <button onClick={() => handleOpenModal(item.id)}>
                  <div className={styles.tag}></div>
                  <span>Mesa {item.table}</span>
                </button>
              </section>
            ))}
          </article>
        </main>

        {modalVisible && (
          <ModalOrder
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            order={modalItem}
            handleFinishOrder={handleFinishItem}
          />
        )}
      </div>
    </>
  );
}

// Aqui é a parte do server side, passa primeiro por aqui
// canSSRAuth indica que só usuarios logados podem acessar
export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/orders");

  return {
    props: {
      orders: response.data,
    },
  };
});
