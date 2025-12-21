const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('loginEmail');
const signupPassword = document.getElementById('loginPassword');
const signupConfirmPassword = document.getElementById('signupConfirmPassword');
const termsCheckbox = document.getElementById('termsCheckbox');
const signupBtn = document.getElementById('signupBtn');
const signupForm = document.getElementById('signupForm');

signupName.addEventListener('input', validateForm);
signupEmail.addEventListener('input', validateForm);
signupPassword.addEventListener('input', validateForm);
signupConfirmPassword.addEventListener('input', validateForm);
termsCheckbox.addEventListener('change', validateForm);
signupForm.addEventListener('submit', handleSignup);

function validateForm() {
    const nameFilled = signupName.value.trim() !== '';
    const emailFilled = signupEmail.value.trim() !== '';
    const passwordFilled = signupPassword.value !== '';
    const passwordsMatch = signupPassword.value === signupConfirmPassword.value && signupConfirmPassword.value !== '';
    const termsAccepted = termsCheckbox.checked;

    const formIsValid = nameFilled && emailFilled && passwordFilled && passwordsMatch && termsAccepted;
    signupBtn.disabled = !formIsValid;

    console.log({
        nameFilled,
        emailFilled,
        passwordFilled,
        passwordsMatch,
        termsAccepted
    });
}

function handleSignup(event) {
    event.preventDefault();

    const userData= {
        name: signupName.value.trim(),
        email: signupEmail.value.trim(),
        password: signupPassword.value,
        confirmPasswor: signupConfirmPassword.value,
        acceptedTerms: termsCheckbox.checked
    }
    console.log('User-Daten gesammelt:', userData);
}

