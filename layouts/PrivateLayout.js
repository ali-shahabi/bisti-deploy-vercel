import { Layout, Menu, Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import global from "../utils/globals";
import {
  DashboardOutlined,
  FolderOutlined,
  GroupOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";

const PrivateLayout = ({ children }) => {
  const { Content, Sider } = Layout;
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!global.getToken()) {
      router.push("/");
    }
    if (global.getToken()) {
      setLoading(false);
    }
  }, [router]);

  const handleClick = (e) => {
    // console.log('click ', e);
  };

  const handleLogout = () => {
    global.clearCookies();
    router.push("/");
  };

  const { pathname } = useRouter();
  // console.log(pathname);

  const onCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Layout>
      <Sider
        style={{ width: 200, height: "100vh", position: "fixed", right: 0 }}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <Menu
          onClick={handleClick}
          defaultSelectedKeys={[pathname]}
          mode="inline"
          theme="dark"
        >
          {/* <Menu.Item key='/dashboard'>
              <Link href='/dashboard'>
                <a>داشبورد</a>
              </Link>
            </Menu.Item> */}
          <Menu.Item key="/admin/dashboard" icon={<DashboardOutlined />}>
            <Link href="/admin/dashboard">
              <a>داشبورد</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/admin/artists" icon={<UserOutlined />}>
            <Link href="/admin/artists">
              <a>هنرمندان</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/admin/albums" icon={<FolderOutlined />}>
            <Link href="/admin/albums">
              <a>آلبوم ها</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/admin/tracks" icon={<PlayCircleOutlined />}>
            <Link href="/admin/tracks">
              <a>آهنگ ها</a>
            </Link>
          </Menu.Item>

          <Menu.Item key="/admin/categories" icon={<GroupOutlined />}>
            <Link href="/admin/categories">
              <a>دسته بندی ها</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/admin/playlists" icon={<UnorderedListOutlined />}>
            <Link href="/admin/playlists">
              <a>لیست های پخش</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/" onClick={handleLogout} icon={<LogoutOutlined />}>
            <Link href="/">
              <a>خروج</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Content
        style={{
          width: collapsed ? "calc(100% - 80px)" : "calc(100% - 200px)",
          height: "100vh",
          position: "fixed",
          left: 0,
          overflowY: "auto",
          transition: "all 0.2s",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default PrivateLayout;
