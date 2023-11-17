const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require("./routes/user.route");

require("./db/firestore");

const app = express();

app.use(bodyParser.json());
app.use("/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
