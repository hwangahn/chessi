import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/auth';
import socket from '../utils/socket';

export default function Login() {
  let navigate = useNavigate();

  let { useLogin } = useContext(AuthContext);

  const onFinish = async ( formData ) => {
    formData.socketid = socket.id;

    let { status, msg, profile } = await useLogin(formData);

    if (status === "ok") {
      message.success(msg);

      if (profile.isAdmin === "true") {
        navigate("/admin");
      }
      else {
        navigate("/");
      }
      
    } else {
      message.warning(msg);
    }
  };

  return (
    <Form
      name="login"
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
        <Input prefix={<UserOutlined/>} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined/>}
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{width: "100%"}}>
          Log in
        </Button>
      </Form.Item>
      <div style={{float: "left"}}>
        Or <Link to={"/signup"}>register now!</Link>
      </div>
      <div style={{float: "right", textAlign: "right"}}>
        <Link to={"/forgot-password"}>Forgot password?</Link>
      </div>
    </Form>
  );
};

