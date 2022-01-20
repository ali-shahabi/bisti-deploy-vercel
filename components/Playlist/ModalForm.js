import {
  Form,
  Input,
  Drawer,
  Button,
  Row,
  Upload,
  Col,
  notification,
  Select,
  Popconfirm,
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
  playlistApi,
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

  const [actionLoading, setActionLoading] = useState(false);
  const [categorySelectOptions, setCategorySelectOptions] = useState();
  const [tracksSelectOptions, setTracksSelectOptions] = useState();
  const [tracksList, setTracksList] = useState();
  const [form] = Form.useForm();
  const { Option } = Select;

  const categoriesApi = () => {
    Api.categoryList({ params: { start: 0, limit: 10000 } })
      .then((res) => {
        if (res.status) {
          const names = res.data.response;
          setCategorySelectOptions([...names]);
        }
      })
      .catch((err) => console.log(err));
  };

  const tracksListApi = () => {
    Api.tracksList({ params: { start: 0, limit: 100000 } })
      .then((res) => {
        if (res.status) {
          const tracks = res.data.response;
          setTracksList([...tracks]);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    categoriesApi();
    tracksListApi();
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
    if (data) {
      setCoverImage([
        {
          uid: data?.id,
          name: data?.name,
          status: "done",
          url: `${BASE_IMAGE_URL}${data?.fileImage?.nameThumbnail}`,
        },
      ]);
    } else {
      setCoverImage([]);
    }
  }, [data, form]);

  useEffect(() => {
    if (data) {
      const filteredTracksOfCategory = tracksList?.filter(
        (a) => a.categoryId == data.categoryId
      );
      console.log(filteredTracksOfCategory);
      setTracksSelectOptions(filteredTracksOfCategory);
    }
  }, [data, form, tracksList]);

  useEffect(() => {
    if (data) {
      let result = data?.musicList?.map(({ musicId }) => musicId);
      console.log("result", result);
      form.setFieldsValue({ musicIds: result });
    }
  }, [data, form]);

  const onImageChange = (info) => {
    setCoverImage(info.fileList);
    if (info.file.status === "done") {
      const { fileId } = info.file?.response?.response;
      form.setFieldsValue({ imageId: fileId });
    }
  };

  const handleSelectCategory = (v) => {
    console.log(v);
    form.setFieldsValue({ musicIds: [] });
    const filteredTracksOfCategory = tracksList.filter(
      (a) => a.categoryId == v
    );
    console.log(filteredTracksOfCategory);
    setTracksSelectOptions(filteredTracksOfCategory);
  };

  const handleClearForm = () => {
    form.resetFields();
    setCoverImage([]);
  };

  const onSearchCategory = (value) => {
    console.log(value);
  };

  const onSearchMusic = (value) => {
    console.log(value);
  };

  const onFinish = (fields) => {
    if (fields.id) {
      setActionLoading(true);
      const values = { ...fields };
      Api.editPLaylist(values)
        .then((res) => {
          if (res.status) {
            notification.success({
              description: "لیست پخش با موفقیت ویرایش شد",
              duration: 2,
            });
            form.resetFields();
            setActionLoading(false);
            handleEditModalOk();
            setLoading(true);
            setCoverImage([]);
            playlistApi();
          }
        })
        .catch((err) => {
          console.log(err);
          setActionLoading(false);
        });
    } else {
      setActionLoading(true);
      const values = { ...fields };
      Api.savePLaylist(values)
        .then((res) => {
          if (res.status) {
            notification.success({
              description: "لیست پخش با موفقیت اضافه شد",
              duration: 2,
            });
            form.resetFields();
            setActionLoading(false);
            handleEditModalOk();
            setLoading(true);
            setCoverImage([]);
            playlistApi();
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
      title={data ? "ویرایش لیست پخش" : "اضافه کردن لیست پخش"}
      visible={isEditModalVisible}
      onClose={handleEditModalOk}
      width={750}
      placement="left"
      footer={
        <Row justify="space-between" gutter={[20, 0]}>
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
        name={data ? "editPlaylist" : "add{addPlaylist"}
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
            label="نام "
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
            label="محتوا "
            name="content"
          >
            <Input style={{ width: "200px" }} />
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
              onSearch={onSearchCategory}
              style={{ width: "200px" }}
              onChange={handleSelectCategory}
            >
              {categorySelectOptions?.map((a) => (
                <Option value={a.id} key={a.id}>
                  {a.faname}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Row>

        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          style={{ width: "100%" }}
          label="انتخاب موسیقی"
          name="musicIds"
        >
          <Select
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            // showSearch
            onSearch={onSearchMusic}
            mode="multiple"
          >
            {tracksSelectOptions?.map((a) => (
              <Option value={a.id} key={a.id}>
                {a.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

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
