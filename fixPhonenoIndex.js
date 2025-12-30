// import mongoose from "mongoose";
// import User from "./src/models/user.model.js";

// const MONGO_URI = ""; // <-- update this

// async function fixIndex() {
//   await mongoose.connect(MONGO_URI);

//   // Drop the old 'phone' index if it exists
//   try {
//     await User.collection.dropIndex("phone_1");
//     console.log("Dropped old phone index.");
//   } catch (err) {
//     if (err.codeName === "IndexNotFound") {
//       console.log("No old phone index found.");
//     } else {
//       console.error(err);
//     }
//   }

//   // Drop the old 'phoneNo' index if it exists
//   try {
//     await User.collection.dropIndex("phoneNo_1");
//     console.log("Dropped old phoneNo index.");
//   } catch (err) {
//     if (err.codeName === "IndexNotFound") {
//       console.log("No old phoneNo index found.");
//     } else {
//       console.error(err);
//     }
//   }

//   // Create the correct unique index
//   await User.collection.createIndex({ phoneNo: 1 }, { unique: true });
//   console.log("Created unique index on phoneNo.");

//   await mongoose.disconnect();
// }

// fixIndex();