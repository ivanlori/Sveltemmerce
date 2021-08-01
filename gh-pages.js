var ghpages = require("gh-pages");

ghpages.publish(
  "public", // path to public directory
  {
    branch: "gh-pages",
    repo: "https://github.com/ivanlori/Sveltemmerce.git", // Update to point to your repository
    user: {
      name: "Ivan",
      email: "ivan.lori@protonmail.com",
    },
  },
  () => {
    console.log("Deploy Complete!");
  }
);
