module.exports = function () {
  process.on("uncaughtException", (ex) => {
    // you can also logged this using a package like winston
    console.log("uncaught error during start up");
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    // you can also logged this using a package like winston
    console.log("unhandled promise error");
    process.exit(1);
  });
};
