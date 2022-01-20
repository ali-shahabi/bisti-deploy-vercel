import { Col, ConfigProvider, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import enUS from "antd/lib/locale/en_US";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PrivateLayout from "../../layouts/PrivateLayout";
import Api from "../../tools/Api";
import { formatDate } from "../../helpers/formatDate";

const Dashboard = () => {
  const [state, setState] = useState({ view: [], download: [] });
  const [dataView, setDataView] = useState();
  const [dataDownload, setDataDownload] = useState();

  const groupBy = (items, key) =>
    items?.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item],
      }),
      {}
    );

  useEffect(() => {
    Api.getDashboardReports({
      params: {
        startDate: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        endDate: formatDate(),
        sort: "desc",
        orderBy: "type",
      },
    })
      .then((res) => {
        const response = res?.data?.response?.map((item) => ({
          date: new Date(item.date).toLocaleString("en-US", {
            weekday: "short",
          }),
          type: item.type,
          count: item.count,
        }));

        setDataView(groupBy(response, "type"));
      })
      .catch((err) => console.log(err));
    Api.getDashboardReports({
      params: {
        startDate: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        endDate: formatDate(),
        report: "download",
        sort: "desc",
        orderBy: "type",
      },
    })
      .then((res) => {
        const response = res?.data?.response?.map((item) => ({
          date: new Date(item.date).toLocaleString("en-US", {
            weekday: "short",
          }),
          type: item.type,
          count: item.count,
        }));

        setDataDownload(groupBy(response, "type"));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <PrivateLayout>
      <ConfigProvider direction="rtl" locale={enUS}>
        <Row style={{ padding: "1rem 0" }}>
          <Col>
            <h6 style={{ padding: "0 20px", margin: 0 }}>
              مجموع بازدید موزیک ها
            </h6>
            <ResponsiveContainer width={400} height={300}>
              <LineChart
                height={300}
                width={400}
                data={dataView?.Mu}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" height={60} />
                <YAxis
                  tickMargin={60}
                  ticks={
                    dataView?.Mu && [
                      0,
                      Math?.max(...dataView?.Mu?.map((item) => item?.count)) /
                        2,
                      Math?.max(...dataView?.Mu?.map((item) => item?.count)),
                    ]
                  }
                />
                <Tooltip />

                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Col>
          <Col>
            <h6 style={{ padding: "0 20px", margin: 0 }}>
              مجموع بازدید آلبوم ها
            </h6>
            <ResponsiveContainer width={400} height={300}>
              <LineChart
                height={300}
                width={400}
                data={dataView?.Al}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" height={60} />
                <YAxis
                  tickMargin={60}
                  ticks={
                    dataView?.Al && [
                      0,
                      Math?.max(...dataView?.Al?.map((item) => item?.count)) /
                        2,
                      Math?.max(...dataView?.Al?.map((item) => item?.count)),
                    ]
                  }
                />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6 style={{ padding: "0 20px", margin: 0 }}>
              مجموع دانلود موزیک ها
            </h6>
            <ResponsiveContainer width={400} height={300}>
              <LineChart
                height={300}
                width={400}
                data={dataDownload?.Mu}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" height={60} />
                <YAxis
                  tickMargin={60}
                  ticks={
                    dataDownload?.Mu && [
                      0,
                      Math?.max(
                        ...dataDownload?.Mu?.map((item) => item?.count)
                      ) / 2,
                      Math?.max(
                        ...dataDownload?.Mu?.map((item) => item?.count)
                      ),
                    ]
                  }
                />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </ConfigProvider>
    </PrivateLayout>
  );
};

export default Dashboard;
