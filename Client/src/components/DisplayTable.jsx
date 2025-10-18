import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Axios } from '../Utils/Axios';

function SubcategoryTable({ refreshFlag, onEdit, onDelete }) {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const categoriesRes = await Axios.get('/api/category/');
      if (categoriesRes?.data?.data) setCategories(categoriesRes.data.data);

      const subcatRes = await Axios.get('/api/sub-category/');
      if (subcatRes?.data?.data) setSubcategories(subcatRes.data.data);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshFlag]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      onDelete(id);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-center mb-4">Sub-Categories</h3>

      {/* TABLE FOR DESKTOP */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No sub-categories found</td>
              </tr>
            ) : (
              subcategories.map((subcat) => (
                <tr key={subcat._id}>
                  <td className="align-middle">{subcat.name}</td>
                  <td className="align-middle">
                    {subcat.image ? (
                      <img
                        src={subcat.image}
                        alt={subcat.name}
                        className="img-fluid"
                        style={{ width: "80px", height: "50px", objectFit: "contain" }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="align-middle">
                    {subcat.category.map((catId) =>
                      categories.find((c) => c._id === catId)?.name
                    ).join(", ")}
                  </td>
                  <td className="align-middle">
                    <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(subcat)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(subcat._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/*  GRID CARDS FOR SMALL SCREENS */}
      <div className="d-block d-md-none">
        {subcategories.length === 0 ? (
          <p className="text-center">No sub-categories found</p>
        ) : (
          <div className="row g-3">
            {subcategories.map((subcat) => (
              <div className="col-6" key={subcat._id}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body text-center p-2">
                    <div className="mb-2" style={{ height: "80px" }}>
                      {subcat.image ? (
                        <img
                          src={subcat.image}
                          alt={subcat.name}
                          className="img-fluid"
                          style={{ maxHeight: "80px", objectFit: "contain" }}
                        />
                      ) : (
                        <span className="text-muted small">No Image</span>
                      )}
                    </div>

                    <h6 className="fw-semibold text-truncate mb-1">{subcat.name}</h6>
                    <p className="small text-muted mb-2">
                      {subcat.category.map((catId) =>
                        categories.find((c) => c._id === catId)?.name
                      ).join(", ")}
                    </p>

                    <div className="d-flex justify-content-center gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(subcat)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(subcat._id)}
                      >
                        Del
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubcategoryTable;
