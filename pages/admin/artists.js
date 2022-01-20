import { Image, Input, notification, Select } from "antd";
import { useRouter } from "next/dist/client/router";
import Router from "next/dist/next-server/server/router";
import React, { useEffect, useState } from "react";
import Actions from "../../components/common/Actions";
import AddModal from "../../components/Artists/ModalForm";
import EditModal from "../../components/Artists/ModalForm";
import TableList from "../../components/common/TableList";
import PrivateLayout from "../../layouts/PrivateLayout";
import Api from "../../tools/Api";
import Link from "next/link";

import { PictureTwoTone } from "@ant-design/icons";
import PreviewImageModal from "../../components/common/PreviewImageModal";
import PreviewWideImageModal from "../../components/common/PreviewImageModal";
import shared from "../../constants";
import ArtistDetails from "../../components/Artists/ArtistDetails";

const { BASE_URL, BASE_IMAGE_URL, BASE_MUSIC_URL } = shared;

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie;
  let token = "";
  if (cookies && cookies.includes("token=")) {
    token = cookies.replace("token=", "");
  }
  if (token) {
    return {
      props: {
        data: cookies ? token : null,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

const Artists = () => {
  const [artistList, setArtistList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRowData, setEditRowData] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [previewModal, setPreviewModal] = useState(false);
  const [previewWideImage, setPreviewWideImage] = useState();
  const [previewWideModal, setPreviewWideModal] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [totalItems, setTotalItems] = useState(false);
  const [detailsData, setDetailsData] = useState();
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [listApiBody, setListApiBody] = useState({
    start: "0",
    limit: "10",
    orderBy: "id",
    sort: "desc",
  });

  const categoryListApi = () => {
    Api.categoryList()
      .then((res) => {
        if (res.status) {
          const names = res.data.response;
          setCategoryList([...names]);
        }
      })
      .catch((err) => console.log(err));
  };

  const artistListApi = () => {
    setLoading(true);
    Api.artistList({ params: listApiBody })
      .then((res) => {
        if (res.status) {
          setArtistList(res.data);
          setLoading(false);
          setTotalItems(res.data.response_details.count);
        }
      })
      .catch((err) => {
        setLoading(false);
        notification.error({ description: "Sorry, Something Went Wrong!" });
      });
  };

  const handleOrder = (value) => {
    setListApiBody({ ...listApiBody, orderBy: value });
    // tableListApi({ params: { ...listApiBody, orderBy: value } });
  };

  const handleSort = (value) => {
    setListApiBody({ ...listApiBody, sort: value });
    // tableListApi({ params: { ...listApiBody, orderBy: value } });
  };

  const handleSearch = (e) => {
    console.log(e.target.value);
    setListApiBody({ ...listApiBody, name: e.target.value });
  };

  useEffect(() => {
    artistListApi();
    categoryListApi();
  }, []);

  useEffect(() => {
    artistListApi();
  }, [listApiBody]);

  const handleDetailsModalClose = () => {
    setDetailsModalVisible((prev) => !prev);
  };

  const handleDetails = (data) => {
    setDetailsData(data);
    handleDetailsModalClose();
  };

  const columns = [
    {
      title: "#",
      key: "rowNumber",
      width: 80,
      align: "center",
      fixed: "left",
      // eslint-disable-next-line react/display-name
      render: (text, record, index) => (
        <span>{Number(listApiBody.start) + index + 1}</span>
      ),
    },
    {
      title: "لقب",
      dataIndex: "nickname",
      key: "nickname",
      fixed: "left",
    },

    {
      title: "تصویر هنرمند",
      dataIndex: "fileImage",
      key: "fileImage",
      width: 120,
      align: "center",
      // eslint-disable-next-line react/display-name
      render: (el) => (
        <Image
          alt="تصویر پیش زمینه"
          src={`${BASE_IMAGE_URL}${el?.nameThumbnail}`}
          height={60}
        />
      ),
    },
    {
      title: "تصویر پیش زمینه",
      dataIndex: "fileWide",
      key: "fileWide",
      width: 140,
      align: "center",
      // eslint-disable-next-line react/display-name
      render: (el) => (
        <Image
          alt="تصویر پیش زمینه"
          src={`${BASE_IMAGE_URL}${el?.nameThumbnail}`}
          height={60}
        />
      ),
    },
    {
      title: "نام",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "enname",
      dataIndex: "enname",
      key: "enname",
    },

    {
      title: " دسته بندی ها",
      dataIndex: "categoryArtist",
      key: "categoryArtist",
      width: 150,
      ellipsis: true,
      // eslint-disable-next-line react/display-name
      render: (el) => (
        <span>{el?.map((item) => item.category?.faname).join(" - ")}</span>
      ),
    },
    {
      title: "کلمات کلیدی",
      dataIndex: "keywords",
      key: "keywords",
      ellipsis: true,
    },
    {
      title: "درباره",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      key: "actions",
      title: "بیشتر",
      fixed: "right",
      width: 200,
      align: "center",
      // eslint-disable-next-line react/display-name
      render: (data) => (
        <Actions
          data={data}
          showEditModal={showEditModal}
          handleDelete={handleDelete}
          switchButton
          handleActivision={handleActivision}
          handleDetails={handleDetails}
        />
      ),
    },
  ];

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handlePreviewImage = (el) => {
    console.log("eh", el);
    setPreviewModal(true);
    setPreviewImage(
      el.nameThumbnail
        ? `${BASE_IMAGE_URL}${el?.nameThumbnail}`
        : el.url
        ? el.url
        : `${BASE_IMAGE_URL}${el?.response?.response?.nameThumbnail}`
    );
  };

  const cancelPreviewModal = () => {
    setPreviewModal(false);
    setPreviewImage(null);
  };

  const handlePreviewWideImage = (el) => {
    console.log("eh", el);
    setPreviewWideModal(true);
    setPreviewWideImage(
      el.nameThumbnail
        ? `${BASE_IMAGE_URL}${el?.nameThumbnail}`
        : el.url
        ? el.url
        : `${BASE_IMAGE_URL}${el?.response?.response?.nameThumbnail}`
    );
  };

  const cancelPreviewWideModal = () => {
    setPreviewWideModal(false);
    setPreviewWideImage(null);
  };

  const showAddModal = () => {
    setIsEditModalVisible(true);
    setEditRowData(null);
  };

  const handleAddModalOk = () => {
    setIsAddModalVisible(false);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const showEditModal = (data) => {
    const keywordsValues = [data.keywords].join().split("-");
    setEditRowData({ ...data, keywords: keywordsValues });
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = () => {
    setIsEditModalVisible(false);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleDelete = (id) => {
    setLoading(true);
    Api.deleteArtist(id).then((res) => {
      if (res.status) {
        notification.success({ description: "هنرمند حذف شد" });
        artistListApi();
      }
    });
  };

  const handleActivision = (param) => {
    Api.activeArtist(param).catch((err) => {
      console.log(err);
    });
  };

  const handlePagination = (current, pageSize) => {
    setListApiBody({
      ...listApiBody,
      start: current > 0 ? ((current - 1) * pageSize).toString() : "0",
      limit: pageSize.toString(),
    });
  };

  return (
    <PrivateLayout>
      <TableList
        loading={loading}
        columns={columns}
        dataSource={artistList?.response}
        showAddModal={showAddModal}
        rowKey="id"
        handlePagination={handlePagination}
        totalItems={totalItems}
        orderBy={
          <Select
            style={{ width: "150px" }}
            onChange={handleOrder}
            placeholder="نمایش بر اساس :"
          >
            <Select.Option id="id" value="id">
              تاریخ انتشار
            </Select.Option>
            <Select.Option id="nickname" value="nickname">
              لقب هنرمند
            </Select.Option>
            <Select.Option id="status" value="status">
              فعال-غیر فعال
            </Select.Option>
          </Select>
        }
        sortBy={
          <Select
            style={{ width: "150px" }}
            onChange={handleSort}
            placeholder="ترتیب نمایش :"
          >
            <Select.Option id="desc" value="desc">
              بالا به پایین
            </Select.Option>
            <Select.Option id="asc" value="asc">
              پایین به بالا
            </Select.Option>
          </Select>
        }
        searchInput={
          <Input
            onChange={handleSearch}
            style={{ width: "250px" }}
            placeholder="جستوجو بر اساس لقب هنرمند"
            allowClear
          />
        }
      />
      <AddModal
        setLoading={setLoading}
        artistListApi={artistListApi}
        showAddModal={showAddModal}
        handleAddModalOk={handleAddModalOk}
        handleAddModalCancel={handleAddModalCancel}
        isAddModalVisible={isAddModalVisible}
        handlePreviewImage={handlePreviewImage}
        handlePreviewWideImage={handlePreviewWideImage}
      />
      <EditModal
        data={editRowData}
        setLoading={setLoading}
        showEditModal={showEditModal}
        artistListApi={artistListApi}
        handleEditModalOk={handleEditModalOk}
        handleEditModalCancel={handleEditModalCancel}
        isEditModalVisible={isEditModalVisible}
        handlePreviewImage={handlePreviewImage}
        handlePreviewWideImage={handlePreviewWideImage}
      />
      <PreviewImageModal
        visible={previewModal}
        src={previewImage}
        onCancel={cancelPreviewModal}
        width={500}
        height={500}
      />
      <PreviewWideImageModal
        visible={previewWideModal}
        src={previewWideImage}
        onCancel={cancelPreviewWideModal}
        width={800}
        height={500}
        modalWidth={850}
      />
      <ArtistDetails
        detailsData={detailsData}
        detailsModalClose={handleDetailsModalClose}
        detailsModalVisible={detailsModalVisible}
      />
    </PrivateLayout>
  );
};

export default Artists;
