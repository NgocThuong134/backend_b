import React, { useState } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";
import { QUERY_CATEGORIES, MUTATION_ADD_PRODUCT } from "../../../utils/queries";
import { Link } from "react-router-dom";
const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [addProduct] = useMutation(MUTATION_ADD_PRODUCT);
  const { loading, error, data } = useQuery(QUERY_CATEGORIES);
  const navigate = useNavigate();

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error fetching categories: {error.message}</p>;

  const handleImageUpload = (e) => {
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

    // Kiểm tra các trường nhập liệu
    if (!name || !description || !image || !quantity || !price || !category) {
      alert("Please fill in all fields.");
      return;
    }

    if (parseInt(quantity) <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    if (parseFloat(price) <= 0) {
      alert("Price must be a positive number.");
      return;
    }

    try {
      await addProduct({
        variables: {
          name,
          description,
          image,
          quantity: parseInt(quantity),
          price: parseFloat(price),
          category,
        },
      });

      alert("Product created successfully!");
      setName("");
      setDescription("");
      setImage("");
      setQuantity("");
      setPrice("");
      setCategory("");
      navigate("/admin/product");
      window.location.reload();
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Error creating product. Please try again.");
    }
  };

  return (
<div>
    <Link to="/admin/product">
        ← Go to Admin product
      </Link>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
      </div>
      <div>
        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      </div>
      {image && <img src={image} alt="Preview" style={{ width: '100px', margin: '10px 0' }} />}
      <div>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Price:
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
      </div>
      <div className="category-select">
        <label htmlFor="categorySelect">Category:</label>
        <select
          id="categorySelect"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {data.categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add Product</button>
    </form>
    </div>
  );
};

export default AddProduct;