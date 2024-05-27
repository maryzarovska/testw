import React, { useEffect, useState } from "react";
import './css/Create.css';
import axios from "axios";
import { useSelector } from "react-redux";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useParams } from "react-router-dom";

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

    function create() {
        axios.post("/api/create-post", { title, summary, text, user_id: user.id, rating, relationship, categories: selectedCategories, is_draft: draft }, { headers: { "Authorization": localStorage.getItem("token") } })

    }

    useEffect(() => {
        if (params.id) {
            axios.get<{ id: number, cat_name: string }[]>(`/api/posts/${params.id}`).then(response => {
                console.log(response.data);
            });
        }
        axios.get<{ id: number, cat_name: string }[]>("/api/categories/all").then(response => {
            setCategories(response.data)
        });
    }, [])

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
                <input type="radio" name="relationships" id={"relation" + index} value={value} onChange={event => setRelationship(event.target.value)} />
                <label htmlFor={"relation" + index}>{value}</label>
            </div>
        )}

        <br /><br /><br />

        {ratings.map((value, index) =>

            <div key={value}>
                <input type="radio" name="ratings" id={"rating" + index} value={value} onChange={event => setRating(event.target.value)} />
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
                        // plugins: [
                        //     Alignment
                        // ],
                        toolbar: [
                            'undo', 'redo',
                            '|', 'heading',
                            '|', 'bold', 'italic', 'strikethrough',
                            '|', 'alignment',
                            '|', 'link', 'blockQuote',
                            '|', 'bulletedList', 'numberedList', 'outdent', 'indent'
                        ]
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
                ></CKEditor>
            </div>
            {/* <textarea name="" id="" cols={80} rows={20} placeholder="Content" className="text" value={text} onChange={event => setText(event.target.value)}></textarea> */}
        </form>

        <input type="checkbox" onChange={event => { setDraft(event.target.checked) }} checked={draft} /> Save as draft <br /> <br />
        <button type="button" onClick={create}>Create</button>
    </>);
}

export default Create;