import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import requestApi from '../../helpers/api';
import * as actions from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
} from 'ckeditor5';
// import { SlashCommand } from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
const PostUpdate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const {
    register,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  //   const [thumbnail, setThumbnail] = useState('');
  const [categories, setCategories] = useState([]);
  const [postData, setPostData] = useState({});
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    try {
      const renderData = async () => {
        const res = await requestApi('/categories', 'GET');
        setCategories(res.data);
        const detailPost = await requestApi(`/posts/${params.id}`, 'GET');
        console.log(detailPost);
        const fields = [
          'title',
          'summary',
          'description',
          'category',
          'thumbnail',
          'status',
        ];
        fields.forEach((field) => {
          if (field === 'category') {
            setValue(field, detailPost.data[field].id);
          } else {
            setValue(field, detailPost.data[field]);
          }
        });
        setPostData({
          ...detailPost.data,
          thumbnail: `http://localhost:5000/post/${detailPost.data.thumbnail.split('\\')[2]}`,
        });
        dispatch(actions.controlLoading(false));
      };
      renderData();
    } catch (error) {
      dispatch(actions.controlLoading(false));
      console.log(err);
    }
  }, []);
  const ontThumbnailChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = () => {
        setPostData({ ...postData, thumbnail: reader.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSubmitFormAdd = async (data) => {
    console.log(data);
    let formData = new FormData();
    for (let key in data) {
      if (key === 'thumbnail') {
        if (data.thumbnail[0] instanceof File) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    }
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi(
        `/posts/${params.id}`,
        'PUT',
        formData,
        'json',
        'multipart/form-data',
      );
      dispatch(actions.controlLoading(false));
      toast.success('Post has been updated successfully', {
        position: 'top-center',
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/posts');
      }, 3000);
    } catch (error) {
      dispatch(actions.controlLoading(false));

      console.log(error);
    }
  };
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Update post</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/posts">Post</Link>
            </li>
            <li className="breadcrumb-item active">Update</li>
          </ol>
          <div className="card mb-3">
            <div className="card-header">
              <i className="fas fa-plus me-1"></i> Update
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <form>
                  <div className="col-md-6">
                    <div className="mb-3 mt-3">
                      <label className="form-label">Title:</label>
                      <input
                        {...register('title', {
                          required: 'Title is required!',
                        })}
                        type="text"
                        className="form-control"
                        placeholder="Enter title"
                      />
                      {errors.title && (
                        <p style={{ color: 'red' }}>{errors.title.message}</p>
                      )}
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Summary:</label>
                      <textarea
                        rows="4"
                        {...register('summary', {
                          required: 'Summary is required!',
                        })}
                        className="form-control"
                        placeholder="Enter summary"
                      />
                      {errors.summary && (
                        <p style={{ color: 'red' }}>{errors.summary.message}</p>
                      )}
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Description:</label>
                      <CKEditor
                        editor={ClassicEditor}
                        data={postData.description}
                        config={{
                          toolbar: {
                            items: ['undo', 'redo', '|', 'bold', 'italic'],
                          },
                          plugins: [
                            Bold,
                            Essentials,
                            Italic,
                            Mention,
                            Paragraph,
                            Undo,
                          ],
                          licenseKey: '<YOUR_LICENSE_KEY>',
                          mention: {
                            // Mention configuration
                          },
                          initialData: '<p>Hello from CKEditor 5 in React!</p>',
                        }}
                        onReady={(editor) => {
                          register('description', {
                            required: 'Description is required!',
                          });
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setValue('description', data);
                          trigger('description');
                        }}
                      />
                      {errors.description && (
                        <p style={{ color: 'red' }}>
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Thumbnail:</label>
                      <br />
                      {postData.thumbnail && (
                        <img
                          style={{ width: '300px' }}
                          src={postData.thumbnail}
                          className="mb-2"
                          alt=""
                        />
                      )}
                      <div className="input-file">
                        <label
                          htmlFor="file"
                          className="btn-file btn-sm btn btn-primary"
                        >
                          Browse Files
                        </label>
                        <input
                          id="file"
                          type="file"
                          name="thumbnail"
                          {...register('thumbnail', {
                            onChange: ontThumbnailChange,
                          })}
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category:</label>
                      <select
                        {...register('category', {
                          required: 'Category is required.',
                        })}
                        className="form-select"
                      >
                        <option value="">--Select a category--</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p style={{ color: 'red' }}>
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 mb-3">
                      <label className="form-label">Status:</label>
                      <select className="form-select" {...register('status')}>
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit(handleSubmitFormAdd)}
                      className="btn btn-success"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostUpdate;
