import axios from 'axios';
import { UploadAdapter } from 'ckeditor5';

class CustomImageUploadAdapter implements UploadAdapter {
    loader: any

    constructor(loader: any) {
        this.loader = loader;
    }

    upload() {
        const formData = new FormData();
        return this.loader.file.then(
            (file: any) =>
                new Promise((resolve, reject) => {
                    formData.append("image", file, file.name);
                    console.log();
                    return axios.post("/api/upload-post-image", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": localStorage.getItem("token")
                        }
                    }).then((data: any) => {
                        console.log(data.data.url)
                        if (data.data.url) {
                            this.loader.uploaded = true;
                            resolve({
                                default: data.data.url,
                            });
                        } else {
                            reject(`Error uploading file: ${file.name}.`);
                        }
                    });
                })
        );
    }

    abort() {
        console.log('***');
    }
}

export default function ThisCustomImageUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
        return new CustomImageUploadAdapter(loader);
    };
}
