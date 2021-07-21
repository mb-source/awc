import {
  Card,
  Input,
  Layout,
  Menu,
  Select,
  Modal,
  Form,
  Table,
  Popconfirm,
  Rate,
  Space,
} from "antd";
import { useState, useEffect } from "react";
import styles from "../user/userhomepage.module.scss";
import Image from "next/image";
import { SaveOutlined, UserOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getMovieList,
  getTopFourDirAct,
  getPoster,
  getMovieInfo,
} from "../logic/Api";
import genres from "../logic/utilities";
import { getBusinessMovies, saveMovie } from "../logic/movieslogic";

const { Option } = Select;
const { Meta } = Card;
const { Header, Content } = Layout;

export default function BusinessHomePage() {
  const [films, setfilm] = useState([]);
  const [reload, setReload] = useState(false);
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [rentPrice, setRent] = useState();
  const [sellPrice, setSell] = useState();
  const [movies, setMovies] = useState([]);

  useEffect(async () => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u);
      const ids = getBusinessMovies(u.info.businessName);
      const m = [];
      for (const id in ids) {
        const movie = await getMovieInfo(ids[id].id);
        const final = {
          ...movie,
          rentPrice: ids[id].rentPrice,
          sellPrice: ids[id].sellPrice,
        };
        m.push(final);
      }
      setMovies(m);
    } else {
      window.location.href = "/login";
    }
  }, [reload]);

  async function search(nameKey) {
    if (nameKey.length > 0) {
      const res = await getMovieList(nameKey);
      const optionFilm = res.results.map((film) => {
        return {
          title: film.title,
          value: film.id,
          date: film.release_date,
          poster: film.poster_path,
          generi: film.genre_ids,
        };
      });
      setfilm(optionFilm);
    } else {
      setfilm([]);
    }
    // for (var i = 0; i < myArray.length; i++) {
    //   if (String(myArray[i].title) === String(nameKey) && stato === 1) {
    //     console.log(myArray[i]);
    //     return myArray[i];
    //   }
    //   if (String(myArray[i].title) === String(nameKey)  && stato === 2) {
    //     console.log(myArray[i]);
    //     return myArray[i].title;
    //   }
    //   if (String(myArray[i].title) === String(nameKey)  && stato === 3) {
    //     console.log(myArray[i]);
    //     return myArray[i].genre;
    //   }
    // }
  }

  function elimina(id) {
    let totalmovies = localStorage.getItem("movies")
      ? JSON.parse(localStorage.getItem("movies"))
      : [];

    const movie = totalmovies.filter((m) => m.id === id)[0];
    console.log(movie)
    if (movie.vendors.length > 1) {
      const index = totalmovies.findIndex(m => m.id === id )
     const finalvendors = movie.vendors.filter(
        (item) => item.businessName !== user.info.businessName
      );
      totalmovies[index].vendors=finalvendors
      localStorage.setItem("movies",JSON.stringify(totalmovies))
      setTimeout(() => {
        setReload(!reload)
        setMovies(totalmovies)

      }, 500);

    }
    localStorage.setItem(
      "movies",
      JSON.stringify(totalmovies.filter((item) => item.id !== id))
    );
  }

  const dataSource = [];

  const columns = [
    {
      title: "Film",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Prezzo di Vendita",
      dataIndex: "sellPrice",
      key: "sellPrice",
      render: (text) => (
        <a>
          <Input value={text} style={{ width: "35%" }} />
        </a>
      ),
    },
    {
      title: "Prezzo di Noleggio",
      dataIndex: "rentPrice",
      key: "rentPrice",
      render: (text) => (
        <a>
          <Input value={text} style={{ width: "35%" }} />
        </a>
      ),
    },
    {
      title: "Elimina",
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Popconfirm
          title="Vuoi eliminare questo film dal tuo catalogo？"
          okText="Si"
          onConfirm={() => elimina(id)}
          cancelText="No"
        >
          <a href="#">
            <DeleteOutlined />
          </a>
        </Popconfirm>
      ),
    },
    {
      title: "Modifica",
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Popconfirm
          title="Vuoi applicare le modifiche al tuo catalogo？"
          okText="Si"
          onConfirm={() => mofica(id)}
          cancelText="No"
        >
          <a href="#">
            <SaveOutlined />
          </a>
        </Popconfirm>
      ),
    },
  ];

  const opt = films.map((item) => {
    return (
      <Option
        poster={item.poster}
        filmTitle={item.title}
        date={item.date}
        value={item.value}
        genre={item.generi}
      >
        {item.title}
      </Option>
    );
  });

  return (
    <Layout className={styles.layout}>
      <Header style={{ padding: "0 !important", backgroundColor: "white" }}>
        <div className={styles.logo}>
          <a href="/">
            <Image src="/moviebook_clear.png" width="170" height="64" />
          </a>
        </div>

        <Select
          onSelect={async (_, item) => {
            console.log(item);
            const res = await getTopFourDirAct(item.value);
            const actors = res[0];
            const dir = [res[1]];
            Modal.info({
              maskClosable: true,
              closable: true,
              okText: "Aggiungi film",
              onOk:()=> {
                console.log(sellPrice);
                ;saveMovie(
                item.value,
                user.info.businessName,
                sellPrice,
                rentPrice,
                setData)}
              ,
              title: item.filmTitle,
              icon: <></>,
              content: (
                <>
                  <img src={getPoster(item.poster, 200)} />
                  <p className={styles.attori}>Attori: {actors}</p>
                  <p>Registi: {dir}</p>
                  <p>Data di uscita: {item.date}</p>
                  {item.genre && item.genre.length > 0 && (
                    <>
                      <p>
                        Generi:{" "}
                        {item.genre.map((genere) => genres[genere]).toString()}
                      </p>
                      </>
                      )}
                      <>
                      <Form.Item name="sellPrice" label="Prezzo di vendita">
                        <Input
                          onChange={(e) => setSell(e.target.value)}
                          type="number"
                        ></Input>
                      </Form.Item>

                      <Form.Item name="rentPrice" label="Prezzo di noleggio">
                        <Input
                          onChange={(e) => setRent(e.target.value)}
                          type="number"
                        ></Input>
                      </Form.Item>
                    </>
                  
                </>
              ),
            });
          }}
          defaultActiveFirstOption={false}
          filterOption={false}
          showSearch
          style={{ width: 200 }}
          placeholder="Cerca..."
          onSearch={(input) => {
            search(input);
          }}
        >
          {opt}
        </Select>

        <Menu
          mode="horizontal"
          style={{ float: "right", marginRight: "-10px" }}
        >
          <Menu.Item key="1">
            <a href="/business/BusinessPage">
              <UserOutlined />
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <div
              onClick={() => {
                window.localStorage.removeItem("user");
                window.location.href = "/";
              }}
            >
              Esci
            </div>
          </Menu.Item>
        </Menu>
      </Header>
      <Content className={styles.content}>
        <div className={styles.div}>
          <h3>Il Mio Catalogo</h3>
          <Table
            className={styles.table}
            label="films"
            dataSource={movies}
            columns={columns}
            size="middle"
          />
        </div >

        <div className={styles.rating}>
         <h3>Recensioni</h3>
          <Rate disabled defaultValue={3.5} /> (18)
        </div>
      </Content>
    </Layout>
  );
}
