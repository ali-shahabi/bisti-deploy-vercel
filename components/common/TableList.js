import { Input, Pagination, Row, Space, Table, Button } from "antd";
import React from "react";

const TableList = ({
  columns,
  dataSource,
  showAddModal,
  rowKey,
  loading,
  tableLayout = "fixed",
  inputPlaceHolder,
  handlePagination,
  totalItems,
  searchInput,
  orderBy,
  sortBy,
  filterByArtist,
  filterByAlbum,
}) => {
  const handleChangePagination = (currentPage, pageSize) => {
    console.log(currentPage, pageSize);
    handlePagination(currentPage, pageSize);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1600, y: "70vh", scrollToFirstRowOnChange: true }}
        rowKey={rowKey}
        loading={loading}
        bordered
        size="large"
        pagination={false}
        tableLayout={tableLayout}
        title={() => (
          <Space size="large">
            <Button type="primary" onClick={showAddModal}>
              اضافه کردن
            </Button>
            {orderBy}
            {sortBy}
            {filterByArtist}
            {filterByAlbum}
            {searchInput}
          </Space>
        )}
        footer={() => (
          <Row justify="space-between">
            {handlePagination && (
              <Pagination
                showSizeChanger
                defaultCurrent={1}
                showQuickJumper
                total={totalItems}
                locale={{ jump_to: "برو به صفحه", page: "" }}
                showTotal={(total) => `تعداد کل ${total}`}
                onChange={handleChangePagination}
              />
            )}
          </Row>
        )}
      />
    </>
  );
};

export default TableList;
