import { Button, Form, Input, Typography, message } from 'antd';
import React from 'react';
import { history, useModel } from '@umijs/max';
import { getLoginUserUsingGET, userLoginUsingPOST } from '@/services/openbi/userController';

const { Title, Text } = Typography;

interface FormValues {
  userAccount: string;
  userPassword: string;
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh', // This will make the container fill the viewport height
};

const buttonStyle: React.CSSProperties = {
  background: 'black',
  color: 'white',
  border: 'none',
};

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const res = await getLoginUserUsingGET()
    if(res.code === 0) {
      setInitialState((s) => ({
        ...s,
        currentUser: res.data,
      }));
      setTimeout(() => {
        history.push('/welcome')
      }, 0)
    }
  }

  const onFinish = async (values: FormValues) => {
    const res = await userLoginUsingPOST({...values})
    if(res.code === 0) {
      console.log("Login")
      console.log(res.data.id)
      document.cookie = 'userId=; Max-Age=-99999999;';
      document.cookie = `userId=${res.data.id}`;
      fetchUserInfo()
    } else {
      message.error(res.message)
    }
  };

  const toSignUp = () => {
    history.push('/user/signup')
  }

  return (
    <div style={containerStyle}>
      <h1 style={{fontWeight:"bold"}}>OpenBI</h1>
      <br/>
      <p>The best tool to help you analyze diagrams!</p>

      <br/><br/>
      <Form name="login" onFinish={onFinish}>
        <Form.Item
          name="userAccount"
          rules={[
            {
              required: true,
              message: 'Please input your user account!',
            },
          ]}
        >
          <Input placeholder="User Account" />
        </Form.Item>
        <Form.Item
          name="userPassword"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        {/* <Form.Item>
          <Link to="/forgot-password">Forgot your password?</Link>
        </Form.Item> */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block style={buttonStyle}>
            Log in
          </Button>


        </Form.Item>
        <Button type="default" block onClick={toSignUp} style={buttonStyle}>
          Sign Up
        </Button>
        <p style={{color:'transparent'}}>-----------------------------------------</p>


      </Form>
    </div>
  );
};
export default Login;
