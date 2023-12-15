$(document).ready(function () {
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: 10000,
  };
  $("#login-form").submit(function (event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Clear previous error messages
    clearErrorMessage();

    // Get form data
    var formData = $(this).serialize();

    // Make AJAX request
    $.ajax({
      type: "POST",
      url: "/authenticate/login",
      data: formData,
      success: function (response) {
        window.location.href = "/food";
      },
      error: function (xhr, status, error) {
        var errorMessage = xhr.responseJSON ? xhr.responseJSON.error : error;
        displayErrorMessage(errorMessage);
      },
    });
  });

  function clearErrorMessage() {
    toastr.clear();
  }

  function displayErrorMessage(message) {
    clearErrorMessage();
    toastr.info(message);
  }

  $("#signup-form").submit(function (event) {
    event.preventDefault();

    if (!validateSignUpForm()) {
      return;
    }

    this.submit();
  });

  function validateSignUpForm() {
    var isValid = true;

    var firstName = $("#firstName").val();
    if (firstName.trim() === "") {
      displayErrorMessage("First name is required.");
      isValid = false;
    }

    var lastName = $("#lastName").val();
    if (lastName.trim() === "") {
      displayErrorMessage("Last name is required.");
      isValid = false;
    }

    var dateOfBirth = $("#dateOfBirth").val();
    if (!dateOfBirth) {
      displayErrorMessage("Date of birth is required.");
      isValid = false;
    } else {
      //  birth date is not in the future
      var currentDate = new Date();
      var selectedDate = new Date(dateOfBirth);
      if (selectedDate > currentDate) {
        displayErrorMessage("Birth date cannot be in the future.");
        isValid = false;
      }

      // user is at least 18 years old
      var age = currentDate.getFullYear() - selectedDate.getFullYear();
      if (age < 18) {
        displayErrorMessage("You must be at least 18 years old.");
        isValid = false;
      }
    }

    var email = $("#email").val();
    if (!isValidEmail(email)) {
      displayErrorMessage("Invalid email address.");
      isValid = false;
    }

    var phoneNumber = $("#phoneNumber").val();
    if (!isValidPhoneNumber(phoneNumber)) {
      displayErrorMessage("Invalid phone number.");
      isValid = false;
    }

    var password = $("#password").val();
    if (!isValidPassword(password)) {
      displayErrorMessage(
        "Password must contain a capital letter, a lowercase letter, a number, and a special character."
      );
      isValid = false;
    }

    var confirmPassword = $("#confirmPassword").val();
    if (confirmPassword !== password) {
      displayErrorMessage("Passwords do not match.");
      isValid = false;
    }

    return isValid;
  }

  function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhoneNumber(phoneNumber) {
    var phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  }

  function isValidPassword(password) {
    var passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

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
