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
import Api from "../../tools/Api";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/lib/input/TextArea";
import global from "../../utils/globals";
import FormButtons from "../common/FormButtons";
import shared from "../../constants";

const { BASE_URL, BASE_IMAGE_URL, BASE_MUSIC_URL } = shared;

const ModalForm = ({
  isEditModalVisible,
  handleEditModalOk,
  handleEditModalCancel,
  categoryListApi,
  setLoading,
  data,
  handlePreviewImage,
}) => {
  const [coverImage, setCoverImage] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);

  const [actionLoading, setActionLoading] = useState(false);
  const [artistSelectOptions, setArtistSelectOptions] = useState();
  const [form] = Form.useForm();
  const { Option } = Select;

  // const artistListApi = () => {
  //   Api.artistList()
  //     .then((res) => {
  //       if (res.status) {
  //         const names = res.data.response;
  //         setArtistSelectOptions([...names]);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  // useEffect(() => {
  //   artistListApi();
  // }, []);

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
    if (data) {
      setCoverImage([
        {
          uid: data?.id,
          name: data?.name,
          status: "done",
          url: `${BASE_IMAGE_URL}${data?.fileImage.nameThumbnail}`,
        },
      ]);
    } else {
      setCoverImage([]);
    }
  }, [data, form]);

  const onImageChange = (info) => {
    setCoverImage(info.fileList);
    if (info.file.status === "done") {
      const { fileId } = info.file?.response?.response;
      form.setFieldsValue({ imageId: fileId });
    }
  };

  const handleClearForm = () => {
    form.resetFields();
    setCoverImage([]);
  };

  const onFinish = (fields) => {
    if (fields.id) {
      setActionLoading(true);
      const values = { ...fields };
      Api.editCategory(values)
        .then((res) => {
          if (res.status) {
            notification.success({
              description: "دسته بندی با موفقیت ویرایش شد",
              duration: 2,
            });
            form.resetFields();
            setActionLoading(false);
            handleEditModalOk();
            setLoading(true);
            setCoverImage([]);
            categoryListApi();
          }
        })
        .catch((err) => {
          console.log(err);
          setActionLoading(false);
        });
    } else {
      setActionLoading(true);
      const values = { ...fields };
      Api.saveCategory(values)
        .then((res) => {
          if (res.status) {
            notification.success({
              description: "دسته بندی با موفقیت اضافه شد",
              duration: 2,
            });
            form.resetFields();
            setActionLoading(false);
            handleEditModalOk();
            setLoading(true);
            setCoverImage([]);
            categoryListApi();
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
      title={data ? "ویرایش دسته بندی" : "اضافه کردن دسته بندی"}
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
        name={data ? "editCategory" : "addCategory"}
        layout="vertical"
        onFinish={onFinish}
        form={form}
      >
        {data && (
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
        )}
        <Row justify="space-between">
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="نام فارسی"
            name="faname"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label="نام لاتین"
            name="enname"
          >
            <Input />
          </Form.Item>
          <Form.Item></Form.Item>
          <Form.Item></Form.Item>
        </Row>
        {/* <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label='هنرمند'
            name='artistId'
          >
            <Select style={{ width: '200px' }}>
              {artistSelectOptions?.map((a) => (
                <Option value={a.id} key={a.id}>
                  {a.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

        {/* <Row style={{ width: '100%' }}>
          <Col xs={24}>
            <Form.Item  rules={[
          {
            required: true,
          },
        ]}label='کلمات کلیدی' name='keywords'>
              <Select mode='tags' style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row> */}
        {/* <Row style={{ width: '100%' }}>
          <Col xs={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              label='درباره'
              name='description'
            >
              <TextArea style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row> */}

        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label="آپلود تصویر دسته بندی"
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
      </Form>
    </Drawer>
  );
};

export default ModalForm;
