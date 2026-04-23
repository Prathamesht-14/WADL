function validateForm() {

    // Read values
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var mobile = document.getElementById("mobile").value.trim();
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    // 1. Name: only alphabets and space
    var namePattern = /^[A-Za-z ]+$/;
    if (!namePattern.test(name)) {
        alert("Name should contain only alphabets and spaces");
        return false;
    }

    // 2. Email: no spaces
    if (email.indexOf(" ") !== -1) {
        alert("Email should not contain spaces");
        return false;
    }

    // 3. Mobile: start with 6-9 and exactly 10 digits
    var mobilePattern = /^[6-9][0-9]{9}$/;
    if (!mobilePattern.test(mobile)) {
        alert("Mobile number must start with 6-9 and be exactly 10 digits");
        return false;
    }

    // 4. Password: min 6 chars, one capital, one special character
    var passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordPattern.test(password)) {
        alert("Password must be at least 6 characters, include one capital letter and one special character");
        return false;
    }

    // 5. Confirm password
    if (password !== confirmPassword) {
        alert("Password and Confirm Password must be same");
        return false;
    }

    // SUCCESS
    alert("File is successful registration");
    window.location.href = "home_css.html";
    return false;
}
