const express = require("express");
var router = express.Router();

const path = require("path");

router.get("/", (req, res) => {
    res.render("index", {
      layout: path.join(__dirname, "../layouts/main"),
      footer: false,
    });
});

router.get("/creator", (req, res) => {
    res.render("pages/creator", {
        layout: path.join(__dirname, "../layouts/main"),
        footer: true,
    });
});

router.get("/match", (req, res) => {
    const rounds = require("../data/match.json");
    const algorithm = require("../data/algorithm.json");
    const score = [0, 15, 30, 40, 50];
    res.render("pages/match", {
        layout: path.join(__dirname, "../layouts/main"),
        footer: true,
        rounds,
        algorithm,
        score,
    });
});

router.get("/dashboard", (req, res) => {
    res.render("dashboard", {
        layout: path.join(__dirname, "../layouts/dashboard"),
        footer: true,
    });
});

router.get("/settings", (req, res) => {
    res.render("settings", {
        layout: path.join(__dirname, "../layouts/dashboard"),
        footer: true,
    });
});

router.get("/authentication/forgot-password", (req, res) => {
    res.render("authentication/forgot-password", {
        layout: path.join(__dirname, "../layouts/main"),
        navigation: false,
        footer: false,
    });
});

router.get("/authentication/profile-lock", (req, res) => {
    res.render("authentication/profile-lock", {
        layout: path.join(__dirname, "../layouts/main"),
        navigation: false,
        footer: false,
    });
});

router.get("/authentication/sign-in", (req, res) => {
    res.render("authentication/sign-in", {
        layout: path.join(__dirname, "../layouts/main"),
        navigation: false,
        footer: false,
    });
});

router.get("/authentication/sign-up", (req, res) => {
    res.render("authentication/sign-up", {
        layout: path.join(__dirname, "../layouts/main"),
        navigation: false,
        footer: false,
    });
});

router.get("/authentication/reset-password", (req, res) => {
    res.render("authentication/reset-password", {
        layout: path.join(__dirname, "../layouts/main"),
        navigation: false,
        footer: false,
    });
});

router.get("/crud/products", (req, res) => {
    const products = require("./data/products.json");
    res.render("crud/products", {
        layout: path.join(__dirname, "../layouts/dashboard"),
        footer: false,
        products,
    });
});

router.get("/crud/users", (req, res) => {
    const users = require("./data/users.json");
    res.render("crud/users", {
        layout: path.join(__dirname, "../layouts/dashboard"),
        footer: false,
        users,
    });
});

router.get("../layouts/stacked", (req, res) => {
    res.render("layouts/stacked", {
        layout: path.join(__dirname, "../layouts/stacked-layout"),
        footer: true,
    });
});

router.get("../layouts/sidebar", (req, res) => {
    res.render("layouts/sidebar", {
        layout: path.join(__dirname, "../layouts/dashboard"),
        footer: true,
    });
});

router.get("/pages/404", (req, res) => {
    res.render("pages/404", {
        layout: path.join(__dirname, "../layouts/main"),
        navigation: false,
        footer: false,
    });
});

router.get("/pages/500", (req, res) => {
    res.render("pages/500", {
        layout: path.join(__dirname, "../layouts/main"),
        navigation: false,
        footer: false,
    });
});

router.get("/pages/maintenance", (req, res) => {
    res.render("pages/maintenance", {
        layout: path.join(__dirname, "../layouts/main"),
        navigation: false,
        footer: false,
    });
});

router.get("/pages/pricing", (req, res) => {
    res.render("pages/pricing", {
        layout: path.join(__dirname, "../layouts/main"),
        navigation: true,
        footer: false,
    });
});

router.get("/playground/sidebar", (req, res) => {
    res.render("playground/sidebar", {
        layout: path.join(__dirname, "../layouts/dashboard"),
        footer: true,
    });
});

router.get("/playground/stacked", (req, res) => {
    res.render("playground/stacked", {
        layout: path.join(__dirname, "../layouts/stacked-layout"),
        footer: true,
    });
});

module.exports = router;