require("dotenv").config();

const app = require("./app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;

const homeRoutes = require("./src/routes/homeRoutes");
app.use("/api/home", homeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});