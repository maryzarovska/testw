import * as React from 'react';
import './css/Search.css';
import './css/Profile.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Search() {

  const [categories, setCategories] = React.useState<{ cat_name: string, id: number }[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<{ cat_name: string, id: number }[]>([]);
  const [categoriesSearchText, setCategoriesSearchText] = React.useState<string>("");
  const [textSearchText, setTextSearchText] = React.useState<string>("");
  const [posts, setPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    axios.get<{ id: number, cat_name: string }[]>("/api/categories/all").then(response => {
      setCategories(response.data)
    })
  }, []);

  function searchItems() {
    axios.post("/api/posts/list", { textSearchText, categories: selectedCategories }).then(response => {
      setPosts(response.data);
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

    <div className='postsWrap'>
      {posts?.map(post => <div className='postItem' key={post.id}>
        <h4><Link to={`/posts/${post.id}`}>{post.title}</Link></h4>
        <p>Author: <Link to={`/user/${post.username}`}>{post.username}</Link></p>
        <p>Rating: {post.rating}</p>
        <p>Relationship: {post.relationship}</p>
        <p>Categories: {post.categories_list ? post.categories_list.split(',').join(', ') : ''}</p>
        <p>Summary: {post.summary}</p>
      </div>)}
    </div>

  </>);
}

export default Search;