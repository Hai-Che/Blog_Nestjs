import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import requestApi from '../../helpers/api';
import * as actions from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const UserUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(actions.controlLoading(true));
    try {
      const getDetailUser = async () => {
        const res = await requestApi(`/users/${params.id}`, 'GET');
        const fields = ['first_name', 'last_name', 'status'];
        fields.forEach((field) => {
          setValue(field, res.data[field]);
        });
        dispatch(actions.controlLoading(false));
      };
      getDetailUser();
    } catch (error) {
      dispatch(actions.controlLoading(false));

      console.log(error);
    }
  }, []);
  const handleSubmitFormUpdate = async (data) => {
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi(`/users/${params.id}`, 'PUT', data);
      dispatch(actions.controlLoading(false));
      toast.success('Update user success', {
        position: 'top-center',
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/users');
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
          <h1 className="mt-4">Update user</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/users">User</Link>
            </li>
            <li className="breadcrumb-item active">Update user</li>
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
                      <label className="form-label">First name:</label>
                      <input
                        {...register('first_name', {
                          required: 'First name is required!',
                        })}
                        type="text"
                        className="form-control"
                        placeholder="Enter first name"
                      />
                      {errors.first_name && (
                        <p style={{ color: 'red' }}>
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Last name:</label>
                      <input
                        {...register('last_name', {
                          required: 'Last name is required!',
                        })}
                        type="text"
                        className="form-control"
                        placeholder="Enter last name"
                      />
                      {errors.last_name && (
                        <p style={{ color: 'red' }}>
                          {errors.last_name.message}
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
                      onClick={handleSubmit(handleSubmitFormUpdate)}
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

export default UserUpdate;
