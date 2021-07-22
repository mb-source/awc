import {
  Card,
  Input,
  Row,
  Col,
  Layout,
  Menu,
  Select,
  Modal,
  Button,
  message,
} from "antd";
import { useState } from "react";
import styles from "./userhomepage.module.scss";
import Image from "next/image";
import { ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { getMovieList, getTopFourDirAct, getPoster } from "../logic/Api";
import genres from "../logic/utilities";
import { addToCart, getMoviePrices } from "../logic/movieslogic";

const { Option } = Select;
const { Meta } = Card;
const { Header, Content } = Layout;

export default function UserHomePage() {
  const [films, setfilm] = useState([]);
  const [show, setShow] = useState(false);
  const [cart, setCart] = useState();
  const [sellPrice, setSellPrice] = useState();
  const [rentPrice, setRentPrice] = useState();
  const [vendor, setVendor] = useState();

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

  function buyMovie(id, title) {
    console.log(sellPrice);
    if (!sellPrice) {
      return message.error("Seleziona prima un negozio da cui acquistare");
    } else {
      addToCart(setCart, id, title, 0, "Negozio", sellPrice);
      setSellPrice(undefined);
      console.log("Ok");
    }
  }

  function rentMovie(id, title) {
    console.log(rentPrice);
    if (!rentPrice) {
      return message.error("Seleziona prima un negozio da cui noleggiare");
    } else {
      addToCart(setCart, id, title, 1, "Negozio", rentPrice);
      setRentPrice(undefined);
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
                            onChange={(value) => setSellPrice(value)}
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
                            onChange={(value) => setRentPrice(value)}
                          >
                            {getMoviePrices(item.value)[0].vendors.map(
                              (vendor) => {
                                return (
                                  <>
                                    <Option value={vendor.rentPrice}>
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
                            onClick={() => buyMovie(item.value, item.title)}
                          >
                            Acquista
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => rentMovie(item.value, item.title)}
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
            <a href="/Shop">
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
        <div>
          {/* <Card
            hoverable
            style={{ width: 240 }}
            cover={<img src={getPoster(item.poster, 200)} />}
          >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card> */}
        </div>
      </Content>
    </Layout>
  );
}
