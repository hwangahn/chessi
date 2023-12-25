import { Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';

export default function ForgotPassword() {
  const onFinish = async ( formData ) => {
    let rawData = await fetch('/api/reset-password', {
      headers: {
        "Content-Type": "application/json",
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
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your Email!',
          },
          () => ({
            validator(_, value) {
              let emailFormat = RegExp(/^[\w\.]+@\w+\.\w+$/);
              if (!emailFormat.test(value)) {
                return Promise.reject(new Error("Please enter a valid email address"));
              } 
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{width: "100%"}}>
          Obtain new password
        </Button>
      </Form.Item>
      Remember your password? <Link to={"/login"}>Login now!</Link>
    </Form>
  );
};

