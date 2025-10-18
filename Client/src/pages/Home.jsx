import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import CustomSlider from '../components/Slider';
import CategoryProductDisplay from '../components/CategoryProductDisplay';
import { valideURLConvert } from "../Utils/validURLconverter";
import toast from 'react-hot-toast';

function Home() {
  const navigate = useNavigate();

  const categoryData = useSelector(state => state.product.Allcategories);
  const subcategoryData = useSelector(state => state.product.Allsubcategories);


  const Redirectproductlistpage = (id, cat) => {
    const subcategory = subcategoryData.find(
      (sub) => Array.isArray(sub.category) && sub.category.some((c) => c == id)
    );

    if (!subcategory) {
      toast.error("No subcategory found for this category");
      return;
    }

    toast.loading("Opening products...", { id: "redirect" });
    setTimeout(() => {
      toast.dismiss("redirect");
      const url = `/product/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
      navigate(url);
    }, 400);
  };
  const CategoryCard = ({ data }) => (
    <div
      className="text-center px-2 category-card"
      onClick={() => Redirectproductlistpage(data._id, data.name)}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="mx-auto bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center border border-2 border-transparent"
        style={{
          width: '120px',
          height: '120px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <img
          src={data.image}
          alt={data.name}
          className="img-fluid"
          style={{
            height: '80%',
            width: '80%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>
      <p className="mt-2 fw-semibold text-truncate" title={data.name}>
        {data.name}
      </p>
    </div>
  );

  return (
    <>
    
      <Hero />

 
      <section className="container-fluid mt-5" id='our-category'>
        <h2 className="text-center fw-medium my-3">
          Our <span className="text-success">Categories</span>
        </h2>
        <div className="bg-success mx-auto mb-3" style={{ height: 5, width: 220 }}></div>

        <CustomSlider
          data={categoryData}
          CardComponent={CategoryCard}
          slidesToShow={6}
          autoplay={true}
        />
      </section>


      <div className='container mt-5'>
        <h2 className="fw-medium mb-4 text-center">
          Featured <span className="text-success">Products</span>
        </h2>

        <div className='row'>
          {Array.isArray(categoryData) && categoryData.length > 0 ? (
            categoryData.map((cat, index) => (
              <CategoryProductDisplay
                id={cat._id}
                name={cat.name}
                key={index}
              />
            ))
          ) : (
            <p>Loading Categories...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
