import { Form, Input, Button, Select, Checkbox, message } from "antd";
import { Layout, Menu } from "antd";
import { useState, useEffect } from "react";
import styles from "./signup.module.scss";

const { Option } = Select;

const { Header, Content, Footer } = Layout;

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select style={{ width: 70 }}>
      <Option value="39">+39</Option>
    </Select>
  </Form.Item>
);

export const User = () => {
  const [stato, setStato] = useState();
  useEffect(() => {
    console.log(stato);
  }, [stato]);

  return (
    <Content style={{ textAlign: "center", padding: "50px", marginTop: "60" }}>
      <>
        <Form
          layout="vertical"
          initialValues={{
            prefix: "39",
          }}
          onFinish={(data) => {
            data = { ...data, genere: stato };
            let privateUser = localStorage.getItem("privateUser")
              ? JSON.parse(localStorage.getItem("privateUser"))
              : [];
            if (privateUser.find((el) => el.email === data.email)) {
              return message.error("Utente già registrato");
            }

            privateUser.push(data);
            localStorage.setItem("privateUser", JSON.stringify(privateUser));

            window.location.href = "/login";
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
            <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
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
            <Input
              id="numero"
              placeholder="Numero della carta"
              style={{ float: "left", width: "60%" }}
            />
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
            <Input
              type="date"
              id="data"
              style={{ float: "left", width: "30%" }}
            />
          </Form.Item>

          <Form.Item
            label="Nominativo"
            name="nominativo"
            rules={[
              {
                required: true,
                message: "Inserisci un metodo di pagamento!",
              },
            ]}
          >
            <Input
              id="id"
              placeholder="Nome e Cognome"
              style={{ float: "left", width: "60%" }}
            />
          </Form.Item>

          <Form.Item
            label="CVV"
            name="cvv"
            rules={[
              {
                required: true,
                message: "Inserisci un metodo di pagamento!",
              },
            ]}
          >
            <Input
              id="cvv"
              placeholder="CVV"
              style={{ float: "left", width: "30%" }}
            />
          </Form.Item>

          <Form.Item name="genere">
            <div className={styles.box}>
              Seleziona il tuo genere preferito:
              <div className={styles.generi}>
                <div
                  className={stato === 27 && styles.active}
                  onClick={() => setStato(27)}
                >
                  Horror
                </div>
                <div
                  className={stato === 18 && styles.active}
                  onClick={() => setStato(18)}
                >
                  Dramma
                </div>
                <div
                  className={stato === 12 && styles.active}
                  onClick={() => setStato(12)}
                >
                  Avventura
                </div>
                <div
                  className={stato === 28 && styles.active}
                  onClick={() => setStato(28)}
                >
                  Azione
                </div>
                <div
                  className={stato === 35 && styles.active}
                  onClick={() => setStato(35)}
                >
                  Commedia
                </div>
                <div
                  className={stato === 10749 && styles.active}
                  onClick={() => setStato(10749)}
                >
                  Romantico
                </div>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Accetta le condizioni")),
              },
            ]}
          >
            <Checkbox>
              Accetto le <a href="">condizioni</a>
            </Checkbox>
          </Form.Item>
          <Form.Item name="marketing" valuePropName="checked">
            <Checkbox>
              Selezionando accetti di ricevere offerte speciali in bacheca per
              la tipologia di genere preferito
            </Checkbox>
          </Form.Item>
          <Button size="large" htmlType="submit">
            Registrati
          </Button>
        </Form>
      </>
    </Content>
  );
};
