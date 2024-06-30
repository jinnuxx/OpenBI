import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import React, { useEffect } from 'react';
import { history, useModel } from '@umijs/max';
// import AvatarUpload from '@/components/AvatarUpload';
import { updateMyUserUsingPOST, getLoginUserUsingGET } from '@/services/openbi/userController';
import { PageContainer } from '@ant-design/pro-components';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const [form] = Form.useForm()

  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  console.log(currentUser)

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

  useEffect(() => {
    form.setFieldsValue({
      userAvatar: currentUser?.userAvatar,
      userEmail: currentUser?.userEmail,
      userName: currentUser?.userName,
      userProfile: currentUser?.userProfile
    })
  }, [])
  const onFinish = async (values: any) => {
    console.log(values);
    // 调接口更新
    const res = await updateMyUserUsingPOST(values)
    if(res.code === 0) {
      message.success('Edit successfully！')
      fetchUserInfo()
    } else {
      message.error(res.message)
    }
  };

  return (
      <PageContainer
          ghost
          header={{
            title: 'Profile',
            breadcrumb: {},
            style: { textAlign: 'center' },
          }}
      >
      {/*<h1 >Profile</h1>*/}
      {/*<h4>Edit Your Profile:</h4>*/}
      {/*<br />*/}
      <Form form={form} name="signup" onFinish={onFinish}>
        <Form.Item
          name="userAvatar"
          rules={[
            {
              required: true,
              message: 'Please input your avatar!',
            },
          ]}
        >
          <Input placeholder="Avatar" />
          {/* <AvatarUpload /> */}
        </Form.Item>
        <Form.Item
          name="userEmail"
          rules={[
            {
              required: true,
              message: 'Please input your Email!',
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="userName"
          rules={[
            {
              required: true,
              message: 'Please input your userName!',
            },
          ]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="userProfile"
          rules={[
            {
              required: true,
              message: 'Please input your profile!',
            },
          ]}
        >
          <Input placeholder="Profile" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            submit
          </Button>
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default Profile;
