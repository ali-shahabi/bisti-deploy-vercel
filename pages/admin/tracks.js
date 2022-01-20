import { Image, Input, notification, Select } from "antd";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import Actions from "../../components/common/Actions";
import AddModal from "../../components/Tracks/ModalForm";
import EditModal from "../../components/Tracks/ModalForm";
import TableList from "../../components/common/TableList";
import PrivateLayout from "../../layouts/PrivateLayout";
import Api from "../../tools/Api";
import Link from "next/link";

import PreviewImageModal from "../../components/common/PreviewImageModal";
import shared from "../../constants";
import { PlayCircleTwoTone } from "@ant-design/icons";

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

const Tracks = () => {
  const [tracksList, setTrackList] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
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
  const [albumListApiBody, setAlbumListApiBody] = useState({
    start: "0",
    limit: "10000",
  });

  const tracksListApi = () => {
    setLoading(true);
    Api.tracksList({ params: listApiBody })
      .then((res) => {
        if (res.status) {
          setTrackList(res.data);
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

  const albumListApi = () => {
    Api.albumList({ params: { ...albumListApiBody, start: 0, limit: 10000 } })
      .then((res) => {
        if (res.status) {
          const names = res.data.response;
          setAlbumList([...names]);
        }
      })
      .catch((err) => console.log(err));
  };

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

  const handleOrder = (value) => {
    setListApiBody({ ...listApiBody, orderBy: value });
    // tableListApi({ params: { ...listApiBody, orderBy: value } });
  };

  const handleSort = (value) => {
    setListApiBody({ ...listApiBody, sort: value });
    // tableListApi({ params: { ...listApiBody, orderBy: value } });
  };

  const handleFilterArtist = (value) => {
    console.log(value);
    setListApiBody({ ...listApiBody, artistId1: value });
    setAlbumListApiBody({ artistId: value });
    // tableListApi({ params: { ...listApiBody, orderBy: value } });
  };

  const handleFilterAlbum = (value) => {
    console.log(value);
    setListApiBody({ ...listApiBody, albumId: value });
    // tableListApi({ params: { ...listApiBody, orderBy: value } });
  };

  const handleSearch = (e) => {
    console.log(e.target.value);
    setListApiBody({ ...listApiBody, name: e.target.value });
  };

  useEffect(() => {
    tracksListApi();
    artistListApi();
    albumListApi();
    categoryListApi();
  }, []);

  useEffect(() => {
    tracksListApi();
  }, [listApiBody]);

  useEffect(() => {
    albumListApi();
  }, [albumListApiBody]);

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
      title: "نام",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 200,
      ellipsis: true,
    },
    {
      title: "آلبوم",
      dataIndex: "album",
      key: "album",
      width: 120,
      ellipsis: true,
      // eslint-disable-next-line react/display-name
      render: (el) => <span>{el.title}</span>,
    },
    {
      title: "هنرمند",
      dataIndex: "artist1",
      key: "artist1",
      width: 120,
      // eslint-disable-next-line react/display-name
      render: (el) => <span>{el.nickname}</span>,
    },
    {
      title: "کاور",
      dataIndex: "fileImage",
      key: "fileImage",
      align: "center",
      width: 100,
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
      title: "موسیقی",
      dataIndex: "fileMusic",
      key: "fileMusic",
      width: 100,
      align: "center",
      // eslint-disable-next-line react/display-name
      render: (el) => (
        <Link href={`${BASE_MUSIC_URL}${el?.name}`}>
          <a target="_blank">
            <PlayCircleTwoTone style={{ fontSize: "35px" }} />
          </a>
        </Link>
      ),
    },
    {
      title: "نام لاتین",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 120,
    },
    {
      title: "سئو",
      width: 120,
      dataIndex: "seoDescription",
      key: "seoDescription",
      ellipsis: true,
    },

    {
      title: "دسته بندی",
      dataIndex: "categoryId",
      key: "categoryId",
      width: 100,
      ellipsis: true,
      // eslint-disable-next-line react/display-name
      render: (el) => (
        <span>{categoryList?.filter((a) => a.id == el).pop()?.faname}</span>
      ),
    },
    {
      title: "درباره",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
    },
    {
      title: "کلمات کلیدی",
      dataIndex: "keywords",
      key: "keywords",
      width: 200,
      ellipsis: true,
    },
    {
      title: "slug",
      dataIndex: "slug",
      key: "slug",
      width: 120,
      ellipsis: true,
    },
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
          switchButton
          handleActivision={handleActivision}
        />
      ),
    },
  ];

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const showAddModal = () => {
    setIsEditModalVisible(true);
    setEditRowData(null);
  };

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
    Api.deleteTrack(id).then((res) => {
      if (res.status) {
        notification.success({ description: "موسیقی حذف شد" });
        tracksListApi();
      }
    });
  };

  const handleActivision = (param) => {
    Api.activeMusic(param).catch((err) => {
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

  console.log(listApiBody);

  return (
    <PrivateLayout>
      <TableList
        loading={loading}
        columns={columns}
        dataSource={tracksList?.response}
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
            <Select.Option id="artistId1" value="artistId1">
              هنرمند
            </Select.Option>
            <Select.Option id="albumId" value="albumId">
              آلبوم
            </Select.Option>
            <Select.Option id="title" value="title">
              عنوان آهنگ
            </Select.Option>
            <Select.Option id="status" value="status">
              فعال-غیر فعال
            </Select.Option>
          </Select>
        }
        filterByArtist={
          <Select
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            onSearch={(v) => console.log(v)}
            style={{ width: "150px" }}
            onChange={handleFilterArtist}
            placeholder="فیلتر بر اساس هنرمند :"
          >
            {artistList?.map((a) => (
              <Select.Option key={a.id} id={a.id} value={a.id}>
                {a.nickname}
              </Select.Option>
            ))}
          </Select>
        }
        filterByAlbum={
          <Select
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            onSearch={(v) => console.log(v)}
            style={{ width: "150px" }}
            onChange={handleFilterAlbum}
            placeholder="فیلتر بر اساس البوم :"
          >
            {albumList?.map((a) => (
              <Select.Option key={a.id} id={a.id} value={a.id}>
                {a.title}
              </Select.Option>
            ))}
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
            placeholder="جستوجو بر اساس عنوان آهنگ"
            allowClear
          />
        }
      />
      <AddModal
        setLoading={setLoading}
        tracksListApi={tracksListApi}
        showAddModal={showAddModal}
        handleAddModalOk={handleAddModalOk}
        handleAddModalCancel={handleAddModalCancel}
        isAddModalVisible={isAddModalVisible}
        handlePreviewImage={handlePreviewImage}
      />
      <EditModal
        handlePreviewImage={handlePreviewImage}
        data={editRowData}
        setLoading={setLoading}
        showEditModal={showEditModal}
        tracksListApi={tracksListApi}
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

export default Tracks;
