import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, RedoOutlined, MailOutlined } from '@ant-design/icons';

export default function Signup() {
  const onFinish = ( formData ) => {
    fetch("/api/signup", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        data: formData
      })
    })
    .then(res => { return res.json() } )
    .then(data => {
      (data.status == "ok") ? message.success(data.msg): message.error(data.msg);
    })
  };

  return (
    <Form
      name="signup"
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
          Register
        </Button>
      </Form.Item>
        Already have an account? <a href="/login">Login now!</a>
    </Form>
  );
};

