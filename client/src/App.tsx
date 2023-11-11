import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import logo from './logo.svg';
import './css/App.css';

import NavPannel from './NavPannel';
import Home from './Home';
import About from './About';
import Fandoms from './Fandoms';
import Search from './Search';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import Logout from './Logout';

import store from './application-store/store';
import Create from './Create';

const router = createBrowserRouter([{
  path: "/",
  element: <Root />,
  children: [
    {
      path: "",
      element: <Home />
    },

    {
      path: "fandoms",
      element: <Fandoms />
    },

    {
      path: "search",
      element: <Search />
    },

    {
      path: "about",
      element: <About />
    },

    {
      path: "registration",
      element: <Register />
    },

    {
      path: "login",
      element: <Login />
    },

    {
      path: "profile",
      element: <Profile />
    },

    {
      path: "logout",
      element: <Logout />
    },

    {
      path: "create-work",
      element: <Create />
    }
  ]
}])

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <RouterProvider router={router} />
      </div>
    </Provider>
  );
}

function Root() {
  return (<>
    <NavPannel />
    <Outlet />
  </>)
}

export default App;
