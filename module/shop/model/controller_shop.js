if (typeof MESES === 'undefined') {
    var MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
}
let mapInstance = null;

var currentPage = 1;
var limitPerPage = 4;

function loadEvent() {
   
    var filter = JSON.parse(localStorage.getItem('filter')) || false;
    var orderby = localStorage.getItem('filter_orderby') || 'id_terra';
    var offset  = limitPerPage * (limitPerPage - 1);
    // console.log('filter:', filter);
    // console.log('tipo:', typeof filter);
    // console.log('length:', filter.length);
    if (filter && filter.length > 0) {
        // console.log('ENTRA EN FILTER');
        ajaxForSearch("module/shop/controller/controller_shop.php?op=filter", filter, limitPerPage, 0, orderby);
        highlightFilters();
    } else {
        // console.log('ENTRA EN ALL_EVENT');
        ajaxForSearch("module/shop/controller/controller_shop.php?op=all_event", [], limitPerPage, 0, orderby);
    }
}
 
function ajaxForSearch(url, filter, limit, offset, orderby) {
    filter = filter || [];
    limit  = (limit  !== undefined) ? limit  : limitPerPage;
    offset = (offset !== undefined) ? offset : 0;
    orderby =(orderby !== undefined) ? orderby : "id_terra";
    // console.log("Datos recibidos:");
 
    ajaxPromise(url, 'POST', 'JSON', { 
        'filter': JSON.stringify(filter), 
        'limit': limit, 
        'offset': offset, 
        'orderby': orderby})
        
        .then(function(data) {
            console.log(data);
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
            console.log("Ha fallado el ajax");
    });
}

function clicks() {
    $(document).on("click", ".more_info_list", function() {
        let id_terra = this.getAttribute('id');
        loadDetails(id_terra);
        updateMostVisited(id_terra);
    });

    $(document).on('click', '#order-btn', function() {
    const orderby = $('#orderby').val().trim() || 'e.id_terra';
    console.log(orderby);
    loadEvent();
    
    });

    $(document).on("click", "#btn-back", function() {
        $('#details-shop').hide();
        $('#containerevent').show();
        $('.shop-header').show();
        $('#shop-pagination').show();
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
        $('#shop-pagination').hide();
        
        mapLeaflet_one(p);
        console.log(p.id_terra, p.id_city, p.id_type);
        more_event_related(p.id_terra, p.id_city, p.id_type);

    }).catch(function(error) {
        // console.log(data);
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

function highlightFilters() {
    var all_filters = JSON.parse(localStorage.getItem('filter')) || false;
    console.log("all_filters: " + all_filters);

if (!all_filters || all_filters.length === 0) return;

   all_filters.forEach(function(f) {
        var key = f[0];
        var val = f[1];

        switch (key) {

            // Ciudad → radio button
            case 'name_city':
                $('.filter_cities input[type="radio"][value="' + val + '"]').prop('checked', true);
                localStorage.setItem('filter_cities', val);
                break;

            // Categoría → checkbox
            case 'name_cat':
                $('.filter_categories input[type="checkbox"][value="' + val + '"]').prop('checked', true);
                // Acumula en filter_categories (puede haber varias)
                var saved = JSON.parse(localStorage.getItem('filter_categories') || '[]');
                if (!saved.includes(val)) { saved.push(val); }
                localStorage.setItem('filter_categories', JSON.stringify(saved));
                break;

            // Artista → select
            case 'name_art':
                $('.filter_artist').val(val);
                localStorage.setItem('filter_artist', val);
                break;

            // Tipo → select
            case 'name_type':
                $('.filter_types').val(val);
                localStorage.setItem('filter_types', val);
                break;

            // Precio
            case 'price_min':
                $('#price_min').val(val);
                break;
            case 'price_max':
                $('#price_max').val(val);
                break;
        }
    });

    updatePriceVisual();
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
                `<option value="${t.name_type.trim()}">${label(t.name_type)}</option>`
            ).join('');

            const cityRadios = data.cities.map(c =>
                `<label><input type="radio" name="city" value="${c.name_city}"> ${label(c.name_city)}</label>`
            ).join('');

            const categoryCheckboxes = data.categories.map(cat =>
                `<label><input type="checkbox" value="${cat.name_cat}"> ${label(cat.name_cat)}</label>`
            ).join('');

            $('<div class="filters-grid"></div>').appendTo('.filters').html(`


                <div class="filter-group">
                    <span class="filter-label">Order by</span>
                    <div class="filter_orderby">
                        <div class="orderby_content">
                            <p>ORDER BY:</p>
                            <select id="orderby">
                            <option value = "id_terra">Order by...</option>
                            <option value = "price ASC">Price asc</option>
                            <option value = "price DESC">Price desc</option>
                            <option value = "event_date ASC">Most recent</option>
                            <option value = "event_date DESC">Least recent</option>
                            <option value = "visits ASC">Most visited</option>
                            </select>
                            <input type="button" value="ORDER" id="order-btn" class="order-btn"/>
                        </div>
                    </div>
                </div>

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
            highlightFilters();
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


    //Filtro orderby select

        $('#orderby').change(function () {
            if (this.value === '') {
                localStorage.removeItem('filter_orderby');
            } else {
                localStorage.setItem('filter_orderby', this.value);
            }
        });
        if (localStorage.getItem('filter_orderby')) {
            $('#orderby').val(localStorage.getItem('filter_orderby'));
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
            localStorage.removeItem('filter_orderby');
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
                        filter, limitPerPage, offset, orderby);
                } else {
                    ajaxForSearch("module/shop/controller/controller_shop.php?op=all_event",
                        [], limitPerPage, offset);
                }
            });
 
        }).catch(function(err) {
            console.error('Error pagination:', err);
        });
}

function event_related(loaded, idEvent, city, type, total_items) {
    var items = 4;

    ajaxPromise("module/shop/controller/controller_shop.php?op=event_related", 'POST', 'JSON', {
        'idEvent': idEvent,
        'city':    city,
        'type':    type,
        'loaded':  loaded,
        'items':   items
    })
    .then(function(data) {


        function buildCard(e) {
            var imgSrc = (e.imgs_event && e.imgs_event.length > 0)
                ? e.imgs_event[0]
                : 'view/img/home/events/default.jpg';

            var $card = $('<div></div>').addClass('user_card').attr('id', 'related-' + e.id_terra)
                .html(`
                    <div class="cat-card__img-wrap">
                        <span class="cat-card__badge">${e.name_type}</span>
                        <img class="cat-card__img" src="${imgSrc}" alt="${e.name_event}"
                            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
                        <div class="cat-card__fallback">${e.name_event.charAt(0).toUpperCase()}</div>
                    </div>
                    <div class="cat-card__body">
                        <h3 class="cat-card__name">${e.name_event}</h3>
                        <div class="cat-card__meta" style="display:flex; flex-direction:column; gap:4px; margin: 8px 0; font-size:0.8rem; color:#aaa;">
                            <span>${e.name_type} · ${e.name_city} · ${e.location}</span>
                            <span>${e.artists ? e.artists.map(a => a.name_art).join(', ') : (e.name_art || '')}</span>
                            <span style="color: ${e.status === 'scheduled' ? '#2ecc71' : e.status === 'sold out' ? '#e74c3c' : '#f39c12'}">
                                ${e.status}
                            </span>
                        </div>
                        <div class="cat-card__footer">
                            <button class="btn-ticket more_info_list" id="${e.id_terra}">See more ...</button>
                        </div>
                    </div>
                `);

            return $card;
        }

       if (loaded == 0) {
            $('<div></div>').attr('id', 'title_content_events')
                .appendTo('#container-date-event')
                .html(`
                    <h2 class="section-title" style="margin: 32px 0 16px;">Related to City or Type: </h2>
                    <div class="cards-wrapper">
                        <div class="cards-track-outer">
                            <button class="cards-nav-btn cards-nav-prev" id="relatedPrev">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <div class="swiper" id="related-swiper">
                                <div class="swiper-wrapper" id="related-grid"></div>
                            </div>
                            <button class="cards-nav-btn cards-nav-next" id="relatedNext">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                `);

            for (var row in data) {
                if (data[row].id_terra != undefined) {
                    $('<div class="swiper-slide"></div>')
                        .append(buildCard(data[row]))
                        .appendTo('#related-grid');
                }
            }

            var relatedSwiper = new Swiper('#related-swiper', {
                slidesPerView: 3,
                spaceBetween: 18,
                speed: 450,
            });

            document.getElementById('relatedPrev').addEventListener('click', () => relatedSwiper.slidePrev());
            document.getElementById('relatedNext').addEventListener('click', () => relatedSwiper.slideNext());
        }

    }).catch(function() {
        console.log("error event_related");
    });
}

function more_event_related(idEvent, city, type) {
    var items = 0;

    ajaxPromise('module/shop/controller/controller_shop.php?op=count_event_related', 'POST', 'JSON', {
        'idEvent': idEvent,
        'city':    city,
        'type':    type
    })
    .then(function(data) {
        var total_items = data[0].n_prod;
        event_related(0, idEvent, city, type, total_items);

        $(document).on("click", '.load_more_button', function() {
            items = items + 4;
            $('#more_event__button').empty();
            event_related(items, idEvent, city, type, total_items);
        });

    }).catch(function() {
        console.log('error total_items');
    });
}

function updateMostVisited(id) {
    ajaxPromise(
        'module/shop/controller/controller_shop.php?op=update_most_visited&id=' + id,
        'GET', 'JSON'
    ).then(function(data) {
        console.log('visita registrada:', data);
    }).catch(function() {
        console.log('error update_most_visited');
    });
}

$(document).ready(function() {
    //  console.log("hola 3333333")
    if ($('#containerevent').length === 0) return;

    loadEvent();
    clicks();
    print_filters();
    pagination();


    var detailId = localStorage.getItem('open_detail');
    if (detailId) {
        localStorage.removeItem('open_detail');  // limpia para la próxima vez
        setTimeout(function() {                  // espera a que loadEvent() termine
            loadDetails(detailId);
            updateMostVisited(detailId);
        }, 200);
    }

});
