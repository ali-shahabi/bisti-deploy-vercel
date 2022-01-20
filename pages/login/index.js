import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import PublicLayout from "../../layouts/PublicLayout";
import Api from "../../tools/Api";
import { useRouter } from "next/dist/client/router";
import Cookies from "js-cookie";

export async function getServerSideProps(context) {
  const { token } = context.req;
  if (token) {
    return {
      redirect: {
        destination: "/admin/artists",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        data: token ? token : null,
      },
    };
  }
}

const Login = () => {
  const router = useRouter();
  const onFinish = (values) => {
    Api.login(values)
      .then((res) => {
        Cookies.set("token", res.data.response.token);
        router.push("/admin/dashboard");
        message.success(res.data.message);
      })
      .catch((err) => message.error(err.response.data.message));
  };

  return (
    <PublicLayout>
      <Form
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: "3px",
          padding: "2rem",
          width: "400px",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        name="login"
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="موبایل"
          name="mobile"
          rules={[
            {
              required: true,
              message: "لطفا شماره موبایل خود را وارد کنید",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="پسورد"
          name="password"
          rules={[
            {
              required: true,
              message: "لطفا پسورد خود را وارد کنید",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            ورود
          </Button>
        </Form.Item>
      </Form>
    </PublicLayout>
  );
};

export default Login;
