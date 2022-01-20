import { Image, Modal } from 'antd';
import React from 'react';

const PreviewImageModal = ({
  visible,
  title,
  onCancel,
  src,
  width,
  height,
  modalWidth = 550,
}) => {
  return (
    <Modal
      visible={visible}
      title={title}
      footer={null}
      closable={false}
      onCancel={onCancel}
      zIndex={100000}
      width={modalWidth}
    >
      <Image alt='example' width={width} height={height} src={src} />
    </Modal>
  );
};

export default PreviewImageModal;
