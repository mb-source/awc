import {
  Card,
  Row,
  Col,
  Layout,
  Menu,
  Select,
  Modal,
  Button,
  message,
} from "antd";
import { useState, useEffect } from "react";
import styles from "./userhomepage.module.scss";
import Image from "next/image";
import { ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import {
  getMovieList,
  getTopFourDirAct,
  getPoster,
  getMoviesByGenre,
} from "../logic/Api";
import genres from "../logic/utilities";
import { getMoviePrices, createOrder } from "../logic/movieslogic";

const { Option } = Select;
const { Meta } = Card;
const { Header, Content } = Layout;

export default function UserHomePage() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [films, setfilm] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(async () => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u);
      const res = await getMoviesByGenre(u.info.genere);
      setMovies(res.results);
      setLoading(false);
    } else {
      window.location.href = "/login";
    }
  }, []);

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
  }

  function buyMovie(id, buy) {
    if (!buy) {
      return message.error("Seleziona prima un negozio da cui acquistare");
    } else {
      createOrder(user.info.email, "Negozio", id, buy, 0);
    }
  }

  function rentMovie(id, rent) {
    if (!rent) {
      return message.error("Seleziona prima un negozio da cui noleggiare");
    } else {
      createOrder(user.info.email, "Negozio", id, rent, 1);
    }
  }

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
            const res = await getTopFourDirAct(item.value);
            const actors = res[0];
            const dir = [res[1]];
            var rent;
            var buy;
            var vendor;
            Modal.info({
              title: item.filmTitle,
              icon: <></>,
              content: (
                <>
                  <img src={getPoster(item.poster, 200)} />
                  <p className={styles.attori}>Attori: {actors}</p>
                  <p>Registi: {dir}</p>
                  <p>Data di uscita: {item.date}</p>
                  {item.genre && item.genre.length > 0 && (
                    <p>
                      Generi:{" "}
                      {item.genre.map((genere) => genres[genere]).toString()}
                    </p>
                  )}
                  {getMoviePrices(item.value) && (
                    <Row justify="space-between">
                      <Col md={12}>
                        <h3>Acquista</h3>
                      </Col>
                      <Col md={12}>
                        <h3>Noleggia</h3>
                      </Col>
                    </Row>
                  )}
                  {getMoviePrices(item.value)[0] && (
                    <div>
                      <Row justify="space-between">
                        <Col md={12}>
                          <Select
                            style={{ width: 100 }}
                            onSelect={(value) => {
                              buy = value.split("-")[0];
                              vendor = value.split("-")[1];
                              console.log(value);
                            }}
                          >
                            {getMoviePrices(item.value)[0].vendors.map(
                              (vendor) => {
                                return (
                                  <>
                                    <Option value={vendor.sellPrice}>
                                      {`${vendor.sellPrice} - ${vendor.businessName}`}
                                    </Option>
                                  </>
                                );
                              }
                            )}
                          </Select>
                        </Col>

                        <Col md={12}>
                          <Select
                            style={{ width: 100 }}
                            onSelect={(value) => {
                              rent = value;
                            }}
                          >
                            {getMoviePrices(item.value)[0].vendors.map(
                              (vendor) => {
                                return (
                                  <>
                                    <Option
                                      value={`${vendor.rentPrice} - ${vendor.businessName}`}
                                    >
                                      {`${vendor.rentPrice} - ${vendor.businessName}`}
                                    </Option>
                                  </>
                                );
                              }
                            )}
                          </Select>
                        </Col>
                        <Col md={24}>
                          <Button
                            type="primary"
                            onClick={() =>
                              buyMovie(item.value, item.title, buy)
                            }
                          >
                            Acquista
                          </Button>
                          <Button
                            type="primary"
                            onClick={() =>
                              rentMovie(item.value, item.title, rent)
                            }
                          >
                            Noleggia per 72 ore
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  )}
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
            <a href="/user/UserPage">
              <UserOutlined />
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <a href="/user/Shop">
              <ShoppingOutlined />
            </a>
          </Menu.Item>
          <Menu.Item key="3">
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
        <h2>Dai tuoi generi preferiti</h2>

        <Row>
          {!loading &&
            movies.map((movie) => {
              return (
                <Row span={2}>
                  <Col justify="space-around" md={4}>
                    <Card
                      style={{ width: 240 }}
                      cover={
                        <img
                          alt="poster"
                          src={getPoster(movie.poster_path, 200)}
                        />
                      }
                    >
                      <Meta
                        title={movie.title}
                        description={`${movie.overview.slice(0, 100)}...`}
                      />
                    </Card>
                  </Col>
                </Row>
              );
            })}
        </Row>
      </Content>
    </Layout>
  );
}
