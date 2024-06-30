import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import React from 'react';
import { userRegisterUsingPOST } from '@/services/openbi/userController';
import { history } from '@umijs/max';

const { Title, Text } = Typography;

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

const Signup: React.FC = () => {
  const onFinish = async (values: any) => {
    const res = await userRegisterUsingPOST({...values})
    if(res.code === 0) {
      message.success('注册成功')
      history.push(`/user/login`);
    } else {
      message.error(res.message)
    }
  };

    const toSignIn = () => {
        history.push('/user/login')
    }

  return (
    <div style={containerStyle}>
        <h1 style={{fontWeight:"bold"}}>OpenBI</h1>
        <br/>
        <p>The best tool to help you analyze diagrams!</p>
        <br/><br/>
      <Form name="signup" onFinish={onFinish}>
        {/* <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item> */}
        <Form.Item
          name="userAccount"
          rules={[
            {
              required: true,
              message: 'Please input your User Account!',
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
        <Form.Item
          name="checkPassword"
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
            },
          ]}
        >
          <Checkbox>I agree to the website usage agreement</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block style={buttonStyle}>
            Sign up
          </Button>
        </Form.Item>
          <Button type="default" block onClick={toSignIn} style={buttonStyle}>
              Log In
          </Button>
      </Form>
    </div>
  );
};

export default Signup;
