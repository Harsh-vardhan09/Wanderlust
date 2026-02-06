const User = require("../models/user.js");



module.exports.renderSignUpForm=(req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req, res) => {
  res.render("users/login.ejs");
}

module.exports.login=async (req, res) => {
    // res.send("welcome to wanderLust,you are logged in")
    req.flash("success", "welcome to wanderLust");
    let redirectUrl=res.locals.redirectUrl||"/listings"
    res.redirect(redirectUrl);
}

module.exports.Logout=(req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("Success", "you are logged out now");
    res.redirect("/listings");
  })}