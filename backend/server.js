import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

// DB Connection
await connectDB(process.env.MONGODB_URI);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`server is running...`));
