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
                    formData.append("upload", file, file.name);

                    return fetch("/api/upload-post-image", {
                        method: "POST",
                        body: formData,
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.url) {
                                this.loader.uploaded = true;
                                resolve({
                                    default: data.url,
                                });
                            } else {
                                reject(`Error uploading file: ${file.name}.`);
                            }
                        });
                })
        );
    }

    abort() { }
}

export default function ThisCustomImageUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
        return new CustomImageUploadAdapter(loader);
    };
}
