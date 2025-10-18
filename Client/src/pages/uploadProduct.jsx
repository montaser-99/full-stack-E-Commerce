import React, { useState } from 'react'
import { SummaryApi } from '../common/SummaryApi'
import { Axios } from '../Utils/Axios'
import Uploadimage from '../Utils/Uploadimage'
import { IoIosCloudUpload } from "react-icons/io"
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

function UploadProduct() {
  const [selectedcategories, setSelectedcategories] = useState([])
  const [selectedsubcategories, setSelectedsubcategories] = useState([])
  const [selectedOption, setSelectedOption] = useState("")
  const [selectedSubOption, setSelectedSubOption] = useState("")
  const [detailKey, setDetailKey] = useState("")
  const [detailFields, setDetailFields] = useState([])
  const [detailValue, setDetailValue] = useState("")
  const allcategories = useSelector(state => state.product.Allcategories)
  const allsubcategories = useSelector(state => state.product.Allsubcategories)

  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    sub_category: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddDetail = () => {
    if (detailKey.trim() && detailValue.trim()) {
      const newField = { key: detailKey.trim(), value: detailValue.trim() }
      setDetailFields([...detailFields, newField])
      setDetailKey("")
      setDetailValue("")
    } else {
      toast.error("You must fill key and value")
    }
  }

  const handleDeleteDetail = (index) => {
    setDetailFields(detailFields.filter((_, i) => i !== index))
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const response = await Uploadimage(file)
      const imageurl = response?.data?.data
      if (imageurl) {
        setData((prev) => ({
          ...prev,
          image: [...prev.image, imageurl],
        }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
      toast.error("Unable to upload image")
    }
  }

  const handleDeleteImage = (index) => {
    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!data.name.trim()) {
      toast.error("Product name is required")
      return
    }

    if (!data.price || Number(data.price) <= 0) {
      toast.error("Price must be more than zero")
      return
    }

    try {
      const productData = {
        ...data,
        category: selectedcategories.map(cat => cat._id),
        sub_category: selectedsubcategories.map(cat => cat._id),
        unit: data.unit,
        stock: Number(data.stock),
        price: Number(data.price),
        discount: Number(data.discount),
        more_details: detailFields.reduce((acc, field) => {
          acc[field.key] = field.value
          return acc
        }, {}),
        image: data.image,
      }

      await Axios({
        url: SummaryApi.Addproduct.url,
        method: SummaryApi.Addproduct.method,
        data: productData,
        withCredentials: true
      })

      toast.success("Product added successfully")
      setData({
        name: "",
        image: [],
        category: [],
        sub_category: [],
        unit: "",
        stock: "",
        price: "",
        discount: "",
        description: "",
        more_details: {},
      })
      setSelectedcategories([])
      setSelectedsubcategories([])
      setDetailFields([])

    } catch (error) {
      console.log(error)
      toast.error("Error adding product")
    }
  }

  const handlecategoryselect = (e) => {
    const selectedid = e.target.value
    const selectedCat = allcategories.find(cat => cat._id === selectedid)
    const check = selectedcategories.find(cat => cat._id === selectedid)
    if (selectedCat && !check) {
      setSelectedcategories([...selectedcategories, selectedCat])
    }
    setSelectedOption("")
  }

  const handlesubcategoryselect = (e) => {
    const selectedid = e.target.value
    const selectedCat = allsubcategories.find(cat => cat._id === selectedid)
    const check = selectedsubcategories.find(cat => cat._id === selectedid)
    if (selectedCat && !check) {
      setSelectedsubcategories([...selectedsubcategories, selectedCat])
    }
    setSelectedSubOption("")
  }

  const handleDeleteCategory = (id) => {
    setSelectedcategories(selectedcategories.filter(cat => cat._id !== id))
  }

  const handleDeletesubCategory = (id) => {
    setSelectedsubcategories(selectedsubcategories.filter(cat => cat._id !== id))
  }

  return (
    <section className="py-4">
      <div className="container">
        <div className="bg-white shadow-sm rounded-3 p-3 d-flex justify-content-between align-items-center mb-4">
          <h3 className="m-0 fw-semibold text-success">
            <i className="bi bi-box2-heart me-2"></i>Upload Product
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-4 p-4">
          {/* Name & Description */}
          <div className="row mb-4 g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter product name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                rows={1}
                className="form-control"
                value={data.description}
                onChange={handleChange}
                placeholder="Short description"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category</label>
              <div className="mb-2 d-flex flex-wrap gap-2">
                {selectedcategories.map((cat) => (
                  <span
                    key={cat._id}
                    className="badge bg-success-subtle text-success fw-semibold border rounded-pill px-3 py-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteCategory(cat._id)}
                  >
                    {cat.name} ×
                  </span>
                ))}
              </div>
              <select
                className="form-select"
                onChange={handlecategoryselect}
                value={selectedOption}
              >
                <option value="">Select category</option>
                {allcategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Subcategory</label>
              <div className="mb-2 d-flex flex-wrap gap-2">
                {selectedsubcategories.map((cat) => (
                  <span
                    key={cat._id}
                    className="badge bg-secondary-subtle text-secondary fw-semibold border rounded-pill px-3 py-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeletesubCategory(cat._id)}
                  >
                    {cat.name} ×
                  </span>
                ))}
              </div>
              <select
                className="form-select"
                onChange={handlesubcategoryselect}
                value={selectedSubOption}
              >
                <option value="">Select subcategory</option>
                {allsubcategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Numbers Row */}
          <div className="row g-3 mb-4">
            {[
              { name: "unit", label: "Unit" },
              { name: "stock", label: "Stock" },
              { name: "price", label: "Price" },
              { name: "discount", label: "Discount" },
            ].map((item) => (
              <div className="col-6 col-md-3" key={item.name}>
                <label className="form-label fw-semibold">{item.label}</label>
                <input
                  type="number"
                  name={item.name}
                  value={data[item.name]}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={`Enter ${item.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Product Images</label>
            <label
              htmlFor="productImage"
              className="border border-2 border-dashed rounded-3 d-flex flex-column align-items-center justify-content-center py-4 bg-light text-center"
              style={{ cursor: "pointer" }}
            >
              <IoIosCloudUpload size={40} className="mb-2 text-primary" />
              <p className="mb-0 text-muted">Click to upload image</p>
            </label>
            <input
              type="file"
              id="productImage"
              className="d-none"
              accept="image/*"
              onChange={handleUploadImage}
            />
            <div className="d-flex flex-wrap gap-3 mt-3">
              {data.image.map((img, index) => (
                <div
                  key={index}
                  className="position-relative border rounded overflow-hidden"
                  style={{ width: "120px", height: "120px" }}
                >
                  <img
                    src={img}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    alt="Uploaded"
                  />
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-1 bg-light rounded-circle p-1"
                    onClick={() => handleDeleteImage(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* More Details */}
          <div className="mb-4">
            <label className="form-label fw-semibold">More Details</label>
            <div className="d-flex flex-column flex-md-row gap-2 mb-3">
              <input
                type="text"
                value={detailKey}
                onChange={(e) => setDetailKey(e.target.value)}
                className="form-control"
                placeholder="Key"
              />
              <input
                type="text"
                value={detailValue}
                onChange={(e) => setDetailValue(e.target.value)}
                className="form-control"
                placeholder="Value"
              />
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleAddDetail}
              >
                Add
              </button>
            </div>

            {detailFields.map((field, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center bg-light p-2 rounded mb-2"
              >
                <span className="fw-medium">
                  {field.key}: <span className="text-muted">{field.value}</span>
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteDetail(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-success px-5 py-2 fw-semibold">
              Upload Product
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default UploadProduct
