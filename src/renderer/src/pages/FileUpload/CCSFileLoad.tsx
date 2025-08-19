import { ProCard } from "@ant-design/pro-components"
import { Divider, Tabs } from "antd"
import { proxy } from "valtio"
import CCSUpload from "./CCSUpload"
import UploadTable from "./UploadTable"

export const fileState = proxy({
    uploadData: [

    ] as any[],
})


const CCSFileUpload = () => {


    return (
        <div>
            <ProCard
                style={{
                    height: '100vh',
                    minHeight: 800,
                }}
            >
                <Tabs
                    defaultActiveKey="1"
                    size={"middle"}
                    style={{ marginBottom: 32 }}
                    items={[
                        {
                            key: '1',
                            label: '主单MBL',
                            children: <>
                                <CCSUpload />
                                <Divider dashed />
                                <UploadTable /></>,
                        },
                        // {
                        //     key: '2',
                        //     label: '待新增',
                        //     children: <>
                        //         <CCSUpload />
                        //         <UploadTable /></>,
                        // }
                    ]
                    }
                />


            </ProCard>
        </div>
    )
}

export default CCSFileUpload