import React, { useEffect, useState } from "react";
import { Axios } from "../Utils/Axios";
import { SummaryApi } from "../common/SummaryApi";
import Cardproduct from "./Cardproduct";
import CustomSlider from "./Slider";
import { Link } from "react-router-dom";

function CategoryProductDisplay({ id, name, useSlider = true, Redirectproductlistpage }) {
  const [data, setData] = useState([]);

  const fetchproductsmatch = async () => {
    try {
      const response = await Axios({
        url: SummaryApi.Getproductbycategory.url,
        method: SummaryApi.Getproductbycategory.method,
        data: { id },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id && typeof id === "string" && id.trim() !== "") {
      fetchproductsmatch();
    }
  }, [id]);

  return (
    <div className="mt-5 mb-4 container">
     
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2
          className="fw-bold"
          style={{
            fontSize: "1.8rem",
            borderLeft: "6px solid #00ca57",
            paddingLeft: "10px",
            color: "#222",
            margin: 0,
          }}
        >
          {name}
        </h2>

       
        <button
          className="btn btn-outline-success fw-semibold"
          onClick={() => Redirectproductlistpage(id, name)}
        >
          View All
        </button>
      </div>

 
      {useSlider ? (
        <CustomSlider data={data} slidesToShow={5} autoplay={false} />
      ) : (
        <div className="row g-3">
          {data.length > 0 ? (
            data.map((product) => (
              <div
                className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2"
                key={product._id}
              >
                <Link
                  to={`/product-details/${product._id}`}
                  className="text-decoration-none text-dark"
                >
                  <Cardproduct data={product} />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-muted text-center my-4">No products found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryProductDisplay;
