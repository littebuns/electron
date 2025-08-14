import request from "../request";

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