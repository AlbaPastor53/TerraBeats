function ajaxPromise(sUrl, sType, sTData, sData = undefined) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: sUrl,
            type: sType,
            dataType: sTData,
            data: sData
        }).done((data) => {
            resolve(data);
        }).fail((jqXHR, textStatus, errorThrow) => {
            reject(errorThrow);
        }); 
    });
}


//================LOAD-HEADER================
function load_menu() {
    var token = localStorage.getItem('token_JWT');
    if (token) {
        ajaxPromise('module/auth/controller/controller_auth.php?op=data_user', 'POST', 'JSON', { 'token': token })
            .then(function(data) {
                $('#signin').hide();
                $('#user-menu').show();
                $('.log-icon').empty();
                $('<img>').attr({ src: data.avatar, alt: 'Avatar' }).appendTo('.log-icon');
                $('#user_info').html(
                    '<span class="user-name">' + data.username + '</span>' +
                    '<a id="logout"><span class="material-symbols-outlined">logout</span></a>'
                );
            }).catch(function() {
                console.log("Error al cargar los datos del user");
            });
    } else {
        $('#logout').hide();
        $('#user-menu').hide();
        $('#signin').show();
    }
}


//================CLICK-LOGOUT================
function click_logout() {
    $(document).on('click', '#logout', function() {
        Swal.fire({
                        icon: 'success',
                        title: 'Loged-out successfully',
                        showConfirmButton: false,
                        timer: 2000
                        });
                        setTimeout('logout(); ', 1000);
    });
}

function click_profile() {
    $(document).on('click', '.log-icon', function() {
        window.location.href = "index.php?page=controller_profile&op=view";
    });
}

//================LOG-OUT================
function logout() {
    ajaxPromise('module/auth/controller/controller_auth.php?op=logout', 'POST', 'JSON')
        .then(function(data) {
            localStorage.removeItem('token_JWT');
            window.location.href = "index.php?module=controller_home&op=view";
        }).catch(function() {
            console.log('Something has occured');
        });
}

$(document).ready(function() {
    load_menu();
    click_logout();
    click_profile();
});