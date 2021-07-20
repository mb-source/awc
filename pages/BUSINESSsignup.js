import { Form, Input, Button, Select, Checkbox, message } from 'antd';
import { Layout, Menu } from 'antd';

const { Option } = Select;

const { Header, Content, Footer } = Layout;

const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="39">+39</Option>
      </Select>
    </Form.Item>
  );

  export const Business = () => {
    return (
    
      <Content style={{ textAlign: 'center', padding: '50px', marginTop: "60" }}>
        <>
        <Form
          layout="vertical"
          initialValues={{
            prefix: '39',
          }}
          onFinish={(data) => {
            let businessUsers = localStorage.getItem('businessUsers')
              ? JSON.parse(localStorage.getItem('businessUsers'))
              : [];
            if (businessUsers.find((el) => el.email === data.email)) {
              return message.error('Utente già registrato');
            }
            businessUsers.push(data);
            localStorage.setItem('businessUsers', JSON.stringify(businessUsers));
            window.location.href="/login"
  
          }}
        >
          <Form.Item
            label="Nome negozio"
            name="businessName"
            rules={[
              {
                required: true,
                message: 'Inserisci il nome del tuo negozio',
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
                type: 'email',
                message: 'Inserisci una email',
              },
              {
                required: true,
                message: 'Campo obbligatorio',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Inserisci una password',
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
                message: 'Inserisci un numero di telefono',
              },
            ]}
          >
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Partita IVA" name="vatNumber">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Indirizzo" name="indirizzo" rules={[
          {
            required: true,
            message: 'Inserisci un indirizzo!',
          },
        ]}
      >  
      <Input style={{ width: '100%' }} />
      </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Accetta le condizioni')),
              },
            ]}
          >
            <Checkbox>
              Accetto le <a href="">condizioni</a>
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
  