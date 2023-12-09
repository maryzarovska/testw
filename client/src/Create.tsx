import React, { useEffect, useState } from "react";
import './css/Create.css';
import axios from "axios";
import { useSelector } from "react-redux";

function Create() {
    const [categories, setCategories] = useState<string[]>(["Detective", "Fantasy", "Romance", "Science fiction", "Horror"])
    let relationships = ["Gen", "F/M", "F/F", "M/M", "Multi"]
    let ratings = ["G (General Audience)", "T (Teen and Up Audience)", "M (Mature)", "E (Explicit)"]
    const user = useSelector((state: any) => state.user.value)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [rating, setRating] = useState("")
    const [relationship, setRelationship] = useState("")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    function create() {
        axios.post("/api/create-post", { title, text, user_id: user.id, rating, relationship }, { headers: { "Authorization": localStorage.getItem("token") } })
    }

    function toSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedCategories([...selectedCategories, event.target.value]);
        setCategories(categories.filter(c => c !== event.target.value))
    }

    function toUnselect(event: any) {
        setCategories([...categories, event.target.dataset.category]);
        setSelectedCategories(selectedCategories.filter(c => c !== event.target.dataset.category))
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
                
                    <span className="selectedCategory" key={value}>{value} <span data-category={value} onClick={toUnselect} style={{color: "red", cursor: "pointer"}}>&#9932;</span> </span>

                )}
            </div>
        </div>

        <br />
        <div>
            <select onChange={toSelect} name="categories" multiple className="categories">
                {categories.map((value, index) =>

                    <option value={value} key={value}>{value}</option>

                )}
            </select>
        </div>


        <form>
            <br />
            <input type="text" placeholder="Title" className="title" value={title} onChange={event => setTitle(event.target.value)} /> <br /> <br />
            <textarea name="" id="" cols={80} rows={20} placeholder="Content" className="text" value={text} onChange={event => setText(event.target.value)}></textarea>
        </form>

        <button type="button" onClick={create}>Create</button>
    </>);
}

export default Create;