var express 	= require("express"),
	router  	= express.Router(),
	passport 	= require("passport"),
	User 		= require("../models/user");


//=====================Authentication Routes!!!=======================
router.get("/", function(req, res) {
	res.render("landings.ejs");
});

router.get("/register", function(req, res) {
	res.render("authentication/register.ejs");
});
router.post("/register", function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var newUser = new User({username: username});
	User.register(newUser, password, function(err, user) {
		if (err) {
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			passport.authenticate("local")(req, res, function() {
				req.flash("success", "Sign Up!");
				res.redirect("/campground");
			});
		}
	});
});

router.get("/login", function(req, res) {
	res.render("authentication/login.ejs");
});
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campground",
	failureRedirect: "/login"
}), function(req, res) {
});

router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Successfully Logged Out!");
	res.redirect("/campground");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

module.exports = router;



