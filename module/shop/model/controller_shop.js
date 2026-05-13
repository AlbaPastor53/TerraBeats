const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
 
let mapInstance = null;

var currentPage = 1;
var limitPerPage = 4;

function loadEvent() {
   
    var filter = JSON.parse(localStorage.getItem('filter')) || false;
    console.log('filter:', filter);
    // console.log('tipo:', typeof filter);
    // console.log('length:', filter.length);
    if (filter && filter.length > 0) {
        console.log('ENTRA EN FILTER');
        ajaxForSearch("module/shop/controller/controller_shop.php?op=filter", filter, limitPerPage, 0);
    } else {
        console.log('ENTRA EN ALL_EVENT');
        ajaxForSearch("module/shop/controller/controller_shop.php?op=all_event", [], limitPerPage, 0);
    }
}
 
function ajaxForSearch(url, filter, limit, offset) {
    filter = filter || [];
    limit  = (limit  !== undefined) ? limit  : limitPerPage;
    offset = (offset !== undefined) ? offset : 0;
    // console.log("Datos recibidos:");
 
    ajaxPromise(url, 'POST', 'JSON', { 
        'filter': JSON.stringify(filter), 
        'limit': limit, 
        'offset': offset })
        
        .then(function(data) {
            // console.log(data);
            // console.log(limit);
            $('#containerevent').empty();

                if (data === "error") {

                    $('#containerevent').append(`
                    <div>
                        <p>No hay eventos disponibles<p>
                    </div>
                     `);
                }else{
                
                    for (let row in data) {
                        const p = data[row];
            
                    $('<div></div>')
                        .attr({ 'id': p.id_terra, 'class': 'event-card' })
                        .appendTo('#containerevent')
                        .html(`
                            <div class="event-card__img-wrap">
                                <img src="${p.img}" alt="${p.name_event}" onerror="this.src='view/img/default.png'">
                                <span class="event-card__badge">${p.name_type || ''}</span>
                            </div>
                            <div class="event-card__body">
                                <h2 class="event-card__title">${p.name_event}</h2>
                                <p class="event-card__desc">${p.description || 'A unique experience in your city...'}</p>
                                <div class="event-card__meta">
                                    <div class="event-card__meta-item">
                                        <i class="fa-solid fa-location-dot"></i>
                                        ${p.name_city} - ${p.location}
                                    </div>
                                    <div class="event-card__meta-item">
                                        <i class="fa-solid fa-calendar"></i>
                                        ${p.event_date}
                                    </div>
                                    <div class="event-card__meta-item">
                                        <i class="fa-solid fa-clock"></i>
                                        ${p.event_time} h
                                    </div>
                                </div>
                                <div class="event-card__footer">
                                    <button class="btn-detalles more_info_list" id="${p.id_terra}">More information</button>
                                    <span class="event-card__price">${p.price}€</span>
                                </div>
                            </div>
                        `);
                }
            }
            mapLeaflet_all(data);
        }).catch(function() {
    });
}

function clicks() {
    $(document).on("click", ".more_info_list", function() {
        let id_terra = this.getAttribute('id');
        loadDetails(id_terra);
    });

    $(document).on("click", "#btn-back", function() {
        $('#details-shop').hide();
        $('#containerevent').show();
        $('.shop-header').show();
        // Limpiar el detalle al volver
        $('#container-date-img').empty();
        $('#container-date-event').empty();
    });
}

function loadDetails(id) {
    ajaxPromise('module/shop/controller/controller_shop.php?op=details_event&id=' + id, 'GET', 'JSON')
    .then(function(data) {
        // console.log(data[0]);
        if (!data || data === "error") return;

        const p    = data[0];
        const imgs = data[1];

        // --- Preparar variables ---
        const f      = p.event_date.split('-');
        const mes    = MESES[parseInt(f[1]) - 1];
        const dia    = f[2];
        const anio   = f[0];
        const hora   = p.event_time.substring(0, 5);
        const precio = parseFloat(p.price).toFixed(2);

        const ticketType    = p.ticket_type;
        const venueCapacity = parseInt(p.venue_capacity).toLocaleString();
        const sponsors      = p.sponsors;

        const statusLabel = p.status === 'sold out'  ? 'Agotado'    :
                            p.status === 'cancelled' ? 'Cancelado'  :
                            p.status === 'finished'  ? 'Finalizado' :
                            p.status === 'live'      ? 'En directo' : 'Programado';

        const btnLabel    = p.status === 'sold out'  ? 'Agotado'    :
                            p.status === 'cancelled' ? 'Cancelado'  :
                            p.status === 'finished'  ? 'Finalizado' : 'Comprar entradas';

        const btnDisabled  = ['sold out', 'cancelled', 'finished'].includes(p.status) ? 'disabled' : '';
        const ticketsText  = p.tickets_available > 0
                            ? `${p.tickets_available} entradas disponibles`
                            : 'Sin entradas';

        const sponsorsHTML = sponsors
            ? `<div class="event-card__meta-item">
                    <i class="fa-solid fa-handshake"></i>
                    <span>${sponsors}</span>
               </div>`
            : '';

        // --- Slides del carrusel ---
        let slidesHTML = '';
        if (imgs && imgs.length > 0) {
            imgs.forEach(function(imgObj) {
                slidesHTML += `
                    <div class="swiper-slide">
                        <img src="${imgObj.img}" alt="${p.name_event}" onerror="this.src='view/img/default.png'"/>
                    </div>`;
            });
        } else {
            slidesHTML = `
                <div class="swiper-slide">
                    <img src="${p.img}" alt="${p.name_event}" onerror="this.src='view/img/default.png'"/>
                </div>`;
        }

        const hasMultiple    = imgs && imgs.length > 1;
        const swiperControls = hasMultiple
            ? `<div class="swiper-pagination"></div>
               <div class="swiper-button-prev"></div>
               <div class="swiper-button-next"></div>`
            : '';

        // --- Inyectar carrusel ---
        // Usa .events-swiper para heredar altura (560px), bordes y paginación de tu CSS
        $('#container-date-img').html(`
            <div class="swiper events-swiper" id="swiper-detail-${id}">
                <div class="swiper-wrapper">
                    ${slidesHTML}
                </div>
                ${swiperControls}
            </div>
        `);

        // --- Inyectar info del evento ---
        $('#container-date-event').html(`
            <div class="event-card__body">

                <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
                    <span class="event-card__badge" style="position:static;">${p.name_type}</span>
                    <span class="event-card__badge" style="position:static;">${ticketType}</span>
                    <span class="event-card__badge" style="position:static;">${statusLabel}</span>
                </div>

                <h2 class="event-card__title">${p.name_event}</h2>
                <p class="event-card__desc">${p.description}</p>

                <div class="event-card__meta">
                    <div class="event-card__meta-item">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${p.name_city} — ${p.location}</span>
                    </div>
                    <div class="event-card__meta-item">
                        <i class="fa-solid fa-calendar"></i>
                        <span>${dia} ${mes} ${anio}</span>
                    </div>
                    <div class="event-card__meta-item">
                        <i class="fa-solid fa-clock"></i>
                        <span>${hora} h</span>
                    </div>
                    <div class="event-card__meta-item">
                        <i class="fa-solid fa-ticket"></i>
                        <span>${ticketsText}</span>
                    </div>
                    <div class="event-card__meta-item">
                        <i class="fa-solid fa-users"></i>
                        <span>Aforo: ${venueCapacity}</span>
                    </div>
                    ${sponsorsHTML}
                </div>

                <div class="event-card__footer">
                    <span class="event-card__price">${precio}€</span>
                    <button class="btn-detalles" id="btn-comprar-${id}" ${btnDisabled}>
                        ${btnLabel}
                    </button>
                </div>

            </div>
        `);

        // --- Ocultar listado, mostrar detalle ---
        $('#containerevent').hide();
        $('.shop-header').hide();

        // Inicializar Swiper cuando el DOM ya tiene dimensiones
        $('#details-shop').show(0, function() {
            if (window.swiperDetail) {
                window.swiperDetail.destroy(true, true);
                window.swiperDetail = null;
            }
            window.swiperDetail = new Swiper(`#swiper-detail-${id}`, {
                loop: hasMultiple,
                autoplay: hasMultiple ? {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                } : false,
                speed: 700,
                pagination: hasMultiple ? {
                    el: `#swiper-detail-${id} .swiper-pagination`,
                    clickable: true,
                } : false,
                navigation: hasMultiple ? {
                    nextEl: `#swiper-detail-${id} .swiper-button-next`,
                    prevEl: `#swiper-detail-${id} .swiper-button-prev`,
                } : false,
                keyboard: { enabled: true },
            });
            
        });
        mapLeaflet_one(p);
       

    }).catch(function(error) {
        console.error('Error REAL:', error);
        console.log('Error detalle:', error.message, error.stack);
    });
}

function updatePriceVisual() {
    var min = parseInt($('#price_min').val());
    var max = parseInt($('#price_max').val());
    $('#price_min_val').text(min + '€');
    $('#price_max_val').text(max + '€');
    $('#price_fill').css({ left: (min / 300) * 100 + '%', width: ((max - min) / 300) * 100 + '%' });
}

function print_filters() {
    $.ajax({
        url: 'module/shop/controller/controller_shop.php?op=get_filters',
        type: 'GET',
        dataType: 'json',
       
        success: function(data) {
            //  console.log(data);

            // Helper: limpia \r\n y capitaliza
            const label = str => str.replace(/\r?\n/g, '').trim()
                                    .replace(/_/g, ' ')
                                    .replace(/\b\w/g, c => c.toUpperCase());

            const artistOptions = data.artists.map(a =>
                `<option value="${a.name_art.trim()}">${label(a.name_art)}</option>`
            ).join('');

            const typeOptions = data.types.map(t =>
                `<option value="${t.name_type}">${label(t.name_type)}</option>`
            ).join('');

            const cityRadios = data.cities.map(c =>
                `<label><input type="radio" name="city" value="${c.name_city}"> ${label(c.name_city)}</label>`
            ).join('');

            const categoryCheckboxes = data.categories.map(cat =>
                `<label><input type="checkbox" value="${cat.name_cat}"> ${label(cat.name_cat)}</label>`
            ).join('');

            $('<div class="filters-grid"></div>').appendTo('.filters').html(`

                <div class="filter-group">
                    <span class="filter-label">Artists</span>
                    <select class="filter_artist">
                        <option value="">All artists</option>
                        ${artistOptions}
                    </select>
                </div>

                <div class="filter-group">
                    <span class="filter-label">Types of events</span>
                    <select class="filter_types">
                        <option value="">All types</option>
                        ${typeOptions}
                    </select>
                </div>

                <div class="filter-group">
                    <span class="filter-label">City</span>
                    <div class="filter_cities">
                        <label><input type="radio" name="city" value=""> All cities</label>
                        ${cityRadios}
                    </div>
                </div>

                <div class="filter-group">
                    <span class="filter-label">Categories</span>
                    <div class="filter_categories">
                        ${categoryCheckboxes}
                    </div>
                </div>

                <div class="filter-group">
                    <span class="filter-label">Price</span>
                    <div class="filter_price">
                        <div class="price-track-wrap">
                            <span class="price-val" id="price_min_val">0€</span>
                            <div class="price-track">
                                <div class="price-range-fill" id="price_fill"></div>
                                <input type="range" id="price_min" class="price_slider price_slider--min" min="0" max="300" value="0" step="2">
                                <input type="range" id="price_max" class="price_slider price_slider--max" min="0" max="300" value="300" step="2">
                            </div>
                            <span class="price-val" id="price_max_val">300€</span>
                        </div>
                    </div>
                </div>

            `);

            $('<div class="filter-actions"></div>').appendTo('.filters').html(`
                <button class="filter_button" id="Button_filter">Filter</button>
                <button class="filter_remove" id="Remove_filter">Remove</button>
            `);

            filter_button()
            // Reinicializa eventos del slider y botones DESPUÉS de pintar el DOM
            // init_price_slider();
            // init_filter_buttons();
        },

        error: function(xhr, status, error) {
    console.error('Status:', status);
    console.error('Error:', error);
    console.error('Respuesta del servidor:', xhr.responseText);

        }
    });
}

function filter_button() {
    //Filtro artists select
        $('.filter_artist').change(function () {
            if (this.value === '') {
                localStorage.removeItem('filter_artist');
            } else {
                localStorage.setItem('filter_artist', this.value);
            }
        });
        if (localStorage.getItem('filter_artist')) {
            $('.filter_artist').val(localStorage.getItem('filter_artist'));
        }

    //Filtro categories checkbox
        $('.filter_categories input[type="checkbox"]').change(function () {
            // Recoger todos los checked en ese momento
            var checked = [];
            $('.filter_categories input[type="checkbox"]:checked').each(function () {
                checked.push($(this).val());
            });
            localStorage.setItem('filter_categories', JSON.stringify(checked));
        });
        if (localStorage.getItem('filter_categories')) {
            var savedCats = JSON.parse(localStorage.getItem('filter_categories'));
            savedCats.forEach(function(val) {
                $('.filter_categories input[value="' + val + '"]').prop('checked', true);
            });
        }

    //Filtro cities radio
       $('.filter_cities input[type="radio"]').change(function () {
            if (this.value === '') {
                localStorage.removeItem('filter_cities');
            } else {
                localStorage.setItem('filter_cities', this.value);
            }
        });

        if (localStorage.getItem('filter_cities')) {
            $('.filter_cities input[value="' + localStorage.getItem('filter_cities') + '"]').prop('checked', true);
        }

    //Filtro types select
        $('.filter_types').change(function () {
            if (this.value === '') {
                localStorage.removeItem('filter_types');
            } else {
                localStorage.setItem('filter_types', this.value);
            }
        });
        if (localStorage.getItem('filter_types')) {
            $('.filter_types').val(localStorage.getItem('filter_types'));
        }

    // Filtro Precio slider
        $(document).on('input', '#price_min', function() {
            if (parseInt($(this).val()) > parseInt($('#price_max').val())) {
                $(this).val($('#price_max').val());
            }
            updatePriceVisual();
            localStorage.setItem('filter_price', JSON.stringify({ 
                min: parseInt($('#price_min').val()), 
                max: parseInt($('#price_max').val()) 
            }));
        });

        $(document).on('input', '#price_max', function() {
            if (parseInt($(this).val()) < parseInt($('#price_min').val())) {
                $(this).val($('#price_min').val());
            }
            updatePriceVisual();
            localStorage.setItem('filter_price', JSON.stringify({ 
                min: parseInt($('#price_min').val()), 
                max: parseInt($('#price_max').val()) 
            }));
        });

    var savedFilter = JSON.parse(localStorage.getItem('filter')) || [];
    var priceMin = savedFilter.find(function(f) { return f[0] === 'price_min'; });
    var priceMax = savedFilter.find(function(f) { return f[0] === 'price_max'; });
    if (priceMin && priceMax) {
        $('#price_min').val(priceMin[1]);
        $('#price_max').val(priceMax[1]);
    }
    updatePriceVisual();

    $(document).on('click', '.filter_button', function () {
        var filter = [];

        if (localStorage.getItem('filter_artist')) {
            filter.push(['name_art', localStorage.getItem('filter_artist')])
        }
        if (localStorage.getItem('filter_categories')) {
            var cats = JSON.parse(localStorage.getItem('filter_categories'));
            
            cats.forEach(function(cat) {
                filter.push(['name_cat', cat]);
            });
        }
        if (localStorage.getItem('filter_cities')) {
            filter.push(['name_city', localStorage.getItem('filter_cities')])
        }
        if (localStorage.getItem('filter_types')) {
            filter.push(['name_type', localStorage.getItem('filter_types')])
        }
        if (localStorage.getItem('filter_price')) {
            var price = JSON.parse(localStorage.getItem('filter_price'));
            filter.push(['price_min', price.min]);
            filter.push(['price_max', price.max]);
        }

        
        localStorage.setItem('filter', JSON.stringify(filter));
        window.location.reload();


    });
$(document).on('click', '.filter_remove', function () {
            localStorage.removeItem('filter');
            localStorage.removeItem('filter_artist');
            localStorage.removeItem('filter_categories');
            localStorage.removeItem('filter_cities');
            localStorage.removeItem('filter_types');
            localStorage.removeItem('filter_price');

            window.location.reload();
           
        });
}

function mapLeaflet_all(data) {
    // Inicializar el mapa

    if (mapInstance) {           
        mapInstance.remove();   
        mapInstance = null;     
    }

    const map = L.map('map').setView([40.4165, -3.7026], 6); // Centro en España

    // Añadir capa de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Iterar sobre los datos
    for (let row in data) {
        // Saltar si no tiene coordenadas
        if (!data[row].lat || !data[row].lng) continue;

        const popupContent =
            `<h3 style="text-align:center;">${data[row].name_event}</h3>
            <p style="text-align:center;">📍 <b>${data[row].location}</b></p>
            <p style="text-align:center;">📅 <b>${data[row].event_date}</b></p>
            <p style="text-align:center;">🎟️ Price: <b>${data[row].price}€</b></p>
            <p style="text-align:center;">Status: <b>${data[row].status}</b></p>
            <img src="${data[row].img}" style="width:100%; border-radius:6px; margin:6px 0;"/>
            <a class="button button-primary-outline button-ujarak button-size-1 wow fadeInLeftSmall link more_info_list"
               data-wow-delay=".4s"
               id="${data[row].id_terra}">Ver más</a>`;

        L.marker([data[row].lat, data[row].lng])
            .bindPopup(popupContent)
            .addTo(map);
    }
     mapInstance = map;  
}

function mapLeaflet_one(data) {

   
    if (mapInstance) {           
        mapInstance.remove();    
        mapInstance = null;      
    }

    const lat = parseFloat(data.lat);  
    const lng = parseFloat(data.lng);  
    // console.log(data.lat);

    if (!data || !lat || !lng) {
        console.error('Evento sin coordenadas');
        return;
    }

    const map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    const popupContent = `
        <h4 style="text-align:center;">${data.name_event}</h4>
        <p style="text-align:center;">📍 <b>${data.location}</b></p>
        <p style="text-align:center;">📅 <b>${data.event_date}</b></p>
        <p style="text-align:center;">🎟️ Price: <b>${data.price}€</b></p>
        <img src="${data.img}" style="width:100%; border-radius:6px; margin:6px 0;"/>
    `;

    L.marker([lat, lng])
        .bindPopup(popupContent)
        .openPopup()
        .addTo(map);

    mapInstance = map; 
}

function pagination() {
    var filter = JSON.parse(localStorage.getItem('filter')) || false;
    
 
    // PASO 1: obtener el total de eventos (con o sin filtro)
    var countUrl, countData;
    if (filter && filter.length > 0) {
        countUrl  = "module/shop/controller/controller_shop.php?op=count_filters";
        countData = { 'filter': JSON.stringify(filter) };
    } else {
        countUrl  = "module/shop/controller/controller_shop.php?op=count";
        countData = {};
    }
 
    ajaxPromise(countUrl, 'POST', 'JSON', countData)
        .then(function(data) {
 
            // El DAO devuelve [{num_events: X}] o [{num_filters: X}]
            var num_events = data[0].num_events || data[0].num_filters || 0;
            console.log('num_events:', num_events);
 
            // PASO 2: calcular páginas
            var num_pages = Math.ceil(num_events / limitPerPage);
            console.log('num_pages:', num_pages);
 
            // PASO 3: pintar botones de paginación
            var html = '';
            for (var i = 1; i <= num_pages; i++) {
                var activeClass = (i === currentPage) ? 'is-active' : '';
                html += `<button class="shop-page-btn ${activeClass}" data-page="${i}">${i}</button>`;
            }
            $('#shop-pagination').html(html);
 
            // PASO 4: click en página → cambiar página y cargar eventos
            $(document).off('click', '.shop-page-btn').on('click', '.shop-page-btn', function() {
                var page = parseInt($(this).data('page'), 10);
                if (isNaN(page) || page < 1) return;
 
                currentPage = page;
                console.log('page:', page);
 
                var offset = limitPerPage * (page - 1);
                console.log('offset:', offset);
 
                // Actualizar clase activa
                $('.shop-page-btn').removeClass('is-active');
                $(this).addClass('is-active');
 
                // PASO 5: cargar eventos de la página con limit y offset
                var filter = JSON.parse(localStorage.getItem('filter')) || false;
                if (filter && filter.length > 0) {
                    ajaxForSearch("module/shop/controller/controller_shop.php?op=filter",
                        filter, limitPerPage, offset);
                } else {
                    ajaxForSearch("module/shop/controller/controller_shop.php?op=all_event",
                        [], limitPerPage, offset);
                }
            });
 
        }).catch(function(err) {
            console.error('Error pagination:', err);
        });
}

function event_related(loadeds = 0, artist_r, total_items) {
    let items = 3;
    let loaded = loadeds;
    let type = artist_r;
    let total_item = total_items;

    ajaxPromise("module/shop/controller/controller_shop.php?op=event_related", 'POST', 'JSON', { 'type': type, 'loaded': loaded, 'items': items })
        .then(function(data) {
            if (loaded == 0) {
                $('<div></div>').attr({ 'id': 'title_content', class: 'title_content' }).appendTo('.results')
                    .html(
                        '<h2 class="cat">Events related</h2>'
                    )
                for (row in data) {
                    if (data[row].id_car != undefined) {
                        $('<div></div>').attr({ 'id': data[row].id_terra, 'class': 'more_info_list' }).appendTo('.title_content')
                            .html(
                                "<li class='portfolio-item'>" +
                                "<div class='item-main'>" +
                                "<div class='portfolio-image'>" +
                                "<img src = " + data[row].img_art + " alt='imagen car' </img> " +
                                "</div>" +
                                "<h5>" + data[row].id_art + "  " + data[row].name_art + "</h5>" +
                                "</div>" +
                                "</li>"
                            )
                    }
                }
                $('<div></div>').attr({ 'id': 'more_car__button', 'class': 'more_car__button' }).appendTo('.title_content')
                    .html(
                        '<button class="load_more_button" id="load_more_button">LOAD MORE</button>'
                    )
            }
            if (loaded >= 3) {
                for (row in data) {
                    if (data[row].id_terra != undefined) {
                        console.log(data);
                        $('<div></div>').attr({ 'id': data[row].id_terra, 'class': 'more_info_list' }).appendTo('.title_content')
                            .html(
                                "<li class='portfolio-item'>" +
                                "<div class='item-main'>" +
                                "<div class='portfolio-image'>" +
                                "<img src = " + data[row].img_art + " alt='imagen car' </img> " +
                                "</div>" +
                                "<h5>" + data[row].id_art + "  " + data[row].name_art + "</h5>" +
                                "</div>" +
                                "</li>"

                            )
                    }
                }
                var total_event = total_item - 3;
                if (total_event <= loaded) {
                    $('.more_car__button').empty();
                    $('<div></div>').attr({ 'id': 'more_car__button', 'class': 'more_car__button' }).appendTo('.title_content')
                        .html(
                            "</br><button class='btn-notexist' id='btn-notexist'></button>"
                        )
                } else {
                    $('.more_car__button').empty();
                    $('<div></div>').attr({ 'id': 'more_car__button', 'class': 'more_car__button' }).appendTo('.title_content')
                        .html(
                            '<button class="load_more_button" id="load_more_button">LOAD MORE</button>'
                        )
                }
            }
        }).catch(function() {
            console.log("error cars_related");
        });
}

function more_cars_related(artist_r) {
    var artist_r = artist_r;
    var items = 0;
    ajaxPromise('module/shop/ctrl/ctrl_shop.php?op=count_cars_related', 'POST', 'JSON', { 'artist_r': artist_r })
        .then(function(data) {
            var total_items = data[0].n_prod;
            cars_related(0, artist_r, total_items);
            $(document).on("click", '.load_more_button', function() {
                items = items + 3;
                $('.more_car__button').empty();
                cars_related(items, artist_r, total_items);
            });
        }).catch(function() {
            console.log('error total_items');
        });
}

$(document).ready(function() {
    //  console.log("hola 3333333")
    loadEvent();
    clicks();
    print_filters();
    pagination();
});
