const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const server = require("http").createServer(app);
const port = 4000 || process.env.PORT;
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
// const Product = require("./data/product");
require("dotenv").config({ path: path.resolve(__dirname, "/.env") });

const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
app.use(
	cors({
		origin: "*",
	})
);

if(process.env.NODE_ENV==="development"){
    console.log("development");
    app.use(morgan("dev"))
}


 mongoose
		.connect(
			"mongodb+srv://jay-admin:jay-admin@cluster0.vj1iu.mongodb.net/ecommerceDb?retryWrites=true&w=majority",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		)
		.then(() => {
			console.log("Mongodb is conneccted");
		})
		.catch((e) => {
			console.log(e);
		});

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

const dirname = path.resolve();
app.use("/uploads", express.static(path.join(dirname, "/uploads")));
// app.use(require("./routes/sample"));
app.use("/api/products", productRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/uploads", uploadRouter);

app.get("/api/config/paypal", (req, res) => {
	// console.log("CALLED");
	res.status(200).json(process.env.PAYPAL_CLIENT_ID);
});


console.log(path.resolve(__dirname,"../", "client", "build", "index.html"),process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/build")));
console.log(__dirname);
	 app.get("*", (req, res) =>
			res.sendFile(path.resolve(__dirname,"../", "client", "build", "index.html"))
		);
} else {
	app.get("/", (req, res) => {
		res.send("API is running....");
	});
}

//api wrong
app.use(notFound);
//Error middleware
//api right but doesnot match value
app.use(errorHandler);
// app.use(bodyParser.urlencoded({extended:true})) better to use express
// was not available in express in previous version

server.listen(port, () => {
	console.log(`server listen at http://localhost:${port}`);
});
