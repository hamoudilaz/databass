# Hello! 

This project is a REST API built with Node.js and Express to manage products that interact with MongoDB Cloud Atlas. It allows users to perform CRUD operations on a product database, search for products, and view them in an HTML table.


So how to run the project? 

1.Start by opening up the terminal and download the dependencies:
   npm install

2. Start the Server
After the dependencies is installed you can start the server in development mode or run automated tests:


To run in development mode, type this in the terminal:
   npm run dev
The server will start and the default port is 3000.
If the server started successfullly you will be able to see a table list when you visit http://localhost:3000/

Run Tests: To test the API routes, type this into the terminal:
   npm test

This will run automated tests to verify the API functionality.
If all the tests pass you will see a green checkmark on each test that indicates a successful run.

This is which CRUD methods i have in my project:

| HTTP Method | Endpoint                | Description                                                                                    |
|-------------|-------------------------|------------------------------------------------------------------------------------------------|
| GET         | /api/products           | Retrieve all products from the database in JSON format.                                        |
| POST        | /api/products           | Add a new product to the database. Requires a JSON body with product details.                  |
| GET         | /api/products/:id       | Retrieve a specific product by its ID.                                                         |
| PUT         | /api/products/:id       | Update an existing product. Requires the product ID and a JSON body with updated details.      |
| DELETE      | /api/products/:id       | Delete a product by its ID.                                                                    |
| DELETE      | /api/products           | Delete all products in the database.                                                           |
| GET         | /api/products/search    | Search for products where the `price` is greater than the specified value. Use a query parameter (e.g., `/api/products/search?price=10`). |
| GET         | /                       | View all products in an HTML table.                                                            |


In the POST request, Make sure to include what the Schema got as required. In my Schema i have "name" and "description" as required = true
Else the POST request will not work.
