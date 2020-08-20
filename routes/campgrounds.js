var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
	MiddleWare = require("../middleware");

//Index Route
router.get("/", function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if (err) console.log(err);
		else {
			res.render("campgrounds/index.ejs", {campground: allCampgrounds});
		}
	});
});

//New Route
router.get("/new", MiddleWare.isLoggedIn, function(req, res) {
	res.render("campgrounds/new.ejs");
});

//Create Route
router.post("/", MiddleWare.isLoggedIn, function(req, res) {
	req.body.campground.description = req.sanitize(req.body.campground.description);
	var newCamp = req.body.campground;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	newCamp.author = author;
	Campground.create(newCamp, function (err, newone) {
		if (err) console.log(err);
		else {
			res.redirect("/campground");
		}
	});
});

//Show Route
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, found) {
		if (err) console.log(err);
		else {
			res.render("campgrounds/show.ejs", {campground: found});
		}
	});
});

//Edit Route
router.get("/:id/edit", MiddleWare.campIsPermitted, function(req, res) {
	Campground.findById(req.params.id, function(err, found) {
		res.render("campgrounds/edit.ejs", {campground: found});
	});
});

//Update Route
router.put("/:id", MiddleWare.campIsPermitted, function(req, res) {
	req.body.campground.description = req.sanitize(req.body.campground.description);
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated) {
		if (err) console.log(err);
		else {
			res.redirect("/campground/" + req.params.id);
		}
	});
});

//Delete Route
router.delete("/:id", MiddleWare.campIsPermitted, async(req, res) => {
	try {
    	let foundCampground = await Campground.findById(req.params.id);
    	await foundCampground.delete();
		req.flash("success", "Campground Deleted");
    	res.redirect("/campground");
  	} catch (error) {
    	console.log(error.message);
    	res.redirect("/campground");
  	}
});


module.exports = router;

