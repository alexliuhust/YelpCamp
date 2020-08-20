var express    	= require("express"),
    router     	= express.Router({mergeParams: true}),
    Campground 	= require("../models/campground"),
    Comment 	= require("../models/comment"),
	MiddleWare = require("../middleware");

// New Route
router.get("/new", MiddleWare.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, found) {
		if (err) console.log(err);
		else {
			res.render("comments/new.ejs", {campground: found});
		}
	});
});

// Create Route
router.post("/", MiddleWare.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, found) {
		if (err) console.log(err);
		else {
			Comment.create(req.body.comment, function(err, newComment) {
				if (err) comsole.log(err);
				else {
					
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					
					found.comments.push(newComment);
					found.save();
					res.redirect("/campground/" + req.params.id);
				}
			});
		}
	});
});

//Edit Route
router.get("/:comid/edit", MiddleWare.comIsPermitted, function(req, res) {
	Comment.findById(req.params.comid, function(err, found) {
		if (err) res.redirect("back");
		else {
			res.render("comments/edit.ejs",{campground_id: req.params.id, comment: found});
		}
	});
	
	
});

//Update Route
router.put("/:comid", MiddleWare.comIsPermitted, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comid, req.body.comment, function(err, found) {
		if (err) res.redirect("back");
		else {
			res.redirect("/campground/" + req.params.id);
		}
	});
});

//Delete Route
router.delete("/:comid", MiddleWare.comIsPermitted, function(req, res) {
	Comment.findByIdAndDelete(req.params.comid, function(err) {
		if (err) res.redirect("back");
		else {
			res.redirect("/campground/" + req.params.id);
		}
	});
});

//======================Middleware functions============================
// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()) return next();
// 	res.redirect("/login");
// }

// function isPermitted(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		Comment.findById(req.params.comid, function(err, found) {
// 			if (err) res.redirect("back");
// 			else {
// 				if (found.author.id.equals(req.user._id)) {
// 					return next();
// 				} 
// 				res.redirect("back");
// 			}
// 		});
// 	} else {
// 		res.redirect("back");
// 	}
// }

module.exports = router;


