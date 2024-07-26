const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const adminLayout = "../views/layouts/admin";

// Routes

// check login

const authMiddelware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decode = jwt.verify(token, jwtSecret);
    req.userId = decode.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// get
// Admin - login page

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple blog post with Nodejs, Express and Mongo",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// post
// Admin - check login page

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credential" });
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password);
    if (!ispasswordvalid) {
      return res.status(401).json({ message: "Invalid Credential" });
    }
    const token = jwt.sign({ userid: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// get
// Admin - dashboard page

router.get("/dashboard", authMiddelware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple blog post with Nodejs, Express and Mongo",
    };
    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// get
// Admin - create new post page

router.get("/add-post", authMiddelware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple blog post with Nodejs, Express and Mongo",
    };
    // const data = await Post.find();
    res.render("admin/add-post", {
      locals,

      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// post
// Admin - create new post page

router.post("/add-post", authMiddelware, async (req, res) => {
  try {
    console.log(req.body);
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

// get
// Admin - edit post page

router.get("/edit-post/:id", authMiddelware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Simple blog post with Nodejs, Express and Mongo",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// put
// Admin - create an update page

router.put("/edit-post/:id", authMiddelware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/dashboard`);
  } catch (error) {
    console.log(error);
  }
});

// await Post.findByIdAndUpdate(req.params.id, {
//   title: req.body.title,
//   body: req.body.body,
//   updatedAt: Date.now(),
// });
// res.redirect(`/edit-post/${req.params.id}`)

// router.post("/admin", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     console.log(req.body);
//     res.redirect("/admin");
//   } catch (error) {
//     console.log(error);
//   }
// });

// post
// Admin - register page

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({ username, password: hashPassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      } else {
        res.status(500).json({ message: "Internal Server error" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// delete
// Admin - delete post page

router.delete("/delete-post/:id", authMiddelware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect(`/dashboard`);
  } catch (error) {
    console.log(error);
  }
});

// get
// Admin - logout page

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  // res.json({ message: "logOut successfully" });
  res.redirect("/");
});

module.exports = router;
