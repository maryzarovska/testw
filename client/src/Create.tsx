import React, { useEffect, useState } from "react";
import './css/Create.css';
import axios from "axios";
import { useSelector } from "react-redux";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, FontBackgroundColor } from 'ckeditor5';
import { useNavigate, useParams } from "react-router-dom";

import 'ckeditor5/ckeditor5.css';

function Create() {
    const params = useParams();
    const [categories, setCategories] = useState<{ id: number, cat_name: string }[]>([])
    let relationships = ["Gen", "F/M", "F/F", "M/M", "Multi"]
    let ratings = ["G (General Audience)", "T (Teen and Up Audience)", "M (Mature)", "E (Explicit)"]
    const user = useSelector((state: any) => state.user.value)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [rating, setRating] = useState("")
    const [relationship, setRelationship] = useState("")
    const [selectedCategories, setSelectedCategories] = useState<{ id: number, cat_name: string }[]>([]);
    const [summary, setSummary] = useState("");
    const [draft, setDraft] = useState(false);
    const navigate = useNavigate();
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    function create() {
        axios.post("/api/create-post", {
            title, summary, text: text.replace('', ''), user_id: user.id, rating, relationship, categories: selectedCategories, is_draft: draft
        }, {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(response => {
            if (response.status === 200) {
                alert("Post created!");
                navigate("/profile");
            } else {
                alert("Error on post creating!");
            }
        });
    }

    function edit() {
        axios.put(`/api/posts/edit/${params.id}`, {
            title, summary, text: text.replace('', ''), rating, relationship, categories: selectedCategories, is_draft: draft
        }, {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(response => {
            if (response.status === 200) {
                alert("Post updated!");
                navigate("/profile");
            } else {
                alert("Error on post updating!");
            }
        });
    }

    useEffect(() => {
        if (params.id) {
            axios.get<any>(`/api/posts/edit/${params.id}`, {
                headers: { "Authorization": localStorage.getItem("token") }
            }).then(response => {
                setMode('edit');
                setRelationship(response.data.relationship);
                setRating(response.data.rating);
                setSelectedCategories(response.data.categories);
                setTitle(response.data.title);
                setSummary(response.data.summary);
                setText(response.data.text);
                setDraft(response.data.is_draft);
                console.log(response.data);
            }).catch(err => {
                if (err && err.response.status === 400)
                    navigate("/");
            });
        }
        axios.get<{ id: number, cat_name: string }[]>("/api/categories/all").then(response => {
            setCategories(response.data)
        });
    }, [])

    useEffect(() => {
        setCategories(categories.filter(cat => selectedCategories.findIndex(sCat => sCat.id === cat.id) === -1));
    }, [categories.length, selectedCategories.length])

    function toSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const cat = categories.find(c => c.cat_name === event.target.value)
        if (cat) {
            setSelectedCategories([...selectedCategories, cat]);
            setCategories(categories.filter(c => c.cat_name !== event.target.value))
        }

    }

    function toUnselect(event: any) {
        const cat = selectedCategories.find(c => c.cat_name === event.target.dataset.category)
        if (cat) {
            setCategories([...categories, cat]);
            setSelectedCategories(selectedCategories.filter(c => c.cat_name !== event.target.dataset.category))
        }

    }

    return (<>
        {relationships.map((value, index) =>

            <div key={value}>
                <input type="radio" name="relationships" id={"relation" + index} value={value} onChange={event => setRelationship(event.target.value)} checked={value === relationship} />
                <label htmlFor={"relation" + index}>{value}</label>
            </div>
        )}

        <br /><br /><br />

        {ratings.map((value, index) =>

            <div key={value}>
                <input type="radio" name="ratings" id={"rating" + index} value={value} onChange={event => setRating(event.target.value)} checked={value === rating} />
                <label htmlFor={"rating" + index}>{value}</label>
            </div>

        )}

        <br /><br /><br />

        <div className="selectedWrapped">
            <div className="selected">
                {selectedCategories.map((value, index) =>

                    <span className="selectedCategory" key={value.id}>{value.cat_name} <span data-category={value.cat_name} onClick={toUnselect} style={{ color: "red", cursor: "pointer" }}>&#9932;</span> </span>

                )}
            </div>
        </div>

        <br />
        <div>
            <select onChange={toSelect} name="categories" multiple className="categories">
                {categories.map((value, index) =>

                    <option value={value.cat_name} key={value.id}>{value.cat_name}</option>

                )}
            </select>
        </div>


        <form>
            <br />
            <input type="text" placeholder="Title" className="title" value={title} onChange={event => setTitle(event.target.value)} /> <br /> <br />
            <textarea name="" id="" cols={80} rows={7} placeholder="Summary" className="summary" value={summary} onChange={event => setSummary(event.target.value)}></textarea> <br /><br />
            <div className="ckeditor-wrap">
                <CKEditor
                    editor={ClassicEditor}
                    config={{
                        licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzYwMzUxOTksImp0aSI6IjQ5ZGFiNjQ3LTllNzQtNDE5NS1iNWE5LTI4MDM0M2FiOWQ4OCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImJjNjZiZmIwIn0.g99C25EFAl_wWlkXuqtJFZnPoJwIGpfTROC1CoA18e6texKzu_-unz660W7wCCnk87rD3g9Wj7e3ga9p0MUU_g',
                        plugins: [Essentials, Paragraph, Bold, Italic, FontBackgroundColor],
                        toolbar: {
                            items: [
                                'undo', 'redo',
                                '|',
                                'bold', 'italic',
                                '|',
                                'fontBackgroundColor',
                            ],
                            shouldNotGroupWhenFull: false
                        },
                    }}
                    onReady={editor => {
                        editor.editing.view.change((writer) => {
                            let root = editor.editing.view.document.getRoot();
                            if (root !== null) {
                                writer.setStyle(
                                    "height",
                                    "500px",
                                    root
                                );
                            }
                        });
                    }}
                    data={text}
                    onChange={(event, editor) => {
                        setText(editor.getData());
                    }}
                />
                {/* <textarea
                    cols={80}
                    rows={20}
                    placeholder="Content"
                    className="text"
                    value={text}
                    onChange={event => setText(event.target.value)}
                ></textarea> */}
            </div>
        </form>

        <input type="checkbox" onChange={event => { setDraft(event.target.checked) }} checked={draft} /> Save as draft <br /> <br />
        {mode === 'create' ?
            <button type="button" onClick={create}>Create</button>
            :
            <button type="button" onClick={edit}>Save</button>
        }
    </>);
}

export default Create;