import { Layout, Menu, Breadcrumb } from "antd";
import { Form, Input, Button, Checkbox, message } from "antd";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./login.module.scss";

const { Header, Content, Footer } = Layout;

export default function login() {
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const u = JSON.parse(user);
      if (u.type === "businessUser") {
        window.location.href = "/business/BusinessHomePage";
      } else {
        window.location.href = "/user/UserHomePage";
      }
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
          defaultSelectedKeys={["2"]}
          style={{ float: "right", marginRight: "-10px" }}
        >
          <Menu.Item key="1">
            <a href="/PREsignup">Registrati</a>
          </Menu.Item>
          <Menu.Item key="2">
            <a href="#">Accedi</a>
          </Menu.Item>
        </Menu>
      </Header>

      <Content>
        <div className={styles.content}>
          <Form
            onFinish={(data) => {
              try {
                if (data.Negozio) {
                  let businessUsers = localStorage.getItem("businessUsers")
                    ? JSON.parse(localStorage.getItem("businessUsers"))
                    : [];

                  if (
                    businessUsers.find(
                      (el) =>
                        el.email === data.email && el.password === data.password
                    )
                  ) {
                    localStorage.setItem(
                      "user",
                      JSON.stringify({
                        type: "businessUser",
                        info: businessUsers.filter(
                          (el) => el.email === data.email
                        )[0],
                      })
                    );
                    window.location.href = "/business/BusinessHomePage";
                  } else {
                    return message.error("Credenziali errate");
                  }
                } else {
                  let privateUsers = localStorage.getItem("privateUser")
                    ? JSON.parse(localStorage.getItem("privateUser"))
                    : [];
                  if (
                    privateUsers.find(
                      (el) =>
                        el.email === data.email && el.password === data.password
                    )
                  ) {
                    localStorage.setItem(
                      "user",
                      JSON.stringify({
                        type: "privateUser",
                        info: privateUsers.filter(
                          (el) => el.email === data.email
                        )[0],
                      })
                    );
                    window.location.href = "/user/UserHomePage";
                  } else {
                    return message.error("Credenziali errate");
                  }
                }
              } catch (error) {
                console.log(error);
              }
            }}
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              label="Email"
              name="email"
              wrapperCol={{
                offset: 0,
                span: 7,
              }}
              rules={[
                {
                  required: true,
                  message: "Inserisci la tua email",
                },
              ]}
            >
              <Input type="email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              wrapperCol={{
                offset: 0,
                span: 7,
              }}
              rules={[
                {
                  required: true,
                  message: "Inserisci la tua password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="Negozio"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Checkbox>Negozio</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Accedi
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}
