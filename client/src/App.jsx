import 'react-toastify/dist/ReactToastify.css';
import './css/styles.css';
import { Routes, Route } from 'react-router-dom';
import Main from './layouts/Main';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoutes from './layouts/PrivateRoutes';
import PublicRoutes from './layouts/PublicRoutes.js';
import Layout from './layouts/Layout';
import UserList from './components/user/UserList';
import UserAdd from './components/user/UserAdd.js';
import UserUpdate from './components/user/UserUpdate.js';
import PageNotFound from './components/PageNotFound.js';
import Profile from './components/Profile.js';
import PostList from './components/post/PostList.js';
import PostAdd from './components/post/PostAdd.js';
import PostUpdate from './components/post/PostUpdate.js';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<Main />}>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/user/add" element={<UserAdd />} />
            <Route path="/user/edit/:id" element={<UserUpdate />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/post/add" element={<PostAdd />} />
            <Route path="/post/edit/:id" element={<PostUpdate />} />
          </Route>
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />}></Route>
    </Routes>
  );
}

export default App;
