import { DeleteFilled, EditFilled, MenuOutlined } from "@ant-design/icons";
import { Popconfirm, Space, Switch, Tooltip } from "antd";
import React from "react";

const Actions = ({
  showEditModal,
  data,
  handleDelete,
  switchButton,
  handleActivision,
  handleDetails,
}) => {
  console.log(data);

  function confirm() {
    handleDelete(data.id);
  }

  function onChange(checked) {
    console.log(`switch to ${checked}`);
    if (checked) {
      handleActivision(data.id + "?action=active");
    }
    if (!checked) {
      handleActivision(data.id + "?action=deactive");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      {handleDetails && (
        <Tooltip title="جزییات">
          <MenuOutlined
            style={{ fontSize: "20px" }}
            onClick={() => handleDetails(data)}
          />
        </Tooltip>
      )}
      <Tooltip title="ویرایش">
        <EditFilled
          onClick={() => showEditModal(data)}
          style={{ fontSize: "20px" }}
        />
      </Tooltip>
      <Popconfirm
        title="آیا برای حذف این آیتم مطمئن هستید؟"
        onConfirm={confirm}
        okText="بله"
        cancelText="خیر"
      >
        <Tooltip title="حذف">
          <DeleteFilled style={{ fontSize: "20px" }} />
        </Tooltip>
      </Popconfirm>
      {switchButton && (
        <Tooltip title="فعال/غیرفعال">
          <Switch
            defaultChecked={data?.status == 4 ? false : true}
            onChange={onChange}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default Actions;
