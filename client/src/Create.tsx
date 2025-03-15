import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ContentState, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './css/Create.css';

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

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    function create() {
        axios.post("/api/create-post", {
            title, summary, text, user_id: user.id, rating, relationship, categories: selectedCategories, is_draft: draft
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
            title, summary, text, rating, relationship, categories: selectedCategories, is_draft: draft
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
                const contentBlock = htmlToDraft(response.data.text);
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const newEditorState = EditorState.createWithContent(contentState);
                setEditorState(newEditorState);
            }).catch(err => {
                if (err && err.response.status === 400) {
                    navigate("/");
                }
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
                {selectedCategories.map(value =>
                    <span className="selectedCategory" key={value.id}>
                        {value.cat_name}&nbsp;
                        <span data-category={value.cat_name} onClick={toUnselect} style={{ color: "red", cursor: "pointer" }}>
                            &#9932;
                        </span>
                    </span>
                )}
            </div>
        </div>

        <br />

        <div>
            <select onChange={toSelect} name="categories" multiple className="categories">
                {categories.map(value =>
                    <option value={value.cat_name} key={value.id}>{value.cat_name}</option>
                )}
            </select>
        </div>

        <br />

        <div>
            <input
                type="text"
                placeholder="Title"
                className="title"
                value={title}
                onChange={event => setTitle(event.target.value)}
            />
        </div>

        <br /><br />

        <div>
            <textarea
                cols={80}
                rows={7}
                placeholder="Summary"
                className="summary"
                value={summary}
                onChange={event => setSummary(event.target.value)}>
            </textarea>
        </div>

        <br /><br />

        <div className="ckeditor-wrap">
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={(state: any) => {
                    setEditorState(state);
                }}
                onContentStateChange={(state: any) => {
                    const html = draftToHtml(state);
                    setText(html);
                }}
            />
        </div>

        <div>
            <input
                type="checkbox"
                onChange={event => setDraft(event.target.checked)}
                checked={draft}
            />
            <span>&nbsp;Save as draft</span>

            <br /> <br />

            {mode === 'create' ?
                <button type="button" onClick={create}>Create</button>
                :
                <button type="button" onClick={edit}>Save</button>
            }
        </div>

    </>);
}

export default Create;