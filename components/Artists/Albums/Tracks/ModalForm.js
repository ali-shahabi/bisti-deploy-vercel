import {
  Form,
  Input,
  Modal,
  Button,
  Row,
  Upload,
  Col,
  notification,
  Select,
  Popconfirm,
  Drawer,
} from "antd";
import React, { useEffect, useState } from "react";
import Api from "../../../../tools/Api";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import global from "../../../../utils/globals";

import shared from "../../../../constants";

const { BASE_URL, BASE_IMAGE_URL, BASE_MUSIC_URL } = shared;

const ModalForm = ({
  isEditModalVisible,
  handleEditModalOk,
  handleEditModalCancel,
  tracksListApi,
  setLoading,
  handlePreviewImage,
  data,
}) => {
  const [coverImage, setCoverImage] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const [music, setMusic] = useState();
  const [actionLoading, setActionLoading] = useState(false);
  const [artistSelectOptions, setArtistSelectOptions] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [albumSelectOptions, setAlbumSelectOptions] = useState();
  const [albumNewSelectOptions, setAlbumNewSelectOptions] = useState();
  const [form] = Form.useForm();
  const { Option } = Select;

  console.log("dd", albumNewSelectOptions);
  console.log("data", data);

  useEffect(() => {
    artistListApi();
    albumListApi();
    categoryListApi();
  }, []);

  useEffect(() => {
    if (!isEditModalVisible && data) {
      form.resetFields();
    }
  }, [isEditModalVisible, form, data]);

  useEffect(() => {
    if (isEditModalVisible) {
      form.setFieldsValue(data);
    }
  }, [isEditModalVisible, form, data]);

  useEffect(() => {
    if (isEditModalVisible && data) {
      setAlbumNewSelectOptions(
        albumSelectOptions?.filter((a) => a.artistId == data.artistId1)
      );
    }
  }, [albumSelectOptions, data, isEditModalVisible]);

  useEffect(() => {
    if (data) {
      setCoverImage([
        {
          uid: "-1",
          name: data?.fileImage.nameThumbnail,
          status: "done",
          url: `${BASE_IMAGE_URL}${data?.fileImage.nameThumbnail}`,
        },
      ]);
      setMusic([
        {
          uid: "-1",
          name: data?.fileMusic?.name,
          status: "done",
          url: `${BASE_MUSIC_URL}${data?.fileMusic?.name}`,
        },
      ]);
    } else {
      setCoverImage([]);
      setMusic([]);
    }
  }, [data, form]);

  const artistListApi = () => {
    Api.artistList({ params: { start: 0, limit: 10000 } })
      .then((res) => {
        if (res.status) {
          const names = res.data.response;
          setArtistSelectOptions([...names]);
        }
      })
      .catch((err) => console.log(err));
  };
  const albumListApi = () => {
    Api.albumList({ params: { start: 0, limit: 10000 } })
      .then((res) => {
        if (res.status) {
          const names = res.data.response;
          setAlbumSelectOptions([...names]);
        }
      })
      .catch((err) => console.log(err));
  };

  const categoryListApi = () => {
    Api.categoryList({ params: { start: 0, limit: 10000 } })
      .then((res) => {
        if (res.status) {
          const names = res.data.response;
          setCategoryList([...names]);
        }
      })
      .catch((err) => console.log(err));
  };

  const onImageChange = (info) => {
    setCoverImage(info.fileList);
    if (info.file.status === "done") {
      const { fileId } = info.file?.response?.response;
      form.setFieldsValue({ imageId: fileId });
    }
  };

  const onMusicChange = (info) => {
    setMusic(info.fileList);
    if (info.file.status === "done") {
      const { fileId } = info.file?.response?.response;
      form.setFieldsValue({ fileId: fileId });
    }
  };

  const handleSelectArtist = (v) => {
    console.log(v);
    form.setFieldsValue({ albumId: "" });
    const filteredAlbumsOfArtist = albumSelectOptions.filter(
      (a) => a.artistId == v
    );
    console.log(filteredAlbumsOfArtist);
    setAlbumNewSelectOptions(filteredAlbumsOfArtist);
  };

  const handleClearForm = () => {
    form.resetFields();
    setCoverImage([]);
    setMusic([]);
  };

  const onSearchArtist = (value) => {
    console.log(value);
  };

  const onSearchَAlbum = (value) => {
    console.log(value);
  };

  const onSearchَCategory = (value) => {
    console.log(value);
  };

  const onFinish = (fields) => {
    if (fields.id) {
      setActionLoading(true);
      const keywordValues = [...fields.keywords].join("-");
      const values = { ...fields, keywords: keywordValues };
      Api.editTrack(values)
        .then((res) => {
          if (res.status) {
            notification.success({
              description: "موسیقی با موفقیت ویرایش شد",
              duration: 2,
            });
            form.resetFields();
            setActionLoading(false);
            handleEditModalOk();
            setLoading(true);
            setCoverImage([]);
            setMusic([]);
            tracksListApi();
          }
        })
        .catch((err) => {
          console.log(err);
          setActionLoading(false);
        });
    } else {
      setActionLoading(true);
      const keywordValues = [...fields.keywords].join("-");
      const values = { ...fields, keywords: keywordValues };
      Api.saveTrack(values)
        .then((res) => {
          if (res.status) {
            notification.success({
              description: "موسیقی با موفقیت اضافه شد",
              duration: 2,
            });
            form.resetFields();
            setActionLoading(false);
            handleEditModalOk();
            setLoading(true);
            setCoverImage([]);
            setMusic([]);
            tracksListApi();
          }
        })
        .catch((err) => {
          console.log(err);
          setActionLoading(false);
        });
    }
  };
  return (
    <Drawer
      title={data ? "ویرایش موسیقی" : "اضافه کردن موسیقی"}
      visible={isEditModalVisible}
      onClose={handleEditModalOk}
      width={750}
      placement="left"
      footer={
        <Row justify="space-between">
          <Form.Item>
            <Popconfirm
              title="از پاک کردن فرم مطمئن هستید؟"
              onConfirm={handleClearForm}
              okText="بله"
              cancelText="خیر"
            >
              <Button danger type="primary">
                پاک کردن
              </Button>
            </Popconfirm>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              loading={actionLoading}
              onClick={() => {
                form.submit();
              }}
            >
              تایید
            </Button>
          </Form.Item>
        </Row>
      }
    >
      <Form
        validateMessages={{ required: "* پر کردن این فیلد الزامی است" }}
        name={data ? "editTrack" : "addTrack"}
        layout="vertical"
        onFinish={onFinish}
        form={form}
      >
        {data ? (
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            name="id"
            hidden
          >
            <Input />
          </Form.Item>
        ) : null}
        <Row justify="space-between">
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="نام"
            name="name"
          >
            <Input style={{ width: "200px" }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="نام لاتین"
            name="title"
          >
            <Input style={{ width: "200px" }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="SEO Description"
            name="seoDescription"
          >
            <Input style={{ width: "200px" }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="هنرمند"
            name="artistId1"
          >
            <Select
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              onSearch={onSearchArtist}
              style={{ width: "200px" }}
              onChange={handleSelectArtist}
            >
              {artistSelectOptions?.map((a) => (
                <Option value={a.id} key={a.id}>
                  {a.nickname}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="هنرمند دوم" name="artistId2">
            <Select
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              onSearch={onSearchArtist}
              style={{ width: "200px" }}
            >
              {artistSelectOptions?.map((a) => (
                <Option value={a.id} key={a.id}>
                  {a.nickname}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="آلبوم"
            name="albumId"
          >
            <Select
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              onSearch={onSearchَAlbum}
              style={{ width: "200px" }}
            >
              {albumNewSelectOptions?.map((a) => (
                <Option value={a.id} key={a.id}>
                  {a.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="دسته بندی"
            name="categoryId"
          >
            <Select
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              onSearch={onSearchَCategory}
              style={{ width: "200px" }}
            >
              {categoryList?.map((a) => (
                <Option value={a.id} key={a.id}>
                  {a.faname}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="کلمات کلیدی"
            name="keywords"
            style={{ width: "100%" }}
          >
            <Select mode="tags" style={{ width: "100%" }} />
          </Form.Item>
        </Row>

        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label="درباره"
          name="description"
        >
          <TextArea
            autoSize={{ minRows: 2, maxRows: 20 }}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Row justify="space-between">
          <Col xs={12}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              label="آپلود کاور موسیقی"
              name="imageId"
            >
              <ImgCrop quality={1} rotate>
                <Upload
                  onPreview={(p) => handlePreviewImage(p)}
                  action="/api/v0/file/upload"
                  headers={{
                    Authorization: "Bearer" + " " + global.getToken(),
                  }}
                  listType="picture-card"
                  fileList={coverImage}
                  onChange={onImageChange}
                >
                  {coverImage.length < 1 && "+ آپلود"}
                </Upload>
              </ImgCrop>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="imageId"
              hidden
            >
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={12}>
            {" "}
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ marginLeft: "2rem" }}
              label="آپلود موسیقی"
              name="fileId"
            >
              <Upload
                action="/api/v0/file/upload"
                headers={{
                  Authorization: "Bearer" + " " + global.getToken(),
                }}
                accept=".mp3"
                listType="text"
                fileList={music}
                onChange={onMusicChange}
              >
                <Button icon={<UploadOutlined />}>برای آپلود کلیک کنید</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="fileId"
              hidden
            >
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default ModalForm;
