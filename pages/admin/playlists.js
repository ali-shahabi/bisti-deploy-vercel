import { Image, notification } from "antd";
import React, { useEffect, useState } from "react";
import Actions from "../../components/common/Actions";
import AddModal from "../../components/Playlist/ModalForm";
import EditModal from "../../components/Playlist/ModalForm";
import TableList from "../../components/common/TableList";
import PrivateLayout from "../../layouts/PrivateLayout";
import Api from "../../tools/Api";
import Link from "next/link";

import PreviewImageModal from "../../components/common/PreviewImageModal";
import shared from "../../constants";

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

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRowData, setEditRowData] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [previewModal, setPreviewModal] = useState(false);
  const [totalItems, setTotalItems] = useState(false);
  const [listApiBody, setListApiBody] = useState({
    start: "0",
    limit: "10",
    orderBy: "id",
  });

  const playlistsApi = () => {
    setLoading(true);
    Api.playlists()
      .then((res) => {
        if (res.status) {
          setPlaylists(res.data);
          setLoading(false);
          setTotalItems(res.data.response_details.count);
        }
      })
      .catch((err) => {
        setLoading(false);
        notification.error({ description: "Sorry, Something Went Wrong!" });
      });
  };

  useEffect(() => {
    playlistsApi();
  }, []);

  useEffect(() => {
    playlistsApi();
  }, [listApiBody]);

  const columns = [
    // {
    //   title: 'هنرمند',
    //   dataIndex: 'artistId',
    //   key: 'artistId',
    //   // eslint-disable-next-line react/display-name
    //   render: (el) => (
    //     <span>{artistList?.filter((a) => a.id == el).pop()?.name}</span>
    //   ),
    // },
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
      title: "نام ",
      dataIndex: "title",
      key: "title",
      fixed: "left",
    },
    {
      title: "کاور ",
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
      title: "محتوا",
      dataIndex: "content",
      key: "content",
    },

    // {
    //   title: 'کلمات کلیدی',
    //   dataIndex: 'keywords',
    //   key: 'keywords',
    //   ellipsis: true,
    // },
    // {
    //   title: 'درباره',
    //   dataIndex: 'description',
    //   key: 'description',
    //   ellipsis: true,
    // },
    {
      key: "actions",
      title: "بیشتر",
      fixed: "right",
      width: 150,
      align: "center",
      // eslint-disable-next-line react/display-name
      render: (data) => (
        <Actions
          data={data}
          showEditModal={showEditModal}
          handleDelete={handleDelete}
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
    Api.deletePLaylist(id)
      .then((res) => {
        if (res.status) {
          notification.success({ description: "لیست پخش حذف شد" });
          playlistsApi();
        }
      })
      .catch((err) => console.log(err));
  };

  const handlePagination = (current, pageSize) => {
    setListApiBody({
      start: current > 0 ? ((current - 1) * pageSize).toString() : "0",
      limit: pageSize.toString(),
      orderBy: "id",
    });
  };

  return (
    <PrivateLayout>
      <TableList
        loading={loading}
        columns={columns}
        dataSource={playlists?.response}
        showAddModal={showAddModal}
        rowKey="id"
        handlePagination={handlePagination}
        totalItems={totalItems}
      />
      <AddModal
        handlePreviewImage={handlePreviewImage}
        setLoading={setLoading}
        playlistApi={playlistsApi}
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
        playlistApi={playlistsApi}
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
    </PrivateLayout>
  );
};

export default Playlists;
