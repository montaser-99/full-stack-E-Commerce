import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios } from "../Utils/Axios";
import { SummaryApi } from "../common/SummaryApi";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import AddToCartButton from "../components/Addtocartbutton";

const ProductDisplayPage = () => {
  const { productId } = useParams();
  const [data, setData] = useState({
    name: "",
    image: [],
    price: 0,
    discount: 0,
    stock: 0,
    description: "",
  });
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.GetProductDetails,
        data: { productId },
      });
      const responseData = response?.data;
      if (responseData?.success) {
        setData(responseData.data);
        setImageIndex(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const scrollHorizontally = (offset) => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += offset;
    }
  };

  const finalPrice = (
    data.price -
    (data.price * data.discount) / 100
  ).toFixed(2);

  if (loading)
    return (
      <div className="text-center mt-5 fw-semibold fs-5 text-muted">
        Loading product details...
      </div>
    );

  return (
    <section className="container py-5">
      <div className="row g-5 align-items-start">
       
        <div className="col-lg-6">
          <div className="bg-white rounded-4 border shadow-sm p-3 d-flex align-items-center justify-content-center">
            <img
              src={data.image[imageIndex]}
              alt={data.name}
              className="img-fluid rounded"
              style={{ maxHeight: "65vh", objectFit: "contain" }}
            />
          </div>

         
          <div className="d-flex justify-content-center gap-2 mt-3">
            {data.image.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setImageIndex(idx)}
                className={`rounded-circle border ${
                  idx === imageIndex ? "bg-primary" : "bg-light"
                }`}
                style={{
                  width: "12px",
                  height: "12px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              />
            ))}
          </div>

       
          <div className="position-relative mt-4">
            <div
              ref={imageContainer}
              className="d-flex gap-2 overflow-auto px-2"
              style={{ scrollBehavior: "smooth" }}
            >
              {data.image.map((src, idx) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 border rounded-3 overflow-hidden ${
                    idx === imageIndex ? "border-primary" : ""
                  }`}
                  style={{
                    width: "80px",
                    height: "80px",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                  onClick={() => setImageIndex(idx)}
                >
                  <img
                    src={src}
                    alt={`thumb-${idx}`}
                    className="w-100 h-100 object-fit-contain"
                  />
                </div>
              ))}
            </div>

            <button
              className="btn btn-light shadow-sm position-absolute top-50 start-0 translate-middle-y"
              onClick={() => scrollHorizontally(-100)}
            >
              <FaAngleLeft />
            </button>

            <button
              className="btn btn-light shadow-sm position-absolute top-50 end-0 translate-middle-y"
              onClick={() => scrollHorizontally(100)}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* ==== Right Side (Details) ==== */}
        <div className="col-lg-6">
          <h2 className="fw-bold">{data.name}</h2>

          <div className="d-flex align-items-center gap-3 mt-2">
            <span className="fs-3 fw-bold text-success">${finalPrice}</span>
            {data.discount > 0 && (
              <>
                <span className="text-muted text-decoration-line-through">
                  ${data.price}
                </span>
                <span className="badge bg-danger fs-6">
                  {data.discount}% OFF
                </span>
              </>
            )}
          </div>

          <hr />

          <p className="text-muted" style={{ lineHeight: 1.7 }}>
            {data.description || "No description available for this product."}
          </p>

          {data.stock > 0 ? (
            <div className="mt-4">
              <AddToCartButton product={data} />
              <p className="text-success mt-2 fw-semibold">
                In stock — ready to ship
              </p>
            </div>
          ) : (
            <p className="text-danger fw-semibold mt-4 fs-5">
              Out of Stock
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
