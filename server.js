import dotenv from 'dotenv';
dotenv.config();


import app from "./src/app.js";
import { addColumnToUserTable, createDatabase, updatePhoneNumber } from "./src/services/database.service.js";
import { createUserTable } from "./src/models/user.model.js";
import { insertUser } from "./src/services/database.service.js";
import { fetchUsers } from "./src/services/database.service.js";
import { updateUserEmail } from "./src/services/database.service.js";
import { deleteUser } from "./src/services/database.service.js";

//const PORT = 3000; //dont use this port here use it fronm env file

const PORT = process.env.PORT || 3000;

// Run startup tasks
// await createDatabase("hello");
// await createUserTable();
// await insertUser();
// await fetchUsers();
// await updateUserEmail('Ram', 'r@gmail.com');
// await addColumnToUserTable();
// await updatePhoneNumber([26, 24], ['9876543210', '9865432109']);
// await deleteUser([25,35,37]);



// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
