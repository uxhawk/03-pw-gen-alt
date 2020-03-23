const spChar = "~!@#$%^&*()-_=+;:,<.>/?";
var alphaNumeric = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
var password = "";
var pw_strength;
var upperCase = /[A-Z]/g;
var lowerCase = /[a-z]/g;
var numbers = /[0-9]/g;

//object with form elements
let formEl = {
    pw_length: document.getElementById("pw_length"),
    sp_char: document.getElementById("spChar"),
    meter: document.getElementById("password-meter-strength"),
    pw_output: document.getElementById("pwOutput"),
    copy_btn: document.getElementById("copy-btn"),
    upperCase_check: document.getElementById("upperCaseCheckBox"),
    lowerCase_check: document.getElementById("LowerCaseCheckBox"),
    numbers_check: document.getElementById("numbersCheckBox")
}

// object with all the possible characters
// for a password
let characters = {
    alphaL: "abcdefghijklmnopqrstuvwxyz",
    alphaU: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    nums: "0123456789",
    spChars: "~!@#$%^&*()-_=+{}\|;:',<.>/?",
}

function generatePW() {
    //clear out the input field
    clearPWField();

    //set the copy button back to default call to action
    formEl.copy_btn.innerHTML = "Copy <i id=\"secondary-btn-icon\" class=\"far fa-copy\"></i>";

    //select random alpha numeric characters from the A-Z/a-z/0-9 string, 
    for (let i = 0; i < formEl.pw_length.value - formEl.sp_char.value; i++) {
        let ranNum = Math.floor(Math.random() * alphaNumeric.length);
        password += alphaNumeric.substring(ranNum, ranNum + 1);
    } //add in the special characters into random positions within the pw
    if (formEl.sp_char.value > 0) {
        for (let j = 0; j < formEl.sp_char.value; j++) {
            let ranNum = Math.floor(Math.random() * spChar.length);
            password = [password.slice(0, ranNum), spChar.substring(ranNum, ranNum + 1), password.slice(ranNum)].join('');
        }
    }

    //display the password in the input field
    formEl.pw_output.value = password;

    //function for zxcvbn here
    calcStrength();

    //reset back to nothing
    password = "";
}


//function to copy the password to clipboard
function copyPW() {

    /* Select the text field */
    formEl.pw_output.select();
    formEl.pw_output.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    formEl.copy_btn.innerHTML = "Copied <i id=\"secondary-btn-icon\" class=\"fas fa-check\"></i>";

    //remove focus from the input field
    formEl.pw_output.blur();
}

//add click event listeners to all of the +/- icons pre/appended to inputs
let steppers = document.getElementsByClassName("input-group");
Array.from(steppers).forEach(function(element) {
    element.addEventListener('click', valueChange);
});


//add event listeners to all of the checkbox form elements
let checkBoxes = document.getElementsByClassName("form-check-input");
Array.from(checkBoxes).forEach(function(element) {
    element.addEventListener('click', checkEmptyPW);
});


//if the three character types - uppercase, lowercase, and numbers, are deselected, special characters = pw length
function checkEmptyPW() {
    if (alphaNumeric === "") {
        formEl.sp_char.value = formEl.pw_length.value;
    }
}


//add event listener to pw field to calculate strength on input
formEl.pw_output.addEventListener('input', setPW);

function setPW() {
    password = formEl.pw_output.value;
}

formEl.pw_output.addEventListener('input', calcStrength);

//change password variables based on the user's selections
function valueChange(element) {
    let touchTarget = element.target.closest('span').getAttribute("id");

    //if you reduce the password length
    if (touchTarget === "minus-pwl") {

        if (formEl.pw_length.value > 1 && formEl.pw_length.value != formEl.sp_char.value) {
            minusPW();

        } else {
            if (formEl.pw_length.value > 1) {
                minusPW();
                minusSPChar();
            }
        }
    }
    //if you increase the password length
    else if (touchTarget === "plus-pwl" && alphaNumeric === "") {
        plusPW();
        plusSPChar();
    } //if you increase the password length
    else if (touchTarget === "plus-pwl") {
        plusPW();
    }

    //if you reduce the amount of special characters
    else if (touchTarget === "minus-spChar") {

        if (formEl.sp_char.value > 1 && alphaNumeric == "") {
            minusSPChar();
            minusPW();
        } else if (formEl.sp_char.value > 0 && alphaNumeric !== "")
            minusSPChar();
    }
    //if you increase the amount of special characters
    else if (touchTarget === "plus-spChar") {

        if (formEl.pw_length.value === formEl.sp_char.value) {
            plusSPChar();
            plusPW();
        } else {
            plusSPChar();
        }
    } else {}
}


//functions to change password character variables
function minusPW() {
    formEl.pw_length.value--;
}

function plusPW() {
    formEl.pw_length.value++;
}

function minusSPChar() {
    formEl.sp_char.value--;
}

function plusSPChar() {
    formEl.sp_char.value++;
}

//function to call zxcvbn
function calcStrength() {
    var result = zxcvbn(password);
    //update the password strength meter
    pw_strength = result.score;

    //calulate percentage because <progress> tag only accepts width style in %
    pw_strength = (pw_strength / 4) * 100 + "%";
    formEl.meter.setAttribute('style', "width:" + pw_strength);

    //style the meter based off strength
    if (pw_strength === "25%") {
        formEl.meter.classList.add("bg-warning");
        formEl.meter.classList.remove("bg-danger", "bg-info", "bg-success");

    } else if (pw_strength === "50%") {
        formEl.meter.classList.add("bg-info");

        formEl.meter.classList.remove("bg-danger", "bg-warning", "bg-success");

    } else if (pw_strength === "75%") {
        formEl.meter.classList.remove("bg-success", "bg-danger", "bg-info", "bg-warning");

    } else if (pw_strength === "100%") {
        formEl.meter.classList.add("bg-success");

        formEl.meter.classList.remove("bg-info", "bg-warning", "bg-danger");

    } else if (pw_strength === "0%") {
        formEl.meter.classList.add("bg-danger");
        formEl.meter.setAttribute('style', "width: 5%");

        formEl.meter.classList.remove("bg-success", "bg-info", "bg-warning");
    }
}

function clearPWField() {
    formEl.pw_output.value = "";
    password = formEl.pw_output.value;

}

// **********Toggle functions to add or remove character types from PW string**********
function toggleUpperCase() {
    if (alphaNumeric.match(upperCase)) {
        alphaNumeric = alphaNumeric.replace(/[A-Z]/g, "");
        return;

    } else {
        alphaNumeric = alphaNumeric.concat(characters.alphaU);
    }
}

function toggleLowerCase() {
    if (alphaNumeric.match(lowerCase)) {
        alphaNumeric = alphaNumeric.replace(/[a-z]/g, "");
        return;

    } else {
        alphaNumeric = alphaNumeric.concat(characters.alphaL);
    }
}

function toggleNumbers() {
    if (alphaNumeric.match(numbers)) {
        alphaNumeric = alphaNumeric.replace(/[0-9]/g, "");
        return;

    } else {
        alphaNumeric = alphaNumeric.concat(characters.nums);
    }
}