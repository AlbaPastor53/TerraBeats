function register() {
    if (validate_register()) {
        var data = $('#form-register').serialize();

        ajaxPromise('index.php?page=controller_auth&op=register', 'POST', 'JSON', data)
            .then(function(result) {
                console.log(result);
                if (result == "error_email") {
                    var msgBox = document.getElementById('msg-register');
                    msgBox.innerHTML = "El email ya está en uso, asegúrate de no tener ya una cuenta";
                    msgBox.className = "auth-msg auth-msg--error";
                } else if (result == "error_username") {
                    var msgBox = document.getElementById('msg-register');
                    msgBox.innerHTML = "El usuario ya está en uso, inténtalo con otro";
                    msgBox.className = "auth-msg auth-msg--error";
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Register successfully',
                        showConfirmButton: false,
                        timer: 2000
                        });
                    setTimeout(' window.location.href = "index.php?page=controller_auth&op=view"; ', 2000);
                }
            }).catch(function(textStatus) {
                if (console && console.log) {
                    console.log("La solicitud ha fallado: " + textStatus);
                }
            });
    }
}

function validate_register() {
    var username_exp = /^(?=.{5,}$)(?=.*[a-zA-Z0-9]).*$/;
    var mail_exp = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
    var passwd_exp = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
    var error = false;

    var username = document.getElementById('reg-username').value;
    var email    = document.getElementById('reg-email').value;
    var password = document.getElementById('reg-password').value;
    var terms    = document.getElementById('terms').checked;
    var msgBox   = document.getElementById('msg-register');


    msgBox.innerHTML = "";
    msgBox.className = "auth-msg";

    // Username
    if (username.length === 0) {
        msgBox.innerHTML = "Tienes que escribir el usuario";
        msgBox.className = "auth-msg auth-msg--error";
        error = true;
    } else if (username.length < 5) {
        msgBox.innerHTML = "El username tiene que tener 5 caracteres como mínimo";
        msgBox.className = "auth-msg auth-msg--error";
        error = true;
    } else if (!username_exp.test(username)) {
        msgBox.innerHTML = "No se pueden poner caracteres especiales en el usuario";
        msgBox.className = "auth-msg auth-msg--error";
        error = true;
    }

    // Email
    if (!error) {
        if (email.length === 0) {
            msgBox.innerHTML = "Tienes que escribir un correo";
            msgBox.className = "auth-msg auth-msg--error";
            error = true;
        } else if (!mail_exp.test(email)) {
            msgBox.innerHTML = "El formato del mail es inválido";
            msgBox.className = "auth-msg auth-msg--error";
            error = true;
        }
    }

    // Password
    if (!error) {
        if (password.length === 0) {
            msgBox.innerHTML = "Tienes que escribir la contraseña";
            msgBox.className = "auth-msg auth-msg--error";
            error = true;
        } else if (password.length < 8) {
            msgBox.innerHTML = "La contraseña tiene que tener 8 caracteres como mínimo";
            msgBox.className = "auth-msg auth-msg--error";
            error = true;
        } else if (!passwd_exp.test(password)) {
            msgBox.innerHTML = "Debe contener mínimo 8 caracteres, mayúsculas, minúsculas y símbolos especiales";
            msgBox.className = "auth-msg auth-msg--error";
            error = true;
        }
    }

    // Terms
    if (!error) {
        if (!terms) {
            msgBox.innerHTML = "Debes aceptar los Términos y la Política de Privacidad";
            msgBox.className = "auth-msg auth-msg--error";
            error = true;
        }
    }

    if (error) return false;
    return true;
}

function key_register() {
    $("#btn-register").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            e.preventDefault();
            register();
        }
    });
}

function button_register() {
    $('#btn-register').on('click', function(e) {
        e.preventDefault();
        register();
    });
}

function key_login() {
    $("#btn-login").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            e.preventDefault();
            login();
        }
    });
}

function button_login() {
    $('#btn-login').on('click', function(e) {
        e.preventDefault();
        login();
    });
}

function validate_login() {
    var error = false;

    var identity = document.getElementById('login-identity').value;
    var password = document.getElementById('login-password').value;
    var msgLogin = document.getElementById('msg-login');

    msgLogin.innerHTML = "";
    msgLogin.className = "auth-msg";

    // Validación usuario/correo
    if (identity.length === 0) {
        msgLogin.innerHTML = "Tienes que escribir el usuario o correo";
        msgLogin.className = "auth-msg auth-msg--error";
        error = true;
    } else if (identity.length < 5) {
        msgLogin.innerHTML = "El usuario tiene que tener 5 caracteres como mínimo";
        msgLogin.className = "auth-msg auth-msg--error";
        error = true;
    }

    // Validación contraseña
    if (!error) {
        if (password.length === 0) {
            msgLogin.innerHTML = "Tienes que escribir la contraseña";
            msgLogin.className = "auth-msg auth-msg--error";
            error = true;
        }
    }

    if (error) return false;
    return true;
}

function login() {
    
    if (validate_login()) {
        var data = $('#form-login').serialize();
        ajaxPromise('index.php?page=controller_auth&op=login', 'POST', 'JSON', data)
            .then(function(result) {
                console.log(result);
                if (result == "error_user") {
                    document.getElementById('msg-login').innerHTML = "El usario o correo no existe,asegurese de que lo ha escrito correctamente";
                    document.getElementById('msg-login').className = "auth-msg auth-msg--error";
                } else if (result == "error_passwd") {
                    document.getElementById('msg-login').innerHTML = "La contraseña es incorrecta";
                    document.getElementById('msg-login').className = "auth-msg auth-msg--error";
                } else {
                    localStorage.setItem("token_JWT", result);
                    Swal.fire({
                        icon: 'success',
                        title: 'Loged successfully',
                        showConfirmButton: false,
                        timer: 2000
                        });
                       setTimeout(' window.location.href = "index.php?page=controller_home&op=view"; ', 2000);
                }
            }).catch(function(textStatus) {
                if (console && console.log) {
                    console.log("La solicitud ha fallado: " + textStatus);
                }
            });
    }
}

function tabsAuth() {
    $('#tab-login').on('click', function () {
        switchForm('login');
    });
    $('#tab-register').on('click', function () {
        switchForm('register');
    });
}
 
function switchForm(type) {
    if (type === 'login') {
        $('#login-container').removeClass('auth-form-wrapper--hidden');
        $('#register-container').addClass('auth-form-wrapper--hidden');
        $('#tab-login').addClass('auth-tab--active');
        $('#tab-register').removeClass('auth-tab--active');
    } else {
        $('#register-container').removeClass('auth-form-wrapper--hidden');
        $('#login-container').addClass('auth-form-wrapper--hidden');
        $('#tab-register').addClass('auth-tab--active');
        $('#tab-login').removeClass('auth-tab--active');
    }
}


$(document).ready(function () {
    tabsAuth();
    key_register();
    key_login();
    button_login();
    button_register();
});
 