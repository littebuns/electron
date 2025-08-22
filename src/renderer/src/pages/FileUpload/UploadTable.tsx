import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Form, Input, message, Popconfirm, Row, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import { fileState } from './CCSFileLoad';
import { extFileSave } from '@renderer/service/fileJudge';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[{ required: true, message: `${title} is required.` }]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingInlineEnd: 24 }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

interface DataType {
    key: React.Key;
    name: string;
    age: string;
    address: string;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

const UploadTable: React.FC = () => {

    const dataSource = useSnapshot(fileState).uploadData;


    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        fileState.uploadData = newData;
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [

        {
            title: 'fileName',
            dataIndex: 'fileName',
        },
        {
            title: 'sblNo',
            dataIndex: 'sblNo',
            width: '30%',
            editable: true,
        },
        {
            title: 'fileStore',
            dataIndex: 'fileStore',
            hidden: true
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleSave = (row: DataType) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        fileState.uploadData = newData;
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const uploadExtFile = async () => {

        const uploadData = dataSource.map((data) =>
        ({
            ...data,
            fileTypeCode: 'mbl',
            fileTypeId: 144,
            id: null
        }))
        const { success } = await extFileSave(uploadData as any)
        if (success) {
            message.success('上传成功')
        }


    }

    return (
        <div>
            <Table<DataType>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
            />
            <Row justify="end" style={{ marginTop: 20 }}>
                <Button type="primary" style={{ marginRight: 20 }} onClick={uploadExtFile}>提交</Button>
                <Button type="primary" onClick={() => fileState.uploadData = []}>重置</Button>
            </Row>


        </div>
    );
};

export default UploadTable;