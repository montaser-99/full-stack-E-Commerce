import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Axios } from "../Utils/Axios";
import { SummaryApi } from "../common/SummaryApi";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Cardproduct from "../components/Cardproduct";

function ProductListPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useParams();

  const allSubCategories = useSelector((state) => state.product.Allsubcategories);
  const allCategories = useSelector((state) => state.product.Allcategories);

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];
  const subCategoryParts = params?.subCategory?.split("-");
  const subCategoryName = subCategoryParts
    ?.slice(0, subCategoryParts?.length - 1)
    ?.join(" ");
  const category = allCategories.find((cat) => cat._id === categoryId);
  const categoryName = category?.name || "category";

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.Getproductbycategoryandsubcategory,
        data: {
          categoryId: categoryId.trim(),
          subCategoryId: subCategoryId.trim(),
          page,
          limit: 8,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data);
        } else {
          setData((prev) => [...prev, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [params, page]);

  useEffect(() => {
    const sub = allSubCategories.filter((s) =>
      s.category?.some((cat) => cat.toString() === categoryId)
    );
    setDisplaySubCategory(sub);
  }, [params, allSubCategories]);

  return (
    <div className="container-fluid py-4">
      <div className="row flex-column flex-md-row min-vh-100">
        {/* Sidebar */}
        <aside
          className="col-12 col-md-3 col-lg-2 bg-light rounded-4 p-3 mb-3 mb-md-0 shadow-sm"
          style={{ minHeight: "200px" }}
        >
          <h5 className="fw-semibold mb-3 text-center text-md-start">
            Subcategories
          </h5>
          <ul className="list-group border-0">
            {displaySubCategory.map((sub) => (
              <Link
                to={`/product/${categoryName}-${categoryId}/${sub.name}-${sub._id}`}
                key={sub._id}
                className={`list-group-item list-group-item-action border-0 rounded-3 mb-2 ${
                  sub._id === subCategoryId
                    ? "active bg-success text-white"
                    : "bg-white text-dark"
                }`}
                style={{ transition: "all 0.3s ease" }}
              >
                {sub.name}
              </Link>
            ))}
          </ul>
        </aside>

        {/* Content Area */}
        <main className="col-12 col-md-9 col-lg-10 bg-white rounded-4 shadow-sm p-4 flex-grow-1">
          <h4 className="fw-bold mb-4 text-success">
            {categoryName} / {subCategoryName}
          </h4>

          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" />
            </div>
          ) : data.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="row g-4">
              {data.map((product) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  key={product._id}
                >
                
                    <Cardproduct data={product} />
                  
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {page * 8 < totalPage && (
            <div className="text-center mt-4">
              <button
                className="btn btn-success px-4 py-2 fw-semibold rounded-pill shadow-sm"
                onClick={() => setPage(page + 1)}
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProductListPage;
