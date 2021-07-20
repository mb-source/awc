import { Card, Input, Row, Col, Button, Layout, Menu, Form, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import styles from "./userhomepage.module.scss";
import Image from "next/image";
import { ShoppingOutlined, HomeOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

export default function UserPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();


  function elimina() {
    let privateUser = localStorage.getItem("privateUser")
      ? JSON.parse(localStorage.getItem("privateUser"))
      : [];
    localStorage.setItem("privateUser", JSON.stringify(privateUser.filter(item => item.email !== user.info.email )) )
    localStorage.removeItem("user")
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
            <a href="/UserHomePage">
              <HomeOutlined />
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

      <Content
        style={{ textAlign: "center", padding: "50px", marginTop: "60" }}
      >
        <>
          {!loading && (
            <Form
              onFinish={(data) => {
                let privateUser = localStorage.getItem("privateUser")
                  ? JSON.parse(localStorage.getItem("privateUser"))
                  : [];
                privateUser.map((item) => {
                  if (item.email === user.email) {
                    return {
                      nome: data.nome,
                      cognome: data.cognome,
                      email: data.email,
                      password: data.password,
                      telefono: data.telefono,
                      indirizzo: data.indirizzo,
                      generi: item.generi,
                      numero: data.numero,
                      data: data.data,
                      id: data.id,
                      cvs: data.cvs
                    };
                  } else {
                    return item;
                  }
                });
                localStorage.setItem(
                  "privateUser",
                  JSON.stringify(privateUser)
                );

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
                numero: user.info.numero,
                data: user.info.data,
                id: user.info.id,
                cvs: user.info.cvs
              }}
            >
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


            <Form.Item
            label="Metodo di Pagamento"
            name="pagamento"
            rules={[
              {
                required: true,
                message: "Inserisci un metodo di pagamento!",
              },
            ]}
          >
            <Input id="numero" placeholder="Numero della carta" style={{ width: "60%" }}/>
            <Input type="date" id="data"  style={{ width: "30%" }} />
            <Input id="id" placeholder="Nome e Cognome" style={{ width: "60%" }}/>
            <Input id="cvs" placeholder="CVS" style={{ width: "30%" }} />
            
          </Form.Item>



              <Button size="large" htmlType="submit">
                Modifica
              </Button>
              <Popconfirm
                title="Vuoi eliminare il tuo account？"
                okText="Si"
                onConfirm= {() => elimina()}
                cancelText="No"
              >
                <a href="#">
                  <Button
                    size="large"
                    htmlType="button"
                    
                  >
                    Elimina
                  </Button>
                </a>
              </Popconfirm>
            </Form>
          )}
        </>
      </Content>
    </Layout>
  );
}
