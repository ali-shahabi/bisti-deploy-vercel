import "../styles/globals.scss";
import "antd/dist/antd.css";
import { ConfigProvider } from "antd";
import faIR from "antd/lib/locale/fa_IR";

function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider direction="rtl" locale={faIR}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;
