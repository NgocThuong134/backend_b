import React, { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { MUTATION_UPDATE_PRODUCT_DETAILS } from "../../../utils/queries";
import "./EditProduct.css";

const QUERY_PRODUCT = gql`
  query getProduct($_id: ID!) {
    product(_id: $_id) {
      _id
      name
      description
      price
      quantity
      image
      category {
        _id
        name
      }
    }
  }
`;

const QUERY_CATEGORIES = gql`
{
  categories {
    _id
    name
  }
}
`;

const EditProduct = () => {
  const { id } = useParams();
  const { loading: loadingProduct, error: errorProduct, data: dataProduct } = useQuery(QUERY_PRODUCT, {
    variables: { _id: id },
  });
  
  const { loading: loadingCategories, error: errorCategories, data: dataCategories } = useQuery(QUERY_CATEGORIES);
  
  const [updateProduct] = useMutation(MUTATION_UPDATE_PRODUCT_DETAILS);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (dataProduct && dataProduct.product) {
      setName(dataProduct.product.name);
      setDescription(dataProduct.product.description);
      setPrice(dataProduct.product.price);
      setQuantity(dataProduct.product.quantity);
      setImage(dataProduct.product.image);
      setCategoryId(dataProduct.product.category._id); // Set the initial category
    }
  }, [dataProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        variables: {
          _id: id,
          name,
          description,
          image,
          quantity: parseInt(quantity),
          price: parseFloat(price),
          categoryId, // Send the selected category ID
        },
      });
      
      navigate("/admin/product");
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingProduct || loadingCategories) return <p>Loading...</p>;
  if (errorProduct) return <p>Error: {errorProduct.message}</p>;
  if (errorCategories) return <p>Error: {errorCategories.message}</p>;

  return (
    <div className="edit-product-container">
      <h2 className="edit-product-title">Edit Product</h2>
      <Link to="/admin/product">
        ← Go to Admin product
      </Link>
      <form className="edit-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>Select a category</option>
            {dataCategories.categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          {image && (
            <img
              src={image.startsWith("data:image") ? image : `/images/${image}`}
              alt={name}
              style={{ width: "100px", height: "100px" }}
            />
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="edit-product-submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;