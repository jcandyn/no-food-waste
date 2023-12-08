$(document).ready(function () {
  const signupButton = $(".signup-button");
  const loginButton = $(".login-button");
  const signupForm = $("#signup-form");
  const loginForm = $("#login-form");

  if ($("#error:contains('Invalid Username and/or Password')").length > 0) {
    loginForm.show();
    signupForm.hide();
  }

  signupButton.click(function () {
    signupButton.addClass("active");
    loginButton.removeClass("active");
    signupForm.show();
    loginForm.hide();
  });

  loginButton.click(function () {
    loginButton.addClass("active");
    signupButton.removeClass("active");
    loginForm.show();
    signupForm.hide();
  });
});
