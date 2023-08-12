import React from 'react';
import logo from './logo.svg';
import './css/App.css';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import NavPannel from './NavPannel';
import Home from './Home';
import About from './About';
import Fandoms from './Fandoms';
import Search from './Search';
import Register from './Register';
import Profile from './Profile';
import Login from './Login';

const router = createBrowserRouter([{
  path: "/",
  element: <Root/>,
  children: [
    {
      path: "",
      element: <Home/>
    },

    {
      path: "fandoms",
      element: <Fandoms/>
    },

    {
      path: "search",
      element: <Search/>
    },

    {
      path: "about",
      element: <About/>
    },

    {
      path: "registration",
      element: <Register/>
    },

    {
      path: "login",
      element: <Login/>
    },

    {
      path: "profile",
      element: <Profile/>
    }
  ]
}])

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

function Root() {
  return (<>
  <NavPannel/>
  <Outlet/>
  </>)
}

export default App;
