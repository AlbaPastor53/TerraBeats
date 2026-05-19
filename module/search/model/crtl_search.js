function load_cities() {
    ajaxPromise('module/search/crtl/crtl_search.php?op=search_city', 'POST', 'JSON')
        .then(function (data) {
            $('.search_city').empty(); //  limpiar antes de añadir
            $('<option>City</option>').attr('selected', true).attr('disabled', true).appendTo('.search_city');
            for (row in data) {
                $('<option value="' + data[row].id_city + '">' + data[row].name_city + '</option>').appendTo('.search_city');
                
            }
        }).catch(function () {
            window.location.href = "index.php?module=exception&op=503&error=fail_load_cities&type=503";
        });
}
 
function load_category(city) {
    $('.search_category').empty();
 
    if (city == undefined) {
        ajaxPromise('module/search/crtl/crtl_search.php?op=search_category_null', 'POST', 'JSON')
            .then(function (data) {
                $('<option>Category</option>').attr('selected', true).attr('disabled', true).appendTo('.search_category');
                for (row in data) {
                    $('<option value="' + data[row].id_cat + '">' + data[row].name_cat + '</option>').appendTo('.search_category');
                }
            }).catch(function () {
                window.location.href = "index.php?module=exception&op=503&error=fail_load_category&type=503";
            });
    } else {
        ajaxPromise('module/search/crtl/crtl_search.php?op=search_category', 'POST', 'JSON', { city: city })
            .then(function (data) {
                for (row in data) {
                    $('<option value="' + data[row].id_cat + '">' + data[row].name_cat + '</option>').appendTo('.search_category');
                }
            }).catch(function () {
                window.location.href = "index.php?module=exception&op=503&error=fail_load_category_2&type=503";
            });
    }
}
 
function launch_search() {
    load_cities();
    load_category();
    $(document).on('change', '.search_city', function () {
        let cityVal = $(this).val();  // ID numérico
        let cityText = $(this).find('option:selected').text();
        
        if (!cityVal || cityText === "City") {
            load_category();
        } else {
            load_category(cityVal);  //  pasar ID, no texto
        }
    });
}
 
function autocomplete() {
    $("#autocom").on("keyup", function () {
        let sdata = { complete: $(this).val() };

        let cityVal      = $('.search_city').val();           // ID
        let cityText     = $('.search_city option:selected').text();
        let categoryVal  = $('.search_category').val();       // ID
        let categoryText = $('.search_category option:selected').text();

        if (cityVal && cityText !== "City") {
            sdata.city = cityVal;        // 👈 ID numérico
        }

        if (categoryVal && categoryText !== "Category") {
            sdata.category = categoryVal;  // 👈 ID numérico
        }

        ajaxPromise('module/search/crtl/crtl_search.php?op=autocomplete', 'POST', 'JSON', sdata)
            .then(function (data) {
                $('#search_auto').empty();
                $('#search_auto').fadeIn(300);
                for (row in data) {
                    $('<div></div>').appendTo('#search_auto')
                        .html(data[row].name_art)
                        .attr({ 'class': 'searchElement', 'id': data[row].id_art, 'data-name': data[row].name_art });
                }
                $(document).on('click', '.searchElement', function () {
                    $('#autocom').val($(this).data('name'));
                    $('#search_auto').fadeOut(1000);
                });
                $(document).on('click scroll', function (event) {
                    if (event.target.id !== 'autocom') {
                        $('#search_auto').fadeOut(1000);
                    }
                });
            }).catch(function () {
                $('#search_auto').fadeOut(500);
            });
    });
}
 
function button_search() {
    $('#search-btn').on('click', function () {
        var search = [];

        let cityVal      = $('.search_city').val();
        let cityText     = $('.search_city option:selected').text().trim();
        let categoryVal  = $('.search_category').val();
        let categoryText = $('.search_category option:selected').text().trim();
        let artistVal    = $('#autocom').val().trim();

        // Para el localStorage guardamos el TEXTO (para mostrar en el shop)
        if (cityVal && cityText !== "City") {
            search.push(['name_city', cityText]);
        }

        if (categoryVal && categoryText !== "Category") {
            search.push(['name_cat', categoryText]);
        }

        if (artistVal !== "") {
            search.push(['name_art', artistVal]);
        }

        localStorage.removeItem('filter');
        if (search.length !== 0) {
            localStorage.setItem('filter', JSON.stringify(search));
        }
        
        window.location.href = 'index.php?page=controller_shop&op=view';
    });
}
 
$(document).ready(function () {
    launch_search();
    autocomplete();
    button_search();
});
 