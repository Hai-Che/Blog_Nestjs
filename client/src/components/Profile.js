import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../redux/actions';
import requestApi from '../helpers/api';
import { toast } from 'react-toastify';
const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [isSelectedFile, setIsSelectedFile] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.controlLoading(true));
    requestApi('/users/profile', 'GET')
      .then((res) => {
        let avatarUrl = res.data.avatar;
        avatarUrl = avatarUrl.split(`\\`);
        setProfileData({
          ...res.data,
          avatar: `http://localhost:5000/${avatarUrl[1]}/${avatarUrl[2]}`,
        });
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
        console.log(err);
      });
  }, []);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        setProfileData({
          ...profileData,
          avatar: reader.result,
          file: file,
        });
      };
      reader.readAsDataURL(file);
      setIsSelectedFile(true);
    }
  };
  const handleUpdateAvatar = () => {
    const formData = new FormData();
    formData.append('avatar', profileData.file);
    dispatch(actions.controlLoading(true));
    requestApi(
      '/users/upload-avatar',
      'POST',
      formData,
      'json',
      'multipart/form-data',
    )
      .then((res) => {
        dispatch(actions.controlLoading(false));
        toast.success('Update avatar successfully!', {
          position: 'top-center',
          autoClose: 2000,
        });
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
        console.log(err);
      });
  };
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Profile</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Update avatar</li>
          </ol>
          <div className="card mb-4">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-4">
                  <img
                    src={
                      profileData
                        ? profileData.avatar
                        : './assets/images/default_avt.jpg'
                    }
                    className="img-thumbnail rounded mb-2"
                    alt="..."
                  />
                  <div className="input-file float-start">
                    <label
                      htmlFor="file"
                      className="btn-file btn-sm btn btn-primary"
                    >
                      Browse Files
                    </label>
                    <input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={onImageChange}
                    />
                  </div>
                  {isSelectedFile && (
                    <button
                      className="btn btn-sm btn-success float-end"
                      onClick={handleUpdateAvatar}
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
