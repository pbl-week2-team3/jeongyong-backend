const emailIsValid = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");


const nicknameIsValid = (nickname) => {
    const exp = /^[a-zA-Z0-9]{3,}$/;
    return exp.test(nickname);
};

const passwordIsValid = (nickname, password, confirmPassword) => {
    if (password.length < 4)
        return false

    if (password !== confirmPassword)
        return false

    return !password.includes(nickname)
};

module.exports = {
    emailIsValid,
    nicknameIsValid,
    passwordIsValid
};