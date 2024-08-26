const app = require("./app");

app.listen(8080, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Listening on 8080");
  }
});
