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
    {/* Header */}
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center bg-white shadow-sm p-3 rounded-3 mb-4 gap-2">
      <h3 className="m-0 fw-semibold text-success d-flex align-items-center gap-2">
        <i className="bi bi-tags"></i> Categories
      </h3>
      <button
        className="btn btn-success d-flex align-items-center gap-1 px-3 px-sm-4 py-2"
        onClick={handleAddCategory}
      >
        <i className="bi bi-plus-lg"></i>
        <span className="d-none d-sm-inline">Add Category</span>
      </button>
    </div>

    {/* Modals */}
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

    {/* Cards */}
    <div className="row g-3 g-sm-4">
      {categories.length > 0 ? (
        categories.map((ele) => (
          <div
            className="col-6 col-sm-4 col-md-3 col-lg-2"
            key={ele._id}
          >
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow transition">
              <div className="bg-light p-3 d-flex justify-content-center align-items-center">
                <img
                  src={ele.image}
                  alt={ele.name}
                  className="img-fluid"
                  style={{ height: "120px", objectFit: "contain" }}
                />
              </div>
              <div className="card-body text-center">
                <h6
                  className="fw-semibold text-dark text-truncate mb-3"
                  title={ele.name}
                >
                  {ele.name}
                </h6>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
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
        ))
      ) : (
        <div className="text-center text-muted py-5 w-100">
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
