module.exports = function () {
  process.on("uncaughtException", (ex) => {
    // you can also logged this using a package like winston
    console.log("uncaughtException error during start up", ex);
    //process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    // you can also logged this using a package like winston
    console.log("unhandledRejection promise error", ex);
    //process.exit(1);
  });
};
