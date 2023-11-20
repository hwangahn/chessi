import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/auth';
import socket from '../utils/socket';

export default function Login() {
  let navigate = useNavigate();

  let { useLogin } = useContext(AuthContext);

  const onFinish = async ( formData ) => {
    formData.socketID = socket.id;

    let { status, msg } = await useLogin(formData);

    if (status === "ok") {
      message.success(msg);

      navigate("/");
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
      Or <Link to={"/signup"}>register now!</Link>
      <Button onClick={() => socket.disconnect()}>Disconnect socket</Button>
    </Form>
  );
};

