# TMG API Test

A simple Express-based API to manage stack (LIFO) operations and an in-memory key-value store with TTL functionality.

## Setup and Usage

After clone the repository or download and extracting the project directories, do the following:

### 1. Install dependencies
```bash
npm install
```

### 2. Run the tests
```bash
npm run test
```

### 3.Start the server in the development mode
```bash
npm run dev
```

### 4. The server will be available at `http://localhost:5000`

# Documentation

## Base URL
The base URL for the API is `http://localhost:5000`

## Endpoints

### 1. Stack endpoints

### 1.1 Add an Item to the Stack
- Method: `POST`
- Endpoint: `/stack/add`
- Request Body: 
```json
{
  "item": "string"
}
```
- Response **(Success 201)**:
```json
{
  "success": true,
  "message": "Item 'item' successfully added to the stack.",
  "data": "item"
}
```
- Response **(Error 400)**:
```json
{
  "success": false,
  "message": "The 'item' field is required in the request body.",
  "data": null,
  "errorCode": "INVALID_PARAMS"
}
```

### 1.2 Remove an retrieve last item added  on the Stack
- Method: `POST`
- Endpoint: `/stack/pop`
- Request Body: `none`
- Response **(Success 200)**:
```json
{
  "success": true,
  "message": "Item 'item' successfully removed from the stack.",
  "data": "item"
}
```
- Response **(Error 400)**:
```json
{
  "success": false,
  "message": "The stack is empty",
  "data": null,
  "errorCode": "EMPTY_STACK"
}
```
### 2. Store endpoints

### 2.1 Add an item to the Store

- Method: `POST`
- Endpoint: `/store`
- Request Body: 
```json
{
  "key": "string",
  "value": "string",
  "ttl": "number" //(Optional) must be represented in seconds
}
```
- Response **(Success 201)**:
```json
{
  "success": true,
  "message": "Item successfully added to the store.",
  "data": {
    "key": "age",
    "value": "45"
  }
}
```
- Response **(Error 400)**:
```json
{
  "success": false,
  "message": "The 'key' and 'value' fields are required in the request body.",
  "data": null,
  "errorCode": "INVALID_PARAMS"
}
```
### 2.2 Retrieve an item from the Store

- Method: `GET`
- Endpoint: `/store/:key`
- Request Body: `none`
- Response **(Success 200)**:
```json
{
  "success": true,
  "message": "Item successfully retrieved from the store.",
  "data": "45"
}
```
- Response **(Success 200 TTL expired)**:
```json
{
  "success": true,
  "message": "Item successfully retrieved from the store.",
  "data": null
}
```

### 2.3 Delete an item from the Store

- Method: `DELETE`
- Endpoint: `/store/:key`
- Request Body: `none`
- Response **(Success 200)**:
```json
{
  "success": true,
  "message": "Item successfully removed from the store.",
  "data": null
}
```
- Response **(Error 404)**:
```json
{
  "success": false,
  "message": "Key not found",
  "data": null,
  "errorCode": "RESOURCE_NOT_FOUND"
}
```