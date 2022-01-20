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
  Drawer,
  Popconfirm,
} from "antd";
import React, { useEffect, useState } from "react";
import Api from "../../tools/Api";
import ImgCrop from "antd-img-crop";
import Image from "next/image";
import TextArea from "antd/lib/input/TextArea";
import global from "../../utils/globals";
import FormButtons from "../common/FormButtons";
import shared from "../../constants";

const { BASE_URL, BASE_IMAGE_URL, BASE_MUSIC_URL } = shared;

const ModalForm = ({
  isEditModalVisible,
  handleEditModalOk,
  handleEditModalCancel,
  artistListApi,
  setLoading,
  handlePreviewImage,
  handlePreviewWideImage,
  data,
}) => {
  const [categories, setCategories] = useState();
  const [coverImage, setCoverImage] = useState([
    {
      uid: data ? data?.id : "-1",
      name: data ? data?.fileImage.nameThumbnail : "image.png",
      status: "done",
      url: data
        ? `${BASE_IMAGE_URL}${data?.fileImage.nameThumbnail}`
        : "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);

  const [wideProfileImage, setWideProfileImage] = useState([
    {
      uid: data ? data?.id : "-1",
      name: data ? data?.fileWide.nameThumbnail : "image.png",
      status: "done",
      url: data
        ? `http://image/${data?.fileWide.nameThumbnail}`
        : "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const [actionLoading, setActionLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    if (!isEditModalVisible && data) {
      form.resetFields();
    }
  }, [isEditModalVisible, form, data]);

  useEffect(() => {
    Api.categoryList({ params: { start: 0, limit: 10000 } })
      .then((res) => {
        setCategories(res.data.response);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(categories);

  useEffect(() => {
    if (isEditModalVisible) {
      form.setFieldsValue(data);
    }
  }, [isEditModalVisible, form, data]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        categoryIds: data?.categoryArtist.map((c) => c?.categoryId),
      });
      setCoverImage([
        {
          uid: data?.id,
          name: data?.fileImage.nameThumbnail,
          status: "done",
          url: `${BASE_IMAGE_URL}${data?.fileImage.nameThumbnail}`,
        },
      ]);
      setWideProfileImage([
        {
          uid: data?.id,
          name: data?.name,
          status: "done",
          url: `${BASE_IMAGE_URL}${data?.fileWide.nameThumbnail}`,
        },
      ]);
    } else {
      setCoverImage([]);
      setWideProfileImage([]);
    }
  }, [data, form]);

  useEffect(() => {
    Api.categoryList({ params: { start: 0, limit: 10000 } })
      .then((res) => {
        if (res.status) {
          const names = res.data.response;
          setCategoryList([...names]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const onImageChange = (info) => {
    setCoverImage(info.fileList);
    if (info.file.status === "done") {
      const { fileId } = info.file?.response?.response;

      form.setFieldsValue({ imageId: fileId });
    }
  };

  const onWideImageChange = (info) => {
    setWideProfileImage(info.fileList);
    if (info.file.status === "done") {
      const { fileId } = info.file?.response?.response;
      form.setFieldsValue({ wideImageId: fileId });
    }
  };

  const handleClearForm = () => {
    form.resetFields();
    setCoverImage([]);
    setWideProfileImage([]);
  };

  const onSearchCategory = (value) => {
    console.log(value);
  };

  const onFinish = (fields) => {
    if (fields.id) {
      setActionLoading(true);
      const keywordValues = [...fields.keywords].join("-");

      const values = { ...fields, keywords: keywordValues };
      Api.editArtist(values)
        .then((res) => {
          if (res.status) {
            notification.success({
              description: "هنرمند با موفقیت ویرایش شد",
              duration: 2,
            });
            form.resetFields();
            setActionLoading(false);
            handleEditModalOk();
            setLoading(true);
            setCoverImage([]);
            setWideProfileImage([]);
            artistListApi();
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
      Api.saveArtist(values)
        .then((res) => {
          if (res.status) {
            notification.success({
              description: "هنرمند با موفقیت اضافه شد",
              duration: 2,
            });
            form.resetFields();
            setActionLoading(false);
            handleEditModalOk();
            setLoading(true);
            setCoverImage([]);
            setWideProfileImage([]);
            artistListApi();
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
      title={data ? "ویرایش هنرمند" : "اضافه کردن هنرمند"}
      visible={isEditModalVisible}
      onClose={handleEditModalCancel}
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
        name={data ? "editArtist" : "addArtist"}
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
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="نام هنرمند به لاتین"
            name="enname"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="لقب"
            name="nickname"
          >
            <Input />
          </Form.Item>
        </Row>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label="دسته بندی ها"
          name="categoryIds"
        >
          <Select
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            mode="multiple"
            onSearch={onSearchCategory}
            style={{ minWidth: "500px" }}
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
        >
          <Select mode="tags" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label="درباره"
          name="description"
        >
          <TextArea autoSize style={{ width: "100%" }} />
        </Form.Item>
        <Row>
          <Col xs={12}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              label="آپلود تصویر هنرمند"
              name="imageId"
            >
              <ImgCrop quality={1} rotate>
                <Upload
                  action="/api/v0/file/upload"
                  headers={{
                    Authorization: "Bearer" + " " + global.getToken(),
                  }}
                  listType="picture-card"
                  fileList={coverImage}
                  onChange={onImageChange}
                  onPreview={(p) => handlePreviewImage(p)}
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
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="wideImageId"
              label="آپلود تصویر پشت زمینه پروفایل"
            >
              <Upload
                action="/api/v0/file/upload"
                headers={{
                  Authorization: "Bearer" + " " + global.getToken(),
                }}
                listType="picture-card"
                fileList={wideProfileImage}
                onChange={onWideImageChange}
                onPreview={(p) => handlePreviewWideImage(p)}
              >
                {wideProfileImage.length < 1 && "+ آپلود"}
              </Upload>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              hidden
              name="wideImageId"
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
