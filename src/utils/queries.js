import gql from 'graphql-tag';

export const QUERY_PRODUCTS = gql`
  query getProducts($category: ID) {
    products(category: $category) {
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

export const QUERY_ALL_PRODUCTS = gql`
  {
    products {
      _id
      name
      description
      price
      quantity
      category {
        name
      }
    }
  }
`;

export const QUERY_CATEGORIES = gql`
{
  categories {
    _id
    name
  }
}
`;

export const QUERY_USER = gql`
{
  user {
    firstName
    lastName
    orders {
      _id
      purchaseDate
      products {
        _id
        name
        description
        price
        quantity
        image
      }
    }
  }
}
`;

export const QUERY_CHECKOUT = gql`
  query getCheckout($products: [ID]!) {
    checkout(products: $products) {
      session
    }
  }
`;

// Mutation to add a new product
export const MUTATION_ADD_PRODUCT = gql`
  mutation addProduct($name: String!, $description: String!, $image: String!, $quantity: Int!, $price: Float!, $category: ID!) {
    addProduct(name: $name, description: $description, image: $image, quantity: $quantity, price: $price, category: $category) {
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

// Mutation to update an existing product
export const MUTATION_UPDATE_PRODUCT_DETAILS = gql`
  mutation updateProductDetails($_id: ID!, $name: String, $description: String, $image: String, $quantity: Int, $price: Float, $category: ID) {
    updateProductDetails(_id: $_id, name: $name, description: $description, image: $image, quantity: $quantity, price: $price, category: $category) {
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

// Mutation to delete a product
export const MUTATION_DELETE_PRODUCT = gql`
  mutation deleteProduct($_id: ID!) {
    deleteProduct(_id: $_id) {
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