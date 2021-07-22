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
  Form,
  Input,
  Table
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
  getMovieInfo
} from "../logic/Api";
import genres from "../logic/utilities";
import {
  getMoviePrices,
  createOrder,
  getOrders,
  completeOrder,
} from "../logic/movieslogic";

const { Option } = Select;
const { Meta } = Card;
const { Header, Content } = Layout;

export default function UserHomePage() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [films, setfilm] = useState([]);
  const [movies, setMovies] = useState([]);
  const [visible, setVisible] = useState(false);
  const[ModalVisible,setIsModalVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const[orders, setOrders] = useState([])
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Film",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
  ]



  useEffect(async () => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u);
      const res = await getMoviesByGenre(u.info.genere);
      setMovies(res.results);
      setOrders(await orderList(u))
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

  function buyMovie(id, buy, vendor) {
    if (!buy) {
      return message.error("Seleziona prima un negozio da cui acquistare");
    } else {
      createOrder(user.info.email, vendor, id, buy, 0);
      setIsModalVisible(true);
    }
  }

  function rentMovie(id, rent, vendor) {
    if (!rent) {
      return message.error("Seleziona prima un negozio da cui noleggiare");
    } else {
      createOrder(user.info.email, vendor, id, rent, 1);
      setIsModalVisible(true);
    }
  }

  function order() {
    completeOrder();
    message.success("Acquisto completato!");
  }


  const orderList = async(u) => {
    const ids = getOrders();
    const o = [];
      const movie = await getMovieInfo(ids[movie]);
      const final = {
        ...movie,
      };
      o.push(final);
    return o;
  };
  

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
              maskClosable: true,
              closable: true,
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
                              buy = value.split(" - ")[0];
                              vendor = value.split(" - ")[1];
                            }}
                          >
                            {getMoviePrices(item.value)[0].vendors.map(
                              (vendor) => {
                                return (
                                  <>
                                    <Option
                                      value={`${vendor.sellPrice} - ${vendor.businessName}`}
                                    >
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
                              rent = value.split(" - ")[0];
                              vendor = value.split(" - ")[1];
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
                        <Col md={12}>
                          <Button
                            style={{margin: 10}}
                            type="primary"
                            onClick={() => buyMovie(item.value, buy, vendor)}
                          >
                            Acquista
                          </Button>
                          </Col>
                          <Col md={12}>
                          <Button
                          style={{margin: 8}}
                            type="primary"
                            onClick={() => {
                              rentMovie(item.value, rent, vendor);
                            }}
                          >
                            Noleggia 72h
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
          <h3>I miei film</h3>
          <Table
            className={styles.table}
            label="films"
            dataSource={[...orders]}
            columns={columns}
            size="middle"
          />
        </div>


        <h2>Consigli basati sul tuo genere preferito...</h2>
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

      <Modal visible={ModalVisible}
      maskClosable={true}
      closable={true}
      okText="Acquista"
      cancelText="Annulla"
      onCancel={() => handleCancel()}
      onOk={() => order()}>

        <div className={styles.stepscontent}>
          <Row>
          {!loading && (
            <Form
              layout="vertical"
              initialValues={{
                carta: user.info.pagamento,
                data: user.info.dataS,
                cvv: user.info.cvv,
                nominativo: user.info.nominativo,
              }}
            >
              <h3> Modalità di pagamento </h3>
              <Col>
                <Form.Item label="Nominativo" name="nominativo">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Data di scadenza" name="data">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Numero della carta" name="carta">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Cvv" name="cvv">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Form>
          )}
         </Row>
        </div>
      </Modal>
    </Layout>
  );
}

