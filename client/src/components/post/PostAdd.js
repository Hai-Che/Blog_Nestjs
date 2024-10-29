import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
const PostAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  const [thumbnail, setThumbnail] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(actions.controlLoading(true));
    requestApi('/categories', 'GET')
      .then((res) => {
        setCategories(res.data);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
        console.log(err);
      });
  }, []);
  const ontThumbnailChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSubmitFormAdd = async (data) => {
    let formData = new FormData();
    for (let key in data) {
      if (key === 'thumbnail') {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi(
        '/posts',
        'POST',
        formData,
        'json',
        'multipart/form-data',
      );
      dispatch(actions.controlLoading(false));
      toast.success('Post has been added successfully', {
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
          <h1 className="mt-4">New post</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/posts">Post</Link>
            </li>
            <li className="breadcrumb-item active">Add new</li>
          </ol>
          <div className="card mb-3">
            <div className="card-header">
              <i className="fas fa-plus me-1"></i> Add new
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
                      {thumbnail && (
                        <img
                          style={{ width: '300px' }}
                          src={thumbnail}
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
                            required: 'Thumbnail is required!',
                            onChange: ontThumbnailChange,
                          })}
                        />
                        {errors.thumbnail && (
                          <p style={{ color: 'red' }}>
                            {errors.thumbnail.message}
                          </p>
                        )}
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

export default PostAdd;
