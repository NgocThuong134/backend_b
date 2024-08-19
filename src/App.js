import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Updated import
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

import Home from "./pages/Home";
import Detail from "./pages/Detail";
import NoMatch from "./pages/NoMatch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Nav from "./components/Nav";
import { StoreProvider } from "./utils/GlobalState";
import OrderHistory from "./pages/OrderHistory";
import Success from "./pages/Success";
import Products from "./components/Admin/Adproduct/Products";
import EditProduct from "./components/Admin/AdEditPro/EditProduct";
import AddProduct from "./components/Admin/AdAddPro/AddProduct";
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('id_token') ? `Bearer ${localStorage.getItem('id_token')}` : ''
  }
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <StoreProvider>
            <Nav />
            <Routes> {/* Updated from Switch to Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/orderHistory" element={<OrderHistory />} />
              <Route path="/products/:id" element={<Detail />} />
              <Route path="/success" element={<Success />} />
              <Route path="/admin/product" element={<Products />} />
              <Route path="/admin/editproduct/:id" element={<EditProduct />} />
              <Route path="/admin/addproduct" element={<AddProduct />} />
              <Route path="*" element={<NoMatch />} /> {/* Catch-all route */}
            </Routes>
          </StoreProvider>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;