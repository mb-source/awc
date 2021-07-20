import { Card, Input, Row, Col, Layout, Menu, Select, Modal, Form } from "antd";
import { useState } from "react";
import styles from "../user/userhomepage.module.scss";
import Image from "next/image";
import { ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { getMovieList, getTopFourDirAct, getPoster } from "../logic/Api";
import genres from "../logic/utilities";
import { saveMovie } from "../logic/movieslogic";

const { Option } = Select;
const { Meta } = Card;
const { Header, Content } = Layout;

export default function BusinessHomePage() {
  const [films, setfilm] = useState([]);
  const [show, setShow] = useState(false);

  

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
      <Content>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
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
                  onOk: saveMovie(item.value,  ),
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
                            {item.genre
                              .map((genere) => genres[genere])
                              .toString()}
                          </p>

                          <Form.Item name="sellPrice" label="Prezzo di vendita">
                            <Input type="number"></Input>
                          </Form.Item>

                          <Form.Item
                            name="rentPrice"
                            label="Prezzo di noleggio"
                          >
                            <Input type="number"></Input>
                          </Form.Item>
                        </>
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
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
