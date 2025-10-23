# Ecommerve API

This is the API documentation for the Ecommerve project. The API provides various endpoints to manage products, metadata, and other functionalities.

## Table of Contents

- [General Routes](#general-routes)
  - [Get All Products](#get-all-products)
  - [Refresh Products](#refresh-products)
  - [Get Store Products](#get-store-products)
  - [Get Homepage Products](#get-homepage-products)
- [Admin Routes](#admin-routes)
  - [Add Product](#add-product)
  - [Remove Product](#remove-product)
  - [Update Product](#update-product)
  - [Get Metadata](#get-metadata)
  - [Replace Metadata](#replace-metadata)
  - [Add Metadata Entry](#add-metadata-entry)
  - [Remove Metadata Entry](#remove-metadata-entry)

## General Routes

### Get All Products

**Endpoint:** `GET /api/products`

**Description:** Retrieves all products.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "price": "number",
    "imgUrl": "string",
    "category": "string"
  }
]
```

### Refresh Products

**Endpoint:** `GET /api/products/refresh`

**Description:** Clears the cache and reloads the products.

**Response:**
```json
{
  "message": "Cache refreshed.",
  "products": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "imgUrl": "string",
      "category": "string"
    }
  ]
}
```

### Get Store Products

**Endpoint:** `GET /api/store`

**Description:** Retrieves products grouped by category.

**Response:**
```json
{
  "category": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "imgUrl": "string",
      "category": "string"
    }
  ]
}
```

### Get Homepage Products

**Endpoint:** `GET /api/homepage`

**Description:** Retrieves bestselling and editors' choice products for the homepage.

**Response:**
```json
{
  "bestselling": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "imgUrl": "string",
      "category": "string"
    }
  ],
  "editors_choice": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "imgUrl": "string",
      "category": "string"
    }
  ]
}
```

## Admin Routes

### Add Product

**Endpoint:** `POST /api/admin/add-product`

**Description:** Adds a new product.

**Request:**
- `category` (string, required)
- `productName` (string, required)
- `price` (number, optional)
- `image` (file, required)

**Response:**
```json
{
  "message": "Product added successfully.",
  "product": "string",
  "updatedProducts": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "imgUrl": "string",
      "category": "string"
    }
  ]
}
```

### Remove Product

**Endpoint:** `POST /api/admin/remove-product`

**Description:** Removes an existing product.

**Request:**
- `category` (string, required)
- `productName` (string, required)

**Response:**
```json
{
  "message": "Product removed successfully.",
  "updatedProducts": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "imgUrl": "string",
      "category": "string"
    }
  ]
}
```

### Update Product

**Endpoint:** `POST /api/admin/update-product`

**Description:** Updates an existing product.

**Request:**
- `oldCategory` (string, required)
- `oldProductName` (string, required)
- `newProductName` (string, optional)
- `newCategory` (string, optional)
- `newPrice` (number, optional)

**Response:**
```json
{
  "message": "Product updated successfully.",
  "updatedProducts": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "imgUrl": "string",
      "category": "string"
    }
  ]
}
```

### Get Metadata

**Endpoint:** `GET /api/admin/metadata`

**Description:** Retrieves the current metadata.

**Response:**
```json
{
  "bestselling": [
    {
      "category": "string",
      "product": "string"
    }
  ],
  "editors_choice": [
    {
      "category": "string",
      "product": "string"
    }
  ]
}
```

### Replace Metadata

**Endpoint:** `POST /api/admin/metadata`

**Description:** Replaces the current metadata with the provided metadata.

**Request:**
- `metadata` (object, required)

**Response:**
```json
{
  "message": "Metadata updated.",
  "metadata": {
    "bestselling": [
      {
        "category": "string",
        "product": "string"
      }
    ],
    "editors_choice": [
      {
        "category": "string",
        "product": "string"
      }
    ]
  }
}
```

### Add Metadata Entry

**Endpoint:** `PATCH /api/admin/metadata/add`

**Description:** Adds an entry to a metadata section (bestselling or editors_choice).

**Request:**
- `section` (string, required)
- `category` (string, required)
- `product` (string, required)

**Response:**
```json
{
  "message": "Added to section.",
  "metadata": {
    "bestselling": [
      {
        "category": "string",
        "product": "string"
      }
    ],
    "editors_choice": [
      {
        "category": "string",
        "product": "string"
      }
    ]
  }
}
```

### Remove Metadata Entry

**Endpoint:** `PATCH /api/admin/metadata/remove`

**Description:** Removes an entry from a metadata section (bestselling or editors_choice).

**Request:**
- `section` (string, required)
- `category` (string, required)
- `product` (string, required)

**Response:**
```json
{
  "message": "Removed from section.",
  "metadata": {
    "bestselling": [
      {
        "category": "string",
        "product": "string"
      }
    ],
    "editors_choice": [
      {
        "category": "string",
        "product": "string"
      }
    ]
  }
}
```

## Notes

- Ensure that the server is running and accessible at the base URL specified in your environment configuration.
- All requests and responses should be in JSON format.
- For file uploads, use `multipart/form-data` content type.