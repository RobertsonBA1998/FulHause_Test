## Packages Used For This Test

- Create React App
- Express
- Styled Components
- Morgan
- Mongodb
- React Router Dom
- React Icons

## Instructions On Starting Up The BACKEND and FRONTEND

_Activating the Backend_

1. The server.js is located in the Aptutude_Test folder:

   1.1 Write in the terminal: nodemon server.js to begin the backend

   1.2 The server will start

_Activating the Frontend_

2. The frontend is activated by getting into my-app folder:

   2.1 Write in the terminal: cd my-app

   2.3 Write in the terminal: npm start

   2.4 The Frontend will start

## Endpoints

**Endpoints for Acronyms**

- GET /acronyms

This will return a JSON object with all acronyms in the database.

---

- POST /acronyms

The request body should be a JSON object containing the new acronym data. The server will respond with a JSON object representing the newly created acronym.

---

- PATCH /acronyms/:\_id

Replace `:_id` with the ID of the acronym you want to update. The request body should be a JSON object containing the updated acronym data. The server will respond with a JSON object representing the updated acronym.

---

- DELETE /acronyms/:\_id

Replace `:_id` with the ID of the acronym you want to delete. The server will respond with a JSON object indicating whether the deletion was successful.

---

**Endpoints for User**

_Mongodb was used for the e-commerce website as the database_

_Robert was used as an example of a customer of the website_

- GET /user

This will return a JSON object with all users in the database, along with their cart if they have one.

---

- GET /user/:\_id

Replace `:_id` with the ID of the user you want to retrieve. The server will respond with a JSON object representing the user.

---

- POST /user/:\_id/cart

Replace `:_id` with the ID of the user whose cart you want to add the item to. The request body should be a JSON object containing the item data. The server will respond with a JSON object representing the updated cart.

---

- PATCH /user/:\_id/cart

Replace `:_id` with the ID of the user whose cart you want to update. The request body should be a JSON object containing the updated cart data. The server will respond with a JSON object representing the updated cart.

---

- DELETE /user/:\_id/cart
  Replace `:_id` with the ID of the user whose cart you want to delete. The server will respond with a JSON object indicating whether the deletion was successful.

---

- DELETE /user/:\_id/cart/:productId

Replace `:_id` with the ID of the user whose cart you want to delete the item from, and `:productId` with the ID of the product you want to remove from the cart. The server will respond with a JSON object representing the updated cart.
