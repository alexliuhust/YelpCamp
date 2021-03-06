var express     = require("express"),
	Campground 	= require("../models/campground"),
	Comment 	= require("../models/comment");

var MiddleWare = {};

MiddleWare.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) return next();
	req.flash("error", "Please Log In First");
	res.redirect("/login");
}

MiddleWare.campIsPermitted = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, found) {
			if (err) {
				req.flash("error", "Campground not found!");
				res.redirect("back");
			}
			else {
				if (found.author.id.equals(req.user._id)) return next();
				req.flash("error", "You are not permitted!");
				res.redirect("back");
			}
		});
	} else {
		req.flash("error", "Please Log In First");
		res.redirect("back");
	}
	
}

MiddleWare.comIsPermitted = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comid, function(err, found) {
			if (err) {
				req.flash("error", "comment not found!");
				res.redirect("back");
			}
			else {
				if (found.author.id.equals(req.user._id)) return next();
				req.flash("error", "You are not permitted!");
				res.redirect("back");
			}
		});
	} else {
		req.flash("error", "Please Log In First");
		res.redirect("back");
	}
}

module.exports = MiddleWare

