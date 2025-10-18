import React, { useState, useEffect } from "react";
import EditCategorymodel from "../components/EditCategorymodel";
import Uploadcategorymodel from "../components/Uploadcategorymodel";
import { SummaryApi } from "../common/SummaryApi";
import { Axios } from "../Utils/Axios";
import toast from "react-hot-toast";

function Category() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editCategoryData, setEditCategoryData] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await Axios({
        url: SummaryApi.getallcategory.url,
        method: SummaryApi.getallcategory.method,
      });
      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setShowAddModal(true);
  };

  const handleEditCategory = (category) => {
    setEditCategoryData(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await Axios({
          url: `/api/category/delete-category/${categoryId}`,
          method: "DELETE",
        });
        if (response.data.success) {
          toast.success("Deleted successfully");
          fetchCategories();
        } else {
          toast.error(response.data.message || "Error occurred during delete");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error occurred during delete");
      }
    }
  };

  return (
    <section className="py-4 px-3">
      <div className="container">
       
        <div className="d-flex justify-content-between align-items-center bg-white shadow-sm p-3 rounded-3 mb-4">
          <h3 className="m-0 fw-semibold text-success">
            <i className="bi bi-tags me-2"></i>Categories
          </h3>
          <button className="btn btn-success px-4" onClick={handleAddCategory}>
            <i className="bi bi-plus-lg me-1"></i>Add Category
          </button>
        </div>

       
        {showAddModal && (
          <Uploadcategorymodel
            show={showAddModal}
            close={() => setShowAddModal(false)}
            refreshCategories={fetchCategories}
          />
        )}

        {showEditModal && (
          <EditCategorymodel
            show={showEditModal}
            close={() => {
              setShowEditModal(false);
              setEditCategoryData(null);
            }}
            refreshCategories={fetchCategories}
            categoryData={editCategoryData}
          />
        )}

      
        <div className="row g-4">
          {categories.map((ele) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
              key={ele._id}
            >
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow transition">
                <div className="bg-light p-3 d-flex justify-content-center align-items-center">
                  <img
                    src={ele.image}
                    alt={ele.name}
                    className="img-fluid"
                    style={{
                      height: "120px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h6
                    className="fw-semibold text-dark text-truncate mb-3"
                    title={ele.name}
                  >
                    {ele.name}
                  </h6>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => handleEditCategory(ele)}
                    >
                      <i className="bi bi-pencil-square me-1"></i>Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteCategory(ele._id)}
                    >
                      <i className="bi bi-trash3 me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="text-center text-muted py-5">
              <i className="bi bi-folder2-open fs-1 d-block mb-2"></i>
              <p>No categories found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Category;
