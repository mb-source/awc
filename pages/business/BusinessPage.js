import { Card, Input, Row, Col, Button, Layout, Menu, Form, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import styles from "../user/userhomepage.module.scss";
import Image from "next/image";
import { ShoppingOutlined, HomeOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

export default function UserPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  function elimina() {
    let businessUser = localStorage.getItem("businessUsers")
      ? JSON.parse(localStorage.getItem("businessUsers"))
      : [];
    localStorage.setItem("businessUsers", JSON.stringify(businessUser.filter(item => item.email !== user.info.email )) )
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
            <a href="/BusinessHomePage">
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
        <>
          {!loading && (
            <Form
              onFinish={(data) => {
                let businessUser = localStorage.getItem("businessUsers")
                  ? JSON.parse(localStorage.getItem("businessUsers"))
                  : [];
                  businessUser.map((item) => {
                  if (item.email === user.email) {
                    return {
                      businessName: data.businessName,
                      email: data.email,
                      indirizzo: data.indirizzo,
                      password: data.password,
                      phoneNumber: data.phoneNumber,
                      vatNumber: data.vatNumber,
                      
                    };
                  } else {
                    return item;
                  }
                });
                localStorage.setItem(
                  "businessUsers",
                  JSON.stringify(businessUser)
                );

                window.location.href = "/business/BusinessHomePage";
              }}
              layout="vertical"
              initialValues={{
                prefix: "39",
                businessName: user.info.businessName,
                email: user.info.email,
                indirizzo: user.info.indirizzo,
                password: user.info.password,
                phoneNumber: user.info.phoneNumber,
                vatNumber: user.info.vatNumber,
              }}
            >
              <Form.Item
                label="Nome del Negozio"
                name="businessName"
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
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Inserisci una password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Telefono"
                name="phoneNumber"
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
                label="Partita IVA"
                name="vatNumber"
                rules={[
                  {
                    required: true,
                    message: "Inserisci una partita iva",
                  },
                  {
                    required: true,
                    message: "Campo obbligatorio",
                  },
                ]}
              >
                <Input />
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