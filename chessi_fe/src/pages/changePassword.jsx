import { useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, RedoOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/auth';

export default function ChangePassword() {
    let { accessToken } = useContext(AuthContext);

  const onFinish = async ( formData ) => {
    let rawData = await fetch('/api/change-password', {
      headers: {
        'authorization': 'Bearer ' + accessToken,
        "Content-Type": "application/json"
      },
      method: 'post', 
      body: JSON.stringify({
        data: formData
      })
    });

    let { status, msg } = await rawData.json();

    status === "ok" ? message.success(msg) : message.error(msg);
  };

  return (
    <Form
      name="forgot-password"
      onFinish={onFinish}
      style={{margin: "auto auto", marginTop: "300px", maxWidth: "300px"}}
    >
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
          () => ({
            validator(_, value) {
              if (value.length < 8) {
                return Promise.reject(new Error("Your password must be 8 characters or longer"));
              } else {
                let passwordFormat = RegExp(/^(\w*(([a-z]+[A-Z]+\d+)|([a-z]+\d+[A-Z]+)|([A-Z]+[a-z]+\d+)|([A-Z]+\d+[a-z]+)|(\d+[A-Z]+[a-z]+)|(\d+[a-z]+[A-Z]+))\w*)$/);
                if (!passwordFormat.test(value)) {
                  return Promise.reject(new Error("Password must contain at least one lowercase letter, one uppercase letter and one number and cannot contain special characters"));
                }
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item
        name="confirm"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<RedoOutlined />}
          placeholder="Confirm password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{width: "100%"}}>
          Change password
        </Button>
      </Form.Item>
    </Form>
  );
};

