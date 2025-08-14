import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Spin, Upload } from 'antd';
import { useSnapshot } from 'valtio';
import { fileJudge } from '../../service/fileJudge';
import { fileState } from './CCSFileLoad';
import { useState } from 'react';

const { Dragger } = Upload;


const CCSUpload = () => {
  const fileStateSnap = useSnapshot(fileState);
  const [uploadCount, setUploadCount] = useState(0);

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    customRequest: async (info) => {
      console.log(info);
      setUploadCount(uploadCount - 1);
      try {
        const { data } = await fileJudge(info.file);
        fileState.uploadData = [...fileState.uploadData, { fileName: (info.file as any).name, blNo: data }]
        console.log(data);
      } finally {
        console.log("uploadCount", uploadCount);
        
        if (uploadCount === 0) {
          fileState.uploading = false;
        }
      }

    },
    onChange(info) {

      const { status } = info.file;
      console.log("status", status);
      console.log(info.fileList);
      setUploadCount(uploadCount + 1);

      // 设置开始上传状态
      if (info.fileList.length > 0) {
        fileState.uploading = true;
      }

    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Spin spinning={fileStateSnap.uploading} tip="文件上传中...">
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other
          banned files.
        </p>
      </Dragger>
    </Spin>

  )
}






export default CCSUpload;