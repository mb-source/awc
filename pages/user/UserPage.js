import {
  Card,
  Input,
  Row,
  Col,
  Button,
  Layout,
  Menu,
  Form,
  Popconfirm,
} from "antd";
import { useEffect, useState, useRef } from "react";
import styles from "./userhomepage.module.scss";
import Image from "next/image";
import { ShoppingOutlined, HomeOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

export default function UserPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  const formRef = useRef();

  function elimina() {
    let privateUser = localStorage.getItem("privateUser")
      ? JSON.parse(localStorage.getItem("privateUser"))
      : [];
    localStorage.setItem(
      "privateUser",
      JSON.stringify(
        privateUser.filter((item) => item.email !== user.info.email)
      )
    );
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localStorage.getItem("user")));
      setLoading(false);
    } else {
      window.location.href = "/login";
    }
  }, []);

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
            <a href="/user/UserHomePage">
              <HomeOutlined />
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

      <Content
        style={{ textAlign: "center", padding: "50px", marginTop: "60" }}
      >
        <div className={styles.content}>
          <>
            {!loading && (
              <Form
                ref={formRef}
                onFinish={(data) => {
                  let privateUser = localStorage.getItem("privateUser")
                    ? JSON.parse(localStorage.getItem("privateUser"))
                    : [];
                  const users = privateUser.map((item) => {
                    if (item.email === user.info.email) {
                      return {
                        nome: data.nome,
                        cognome: data.cognome,
                        email: data.email,
                        password: data.password,
                        telefono: data.telefono,
                        indirizzo: data.indirizzo,
                        generi: item.generi,
                        pagamento: data.pagamento,
                        dataS: data.dataS,
                        nominativo: data.nominativo,
                        cvv: data.cvv,
                      };
                    } else {
                      return item;
                    }
                  });
                  localStorage.setItem("privateUser", JSON.stringify(users));
                  const u = users.filter((x) => x.email === user.info.email)[0];
                  const finalUser = { ...user, info: u };
                  localStorage.setItem("user", JSON.stringify(finalUser));

                  window.location.href = "/user/UserHomePage";
                }}
                layout="vertical"
                initialValues={{
                  prefix: "39",
                  nome: user.info.nome,
                  cognome: user.info.cognome,
                  email: user.info.email,
                  password: user.info.password,
                  telefono: user.info.telefono,
                  indirizzo: user.info.indirizzo,
                  pagamento: user.info.pagamento,
                  dataS: user.info.dataS,
                  nominativo: user.info.nominativo,
                  cvv: user.info.cvv,
                }}
              >
                <h3 style={{ float: "left" }}>I tuoi dati personali</h3> <br />
                <br />
                <Form.Item
                  label="Nome"
                  name="nome"
                  rules={[
                    {
                      required: true,
                      message: "Campo obbligatorio",
                    },
                  ]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  label="Cognome"
                  name="cognome"
                  rules={[
                    {
                      required: true,
                      message: "Campo obbligatorio",
                    },
                  ]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "Inserisci una email valida",
                    },
                    {
                      required: true,
                      message: "Campo obbligatorio",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Inserisci una password",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Telefono"
                  name="telefono"
                  rules={[
                    {
                      required: true,
                      message: "Inserisci un numero di telefono valido!",
                    },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
                <Form.Item
                  label="Indirizzo"
                  name="indirizzo"
                  rules={[
                    {
                      required: true,
                      message: "Inserisci un indirizzo!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
                <br />
                <br />
                <h4 style={{ float: "left" }}>Metodo di Pagamento</h4> <br />
                <br />
                <Form.Item
                  label="Numero della carta"
                  name="pagamento"
                  rules={[
                    {
                      required: true,
                      message: "Inserisci un metodo di pagamento!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Data di scadenza"
                  name="dataS"
                  rules={[
                    {
                      required: true,
                      message: "Inserisci un metodo di pagamento!",
                    },
                  ]}
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name="nominativo"
                  label="Nome e Cognome"
                  rules={[
                    {
                      required: true,
                      message: "Inserisci un metodo di pagamento!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="cvv"
                  label="CVV"
                  rules={[
                    {
                      required: true,
                      message: "Inserisci un metodo di pagamento!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Button
                  size="large"
                  htmlType="submit"
                  style={{ margin: 10 }}
                  onClick={() => formRef.current.submit()}
                >
                  Modifica
                </Button>
                <Popconfirm
                  title="Vuoi eliminare il tuo account???"
                  okText="Si"
                  onConfirm={() => elimina()}
                  cancelText="No"
                >
                  <a href="#">
                    <Button
                      size="large"
                      htmlType="button"
                      style={{ margin: 10 }}
                    >
                      Elimina
                    </Button>
                  </a>
                </Popconfirm>
              </Form>
            )}
          </>
        </div>
      </Content>
    </Layout>
  );
}
