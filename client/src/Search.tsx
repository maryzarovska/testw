import * as React from 'react';
import './css/Search.css';
import axios from 'axios';

function Search() {

  const [categories, setCategories] = React.useState<{ cat_name: string, id: number }[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<{ cat_name: string, id: number }[]>([]);
  const [categoriesSearchText, setCategoriesSearchText] = React.useState<string>("");
  const [textSearchText, setTextSearchText] = React.useState<string>("");

  React.useEffect(() => {
    axios.get<{ id: number, cat_name: string }[]>("/api/categories/all").then(response => {
      setCategories(response.data)
    })
  }, []);

  function searchItems() {
    axios.post("/api/posts/list", { textSearchText, categories: selectedCategories }).then(response => {
      console.log(response.data)
    })
  }

  return (<>
    <h1>Search</h1>

    <div><input type="text" value={categoriesSearchText} onChange={event => setCategoriesSearchText(event.target.value)} /></div>
    <div>{selectedCategories.map(category => <span onClick={(event) => {
      setSelectedCategories(
        selectedCategories.filter((inCat) => inCat.cat_name !== category.cat_name),
      )
    }} >{category.cat_name}</span>)}</div>
    <div>{categories
      .filter((cat) => {
        if (selectedCategories.indexOf(cat) !== -1) return false
        return cat.cat_name.toLowerCase().includes(categoriesSearchText.toLowerCase())
      }).sort((a, b) => {
        let d = a.cat_name.toLowerCase().indexOf(categoriesSearchText.toLowerCase()) - b.cat_name.toLowerCase().indexOf(categoriesSearchText.toLowerCase())
        if (d !== 0)
          return d;
        else if (a.cat_name > b.cat_name)
          return 1;
        else if (a.cat_name < b.cat_name)
          return -1;
        else
          return 0;
      })
      .map((cat) => (
        <span
          style={{ border: '1px solid black', cursor: 'pointer', marginRight: "5px", padding: "5px", display: "inline-block", marginBottom: "5px", marginTop: "10px" }}
          onClick={(event) => {
            setSelectedCategories([...selectedCategories, cat])
          }}
        >
          {cat.cat_name}
        </span>
      ))}</div>


    <div><input type="text" value={textSearchText} onChange={event => setTextSearchText(event.target.value)} /></div>

    <button onClick={searchItems}>Search</button>

  </>);
}

export default Search;