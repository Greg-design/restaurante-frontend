import { Header } from "@/components/Header";
import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

type ItemProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);

  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(0);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  // quando seleciona uma nova categoria
  function handleCategory(e: ChangeEvent<HTMLSelectElement>) {
    setCategorySelected(parseInt(e.target.value));
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      const data = new FormData();

      if (name === "" || price === "" || description === "" || imageAvatar === null) {
        toast.error("Preencha todos os campos!");
        return;
      }

      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("category_id", categories[categorySelected].id);
      data.append("file", imageAvatar);

      const apiClient = setupAPIClient();

      await apiClient.post("/product", data);

      toast.success("Cadastrado com sucesso!");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao cadastrar.");
    }

    setName("");
    setPrice("");
    setDescription("");
    setImageAvatar(null);
    setAvatarUrl("");
  }

  return (
    <>
      <Head>
        <title>Novo produto</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Novo Produto</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <label className={styles.labelAvatar}>
              <span>
                <FiUpload size={28} color="#fff" />
              </span>

              <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

              {avatarUrl && (
                <img src={avatarUrl} alt="foto do produto" width={250} height={250} className={styles.preview} />
              )}
            </label>

            <select value={categorySelected} onChange={handleCategory}>
              {categories.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>

            <input
              type="text"
              placeholder="Digite o nome do produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Preço do produto"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={styles.input}
            />

            <textarea
              placeholder="Descreva seu produto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.input}
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
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/category");
  //console.log(response.data)

  return {
    props: {
      categoryList: response.data,
    },
  };
});
