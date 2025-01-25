import { UploadAdapter } from 'ckeditor5';

const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

const dataURLtoFile = (dataurl: string, filename: string) => {
    let arr = dataurl.split(',')
    let matchArr = arr[0].match(/:(.*?);/);
    if (!matchArr) return;
    let mime = matchArr[1];
    let bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

class CustomImageUploadAdapter implements UploadAdapter {
    constructor(private loader: any) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then((file: File) => {
            return new Promise(async (resolve, reject) => {
                resolve({ default: await toBase64(file) });
                // TODO: Upload to server
                // const formData = new FormData();
                // formData.append("image", file, file.name);
                // return axios.post("/api/upload-post-image", formData, {
                //     headers: {
                //         "Content-Type": "multipart/form-data",
                //         "Authorization": localStorage.getItem("token")
                //     }
                // }).then((data: any) => {
                //     console.log(data.data.url)
                //     if (data.data.url) {
                //         resolve({ default: data.data.url });
                //     } else {
                //         reject(`Error uploading file: ${file.name}.`);
                //     }
                // });
            });
        });
    }

    abort(): void { }
}

export function CustomImageUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
        return new CustomImageUploadAdapter(loader);
    };
}
