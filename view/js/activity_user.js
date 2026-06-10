function protecturl() {
    var token = localStorage.getItem('token_JWT');
    ajaxPromise('module/auth/controller/controller_auth.php?op=controluser', 'POST', 'JSON', { 'token': token })
        .then(function(data) {
            if (data == "Correct_User") {
                console.log("CORRECTO-->El usario coincide con la session");
            } else if (data == "Wrong_User") {
                console.log("INCORRCTO--> Estan intentando acceder a una cuenta");
                logout_auto();
            }
        })
        .catch(function() { console.log("ANONYMOUS_user") });
}

function control_activity() {
    var token = localStorage.getItem('token_JWT');
    if (token) {
        ajaxPromise('module/auth/controller/controller_auth.php?op=actividad', 'POST', 'JSON')
            .then(function(response) {
                if (response == "inactivo") {
                    console.log("usuario INACTIVO");
                    logout_auto();
                } else {
                    console.log("usuario ACTIVO")
                }
            });
    } else {
        console.log("No hay usario logeado");
    }
}

function logout_auto() {
        ajaxPromise('module/auth/controller/controller_auth.php?op=logout', 'POST', 'JSON')
        .then(function(data) {
            localStorage.removeItem('token_JWT');
            window.location.href = "index.php?module=controller_home&op=view";
        }).catch(function() {
            console.log('Something has occured');
        });
            Swal.fire({
                        icon: 'success',
                        title: 'Se ha cerrado la cuenta debido a la inactividad.',
                        showConfirmButton: true,
                        timer: 2000
                        });
    setTimeout('window.location.href = "index.php?module=controller_auth&op=view";', 2000);
}

function refresh_token() {
    var token = localStorage.getItem('token_JWT');
    if (token) {
        ajaxPromise('module/auth/controller/controller_auth.php?op=refresh_token', 'POST', 'JSON', { 'token': token })
            .then(function(data_token) {
                console.log("Refresh token correctly");
                localStorage.setItem("token_JWT", data_token);
                load_menu();
            });
    }
}

function refresh_cookie() {
    ajaxPromise('module/auth/controller/controller_auth.php?op=refresh_cookie', 'POST', 'JSON')
        .then(function(response) {
            console.log("Refresh cookie correctly");
        });
}

$(document).ready(function() {
    setInterval(function() { control_activity() }, 600000); //10min= 600000
    protecturl();
    setInterval(function() { refresh_token() }, 600000);
    setInterval(function() { refresh_cookie() }, 600000);
});