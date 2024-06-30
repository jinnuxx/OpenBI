import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import AvatarUpload from '@/components/AvatarUpload';
import { useEffect } from 'react';

interface UpdataForm {
  updateModalOpen: string
  onCancel: () => void
  values: any
  onSubmit: (FormData: FormData) => void
}

interface FormData { userName: string; userAvatar: string, userProfile: string, userRole: string }

export default ({updateModalOpen, onCancel, values, onSubmit}: UpdataForm) => {
  const [form] = Form.useForm<FormData>();

  useEffect(() => {
    if(!!updateModalOpen) {
      form.setFieldsValue(values)
    }
  }, [updateModalOpen])

  const isDisabled = updateModalOpen === 'detail'
  return (
    <ModalForm
      width={600}
      title="User Details"
      open={!!updateModalOpen}
      form={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: onCancel,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        const res = await onSubmit(values)
        message.success('Submitted successfully!');
        return true;
      }}
      disabled={isDisabled}
      submitter={updateModalOpen === 'detail' ? false : {}}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="userAvatar"
          label="User Avatar"
          placeholder="Please enter user avatar URL."
        />
        <ProFormText
          width="md"
          name="userName"
          label="User Name"
          placeholder="Please enter user name."
        />
        <ProFormSelect
            width="md"
            name="userRole"
            label="User Role"
            valueEnum={{
              admin: 'Admin',
              user: 'User',
              // ban: 'Ban
            }}
            placeholder="Please select user role."
          />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width="lg"
          name="userProfile"
          label="User Profile"
          placeholder="Please enter user profile."
        />
      </ProForm.Group>
    </ModalForm>
  );
};
