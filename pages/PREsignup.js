import { Layout, Menu, Breadcrumb } from 'antd';
import {User } from './USERsignup';
import {Business } from './BUSINESSsignup';
import { useEffect, useState } from 'react';
import { Select } from 'antd';
import Image from "next/image"
import styles from './signup.module.scss'

const { Header, Content, Footer } = Layout;

const options = [
    { label: 'Cliente', value: 'Cliente' },
    { label: 'Negozio', value: 'Negozio' },
    ];

export default function signup(){
    const [type, setType] = useState();

    useEffect(()=>{
      const user = localStorage.getItem('user');
      if (user) {
        const u = JSON.parse(user)
        if (u.type === "businessUser") {
          window.location.href="/BusinessHomePage";
        }else{
          window.location.href="/user/UserHomePage";
        }
      }
    },[])
    

  return(
<Layout className={styles.layout} >
    <Header style={{padding:"0 !important", backgroundColor: "white"}}>
    <div className={styles.logo}><a href="/"><Image src="/moviebook_clear.png" width="170" height="64"/></a> </div>
      <Menu  mode="horizontal" defaultSelectedKeys={['1']} style={{float: 'right', marginRight: '-10px',}}>
        <Menu.Item key="1"><a href="/PREsignup">Registrati</a></Menu.Item>
        <Menu.Item key="2"><a href="/login">Accedi</a></Menu.Item>
      </Menu>
    </Header>

    <Content style={{ textAlign: 'center', padding: '50px', marginTop: "60" }}>
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Registrati</h1>
      </div>
      <Select
        className={styles.select}
        placeholder="Che utente sei?"
        options={options}
        onChange={(t) => {
          setType(t);
        }}
      />
      <div className={styles.form}>
        {type === 'Cliente' && <User />}
        {type === 'Negozio' && <Business />}
      </div>
    </div>
    </Content>

  </Layout>
  )
}
