import React from 'react';
import { Link } from 'react-router-dom';
const PageNotFound = () => {
  return (
    <div className="text-center">
      <img className="w-50" src={'../assets/images/pageNotFound.jpg'} />
      <Link className="mt-2 d-block" to="/">
        <i className="fas fa-arrow-left me-1"></i> Return to Dashboard
      </Link>
    </div>
  );
};

export default PageNotFound;
