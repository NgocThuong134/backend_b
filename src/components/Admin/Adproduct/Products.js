import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  QUERY_PRODUCTS,
  MUTATION_DELETE_PRODUCT,
} from "../../../utils/queries";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Products.css";

const Products = () => {
  const { loading, error, data, refetch } = useQuery(QUERY_PRODUCTS);
  const [deleteProduct] = useMutation(MUTATION_DELETE_PRODUCT, {
    onCompleted: () => refetch(),
  });

  const navigate = useNavigate();

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct({ variables: { _id } })
        .then((response) => {
          toast.success("Product deleted successfully!");
        })
        .catch((error) => {
          toast.error("Error deleting product.");
        });
    }
  };

  const handleEdit = (product) => {
    navigate(`/admin/editproduct/${product._id}`);
  };

  const handleAddProduct = () => {
    navigate("/admin/addproduct");
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching products:", error);
    return <p>Error loading products.</p>;
  }

  return (
    <div className="products-container">
      <h1>Products</h1>
      <button onClick={handleAddProduct} className="add-product-button">
        Add Product
      </button>
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>
                <img
                  src={
                    product.image.startsWith("data:image")
                      ? product.image
                      : `/images/${product.image}`
                  }
                  alt={product.name}
                  style={{ width: "75px", height: "75px" }} // Điều chỉnh kích thước hình ảnh
                />
              </td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.category.name}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Products;
