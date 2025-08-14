import { ProCard } from "@ant-design/pro-components"
import CCSUpload from "./CCSUpload"
import UploadTable from "./UploadTable"
import { proxy } from "valtio"

export const fileState = proxy({
    uploadData: [

    ] as any[],
    uploading: false,
})


const CCSFileUpload = () => {


    return (
        <div>
            <CCSUpload />
            <ProCard
                style={{
                    height: '100vh',
                    minHeight: 800,
                }}
            >
                <UploadTable />
            </ProCard>
        </div>
    )
}

export default CCSFileUpload