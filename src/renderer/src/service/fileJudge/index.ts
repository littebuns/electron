import { ResponseResultType } from "../interface";
import request from "../request";
import { extFile } from "./interface";

export async function fileJudge(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    return request<any>({
        url: `/dmc-doc/fileJudge`,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export async function batchUpload(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append(`files`, file);
    });
    return request<any>({
        url: `/ccsOrder/common/file/upload/batch`,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}


export const extFileSave = (data: extFile[]) => {
    return request<ResponseResultType<any>>({
        url: `/ccsOrder/ccAttachFile/sbl/extFileSave`,
        method: 'post',
        data: data,
    });
};
