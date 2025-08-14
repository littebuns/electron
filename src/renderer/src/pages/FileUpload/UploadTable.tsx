import type {
    ProColumns,
    ProFormInstance
} from '@ant-design/pro-components';
import {
    CellEditorTable,
    ProForm
} from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { useSnapshot } from 'valtio';
import { fileState } from './CCSFileLoad';

type DataSourceType = {
    id: React.Key;
    fileName?: string;
    blNo?: string;
};


export default () => {

    const snapshot = useSnapshot(fileState); // 监控响应式状态的变化

    const formRef = useRef<ProFormInstance<any>>(null);

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: '文件名称',
            dataIndex: 'fileName',
            formItemProps: () => {
                return {
                    rules: [{ required: true, message: '此项为必填项' }],
                };
            },
            width: '30%',
        },
        {
            title: '提单号',
            dataIndex: 'blNo',
        }
    ];

    return (
        <ProForm<{
            table: DataSourceType[];
        }>
            formRef={formRef}
            initialValues={{
                table: snapshot.uploadData,
            }}
            validateTrigger="onBlur"
        >
            <CellEditorTable<DataSourceType>
                headerTitle="可编辑表格"
                columns={columns}
                rowKey="id"
                scroll={{
                    x: 960,
                }}
                value={snapshot.uploadData}
                // onChange={setUploadData}
                recordCreatorProps={{
                    newRecordType: 'dataSource',
                    record: () => ({
                        id: Date.now(),
                    }),
                }}
            />
        </ProForm>
    );
};