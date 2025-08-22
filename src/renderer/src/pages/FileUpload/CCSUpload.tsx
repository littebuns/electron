import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { fileJudge } from '../../service/fileJudge';
import { fileState } from './CCSFileLoad';

const { Dragger } = Upload;


const CCSUpload = () => {

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    customRequest: async (info) => {
      console.log(info);
      const { data } = await fileJudge(info.file);
      fileState.uploadData = [...fileState.uploadData, { id: Date.now(), fileName: (info.file as any).name, sblNo: data.sblNo, fileStore: data.fileStore }]
      console.log(data);
      console.log(fileState.uploadData);

    },
    onChange(info) {
      const { status } = info.file;
      console.log("status", status);
      console.log(info.fileList);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
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

  )
}






export default CCSUpload;