import { Layout, Menu, Col, Row,  } from 'antd';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';


import Image from "next/image"

const { Header, Content, Footer } = Layout;

import styles from './index.module.scss'

export default function index(){


  return(
<Layout className={styles.layout} >
    <Header style={{padding:"0 !important", backgroundColor: "white"}}>
    <div className={styles.logo}><a href="/index.js"><Image src="/moviebook_clear.png" width="170" height="64"/></a></div>
      <Menu  mode="horizontal" style={{float: 'right', marginRight: '-10px',}}>
        <Menu.Item key="1"><a href="/PREsignup">Registrati</a></Menu.Item>
        <Menu.Item key="2"><a href="/login">Accedi</a></Menu.Item>
      </Menu>
    </Header>

    <Content className={styles.content}>
      <div style={{textAlign: 'center'}}>
      <Image src="/movie-time.png" width="400" height="250"/>
      </div>
    </Content>

    <Footer >
    <div className={styles.footer}>
    <Row>
      <Col span={7}>
      <div className={styles.logofooter}> <Image src="/moviebook_clear.png" width="190" height="80"/></div>
      </Col>
      <Col span={6}>Contattaci: <br/> <PhoneOutlined />356 6568 876 <br/> <MailOutlined /> themooviebook@gmail.com
      </Col>
    </Row>
    </div>
    </Footer>
  </Layout>
  )
}
