import {
  Card,
  Input,
  Row,
  Col,
  Button,
  Layout,
  Menu,
  Steps,
  Form,
  Popconfirm,
} from "antd";
import { useEffect, useState, message } from "react";
import styles from "./userhomepage.module.scss";
import Image from "next/image";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

export default function UserPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const { Step } = Steps;
  const [current, setCurrent] = useState(0);

    const next = () => {
      setCurrent(current + 1);
    };

    const prev = () => {
      setCurrent(current - 1);
    };

  const steps = [
    {
      title: "Carrello",
      content: "First-content",
    },
    {
      title: "Pagamento",
      content: (
        <Row>
          {!loading && (
            <Form
              layout="vertical"
              initialValues={{
                carta: user.info.pagamento,
                data: user.info.data,
                cvs: user.info.cvs,
                nominativo: user.info.nominativo,
              }}
            >
              <Col>
                <Form.Item label="Nominativo" name="nominativo" ><Input></Input></Form.Item>
              </Col>
              <Col>
                <Form.Item label="Data" name="data"></Form.Item>
              </Col>
              <Col>
                <Form.Item label="Carta" name="carta"></Form.Item>
              </Col>
              <Col>
                <Form.Item label="CVS" name="cvs"></Form.Item>
              </Col>
            </Form>
          )}
        </Row>
      ),
    },
    {
      title: "Completa L'acquisto",
      content: ""
    },
  ];

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
            <a href="/user/UserPage">
              <UserOutlined />
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
        <div className={styles.content}>
          <Steps current={current} >
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          
          <div className={styles.stepscontent}>{steps[current].content}</div>
          <div className={styles.stepsaction}>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Continua
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => message.success("Acquisto completato!")}
              >
                Acquista
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Indietro
              </Button>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
}
