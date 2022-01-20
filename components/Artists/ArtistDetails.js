import { Drawer, Image, Input, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import Actions from "../../components/common/Actions";
import AddModal from "./Albums/ModalForm";
import EditModal from "./Albums/ModalForm";
import TableList from "../../components/common/TableList";
import PrivateLayout from "../../layouts/PrivateLayout";
import Api from "../../tools/Api";
import Link from "next/link";

import PreviewImageModal from "../../components/common/PreviewImageModal";
import shared from "../../constants";
import AlbumDetails from "./Albums/AlbumDetails";

const { BASE_URL, BASE_IMAGE_URL, BASE_MUSIC_URL } = shared;

const ArtistDetails = ({
  detailsData,
  detailsModalVisible,
  detailsModalClose,
}) => {
  const [albumList, setAlbumList] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRowData, setEditRowData] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [previewModal, setPreviewModal] = useState(false);
  const [totalItems, setTotalItems] = useState(false);
  const [artistDetailsData, setArtistDetailsData] = useState();
  const [artistDetailsModalVisible, setArtistDetailsModalVisible] =
    useState(false);
  const [listApiBody, setListApiBody] = useState({
    start: "0",
    limit: "10",
    orderBy: "id",
  });

  const albumListApi = () => {
    setLoading(true);
    Api.albumList({ params: { artistId: detailsData?.id } })
      .then((res) => {
        if (res.status) {
          setAlbumList(res.data);
          setLoading(false);
          setTotalItems(res.data.response_details.count);
        }
      })
      .catch((err) => {
        setLoading(false);
        notification.error({ description: "Sorry, Something Went Wrong!" });
      });
  };

  const artistListApi = () => {
    Api.artistList({ params: { start: 0, limit: 10000 } })
      .then((res) => {
        if (res.status) {
          const names = res.data.response;
          setArtistList([...names]);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    artistListApi();
  }, []);

  useEffect(() => {
    if (detailsModalVisible) {
      albumListApi({ start: 0, limit: 1000, artistId: detailsData?.id });
    }
  }, [detailsData]);

  const handleDetails = (data) => {
    setArtistDetailsData(data);
    handleDetailsModalClose();
  };

  const handleDetailsModalClose = () => {
    setArtistDetailsModalVisible((prev) => !prev);
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
      title: "عنوان",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      width: 150,
    },
    {
      title: "کاور آلبوم",
      dataIndex: "fileImage",
      key: "fileImage",
      width: 100,
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
      title: "هنرمند",
      dataIndex: "artist",
      key: "artist",
      width: 200,
      // eslint-disable-next-line react/display-name
      render: (el) => <span>{el.nickname}</span>,
    },

    {
      title: "عنوان فرعی",
      dataIndex: "subtitle",
      key: "subtitle",
    },

    // {
    //   title: 'کلمات کلیدی',
    //   dataIndex: 'keywords',
    //   key: 'keywords',
    //   ellipsis: true,
    // },
    // {
    //   title: "درباره",
    //   dataIndex: "description",
    //   key: "description",
    //   ellipsis: true,
    // },
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
    Api.deleteAlbum(id).then((res) => {
      if (res.status) {
        notification.success({ description: "آلبوم حذف شد" });
        albumListApi();
      }
    });
  };

  const handleActivision = (param) => {
    Api.activeAlbum(param).catch((err) => {
      console.log(err);
    });
  };

  return (
    <Drawer
      visible={detailsModalVisible}
      onClose={detailsModalClose}
      width={"80%"}
      placement="left"
      title={"جزییات هنرمند" + " : " + detailsData?.nickname}
    >
      <TableList
        loading={loading}
        columns={columns}
        dataSource={albumList?.response}
        showAddModal={showAddModal}
        rowKey="id"
      />
      <AddModal
        handlePreviewImage={handlePreviewImage}
        setLoading={setLoading}
        albumListApi={albumListApi}
        showAddModal={showAddModal}
        handleAddModalOk={handleAddModalOk}
        handleAddModalCancel={handleAddModalCancel}
        isAddModalVisible={isAddModalVisible}
      />
      <EditModal
        handlePreviewImage={handlePreviewImage}
        data={editRowData}
        setLoading={setLoading}
        showEditModal={showEditModal}
        albumListApi={albumListApi}
        handleEditModalOk={handleEditModalOk}
        handleEditModalCancel={handleEditModalCancel}
        isEditModalVisible={isEditModalVisible}
      />
      <PreviewImageModal
        visible={previewModal}
        src={previewImage}
        onCancel={cancelPreviewModal}
        width={500}
        height={500}
      />
      <AlbumDetails
        detailsData={artistDetailsData}
        detailsModalClose={handleDetailsModalClose}
        detailsModalVisible={artistDetailsModalVisible}
      />
    </Drawer>
  );
};

export default ArtistDetails;
