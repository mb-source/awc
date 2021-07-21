import { Layout, Menu, Col, Row, Breadcrumb } from 'antd';

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

    <Content style={{ textAlign: 'center', padding: '50px', marginTop: "60" }}>
      <div className={styles.content}>
      <Image src="/movie-time.png" width="400" height="250"/>
      </div>
    </Content>

    <Footer className={styles.footer}>
    <Row>
      <Col span={6}>Benvenuto in 
      <div className={styles.logo}><a href="/index.js"><Image src="/moviebook_clear.png" width="170" height="64"/></a></div>
      </Col>
      <Col span={6}>Contattaci: <br/> 356 6568 876 <br/> themooviebook@gmail.com
      </Col>
      <Col span={6}></Col>
    </Row>
    </Footer>

  </Layout>
  )
}
