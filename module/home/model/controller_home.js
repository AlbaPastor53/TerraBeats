const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
 
function loadEvents() {

    ajaxPromise('module/home/controller/controller_home.php?op=homePageEvent', 'GET', 'JSON')
    .then(function(data) {
        // console.log(data);

        const wrapper = $('#eventsWrapper');

        for (let row = 0; row < data.length; row++) {
            wrapper.append(`
                <div class="swiper-slide">
                    <img class="slide__img" src="${data[row].img}" alt="${data[row].name_event}" onerror="this.style.display='none'"/>
                    <div class="slide__overlay"></div>
                    <div class="slide__content">
                        <span class="slide__tag">&#128197; ${data[row].event_date}</span>
                        <h2 class="slide__title">${data[row].name_event}</h2>
                        <p class="slide__location">
                            <span class="slide__dot"></span>
                        ${data[row].name_city}
                        </p>
                        <div class="slide__btns">
                            <button class="btn-primary">Comprar entradas</button>
                            <button class="btn-ghost">Ver más</button>
                        </div>
                    </div>
                    <div class="slide__price">
                        <p class="slide__price-label">Desde</p>
                        <p class="slide__price-value">€${data[row].price}</p>
                    </div>
                </div>
            `);
        }

        new Swiper('#eventsSwiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            speed: 700,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            keyboard: { enabled: true },
        });

    }).catch(function() {
        
    });
}
/* ─── SECTION CAROUSEL: Categorías ─────────────────────── */
function loadCategory() {

    ajaxPromise('module/home/controller/controller_home.php?op=homePageCategory','GET', 'JSON')
    .then(function(data) {
        //console.log(data);

        for (let row = 0; row < data.length; row++) {
            $('<div></div>')
                .addClass("swiper-slide")
                .attr('id', data[row].id_cat)
                .appendTo('#containerCategory')
                .html(`
                    <div class="user_card cat_bot" id="${data[row].name_cat}">
                        <div class="cat-card__img-wrap">
                            <span class="cat-card__badge">🎸</span>
                            <img
                                class="cat-card__img"
                                src="${data[row].img_cat}"
                                alt="${data[row].name_cat}"
                                onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                            />
                            <div class="cat-card__fallback">
                                ${data[row].name_cat.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div class="cat-card__body">
                            <h3 class="cat-card__name">${data[row].name_cat}</h3>
                            <div class="cat-card__footer">
                                <button class="btn-ticket" id="id">See more ...</button>
                            </div>
                        </div>
                    </div>
                `);
        }

        const swiperCategory = new Swiper('#categorySwiper', {
           slidesPerView: 3,
            slidesPerGroup: 1,
            spaceBetween: 18,
            loop: false,
            speed: 450,
            pagination: false,
        });

        document.getElementById('categoryPrev').addEventListener('click', () => swiperCategory.slidePrev());
        document.getElementById('categoryNext').addEventListener('click', () => swiperCategory.slideNext());

    }).catch(function() {
       
    });
}

function loadArtist() {

    ajaxPromise('module/home/controller/controller_home.php?op=homePageArtist','GET', 'JSON')
    .then(function(data) {
        // console.log(data);

        for (let row = 0; row < data.length; row++) {
            $('<div></div>')
                .addClass("swiper-slide")
                .attr('id', data[row].id_art)
                .appendTo('#containerArtist')
                .html(`
                    <div class="user_card art_bot" id="${data[row].name_art}">
                        <div class="cat-card__img-wrap">
                            <span class="cat-card__badge">🎤</span>
                            <img
                                class="cat-card__img"
                                src="${data[row].img_art}"
                                alt="${data[row].name_art}"
                                onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                            />
                            <div class="cat-card__fallback">
                                ${data[row].name_art.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div class="cat-card__body">
                            <h3 class="cat-card__name">${data[row].name_art}</h3>
                            <div class="cat-card__footer">
                                <button class="btn-ticket ">See more...</button>
                            </div>
                        </div>
                    </div>
                `);
        }

        const swiperArtist = new Swiper('#artistSwiper', {
            slidesPerView: 3,
            slidesPerGroup: 1,
            spaceBetween: 18,
            loop: false,
            speed: 450,
            pagination: false,
        });

        document.getElementById('artistPrev').addEventListener('click', () => swiperArtist.slidePrev());
        document.getElementById('artistNext').addEventListener('click', () => swiperArtist.slideNext());

    }).catch(function() {
        
    });
}

function loadCity() {

    ajaxPromise('module/home/controller/controller_home.php?op=homePageCity','GET', 'JSON')
    .then(function(data) {
        // console.log(data);

        for (let row = 0; row < data.length; row++) {
            $('<div></div>')
                .addClass("swiper-slide")
                .attr('id', data[row].id_city)
                .appendTo('#containerCity')
                .html(`
                    <div class="user_card cit_bot" id="${data[row].name_city}">
                        <div class="cat-card__img-wrap">
                            <span class="cat-card__badge">🏛️</span>
                            <img
                                class="cat-card__img"
                                src="${data[row].img_city}"
                                alt="${data[row].name_city}"
                                onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                            />
                            <div class="cat-card__fallback">
                                ${data[row].name_city.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div class="cat-card__body">
                            <h3 class="cat-card__name">${data[row].name_city}</h3>
                        
                            <div class="cat-card__footer">
                                <button class="btn-ticket">See more...</button>
                            </div>
                        </div>
                    </div>
                `);
        }

        const swiperCity = new Swiper('#citySwiper', {
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 18,
    loop: false,
    speed: 450,
    pagination: false,
});

document.getElementById('cityPrev').addEventListener('click', () => swiperCity.slidePrev());
document.getElementById('cityNext').addEventListener('click', () => swiperCity.slideNext());
    }).catch(function() {
        
    });
}

function loadType() {

    ajaxPromise('module/home/controller/controller_home.php?op=homePageType','GET', 'JSON')
    .then(function(data) {
        // console.log(data);

        for (let row = 0; row < data.length; row++) {
            $('<div></div>')
                .addClass("swiper-slide")
                .attr('id', data[row].id_type)
                .appendTo('#containerType')
                .html(`
                    <div class="user_card typ_bot" id="${data[row].name_type}">
                        <div class="cat-card__img-wrap">
                            <span class="cat-card__badge">🗻</span>
                            <img
                                class="cat-card__img"
                                src="${data[row].img_type}"
                                alt="${data[row].name_type}"
                                onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                            />
                            <div class="cat-card__fallback">
                                ${data[row].name_type.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div class="cat-card__body">
                            <h3 class="cat-card__name">${data[row].name_type}</h3>
                        
                            <div class="cat-card__footer">
                                <button class="btn-ticket">See more...</button>
                            </div>
                        </div>
                    </div>
                `);
        }

        const swiperType = new Swiper('#typeSwiper', {
            slidesPerView: 3,
            slidesPerGroup: 1,
            spaceBetween: 18,
            loop: false,
            speed: 450,
            pagination: false,
        });

        document.getElementById('typePrev').addEventListener('click', () => swiperType.slidePrev());
        document.getElementById('typeNext').addEventListener('click', () => swiperType.slideNext());


    }).catch(function() {
        
    });
}

function loadMostVisited() {
    ajaxPromise('module/home/controller/controller_home.php?op=homePageMostVisited', 'GET', 'JSON')
    .then(function(data) {
         console.log(data);
        $('#containerMostVisited').empty();

        for (let row = 0; row < data.length; row++) {
            const p = data[row];
            const f = p.event_date.split('-');
            const mes = MESES[parseInt(f[1]) - 1];

            $('<div></div>')
                .addClass("swiper-slide")
                .attr('id', p.id_terra)
                .appendTo('#containerMostVisited')
                .html(`
            

            <div class="user_card" id="${p.name_event}">
                <div class="event-card__img-wrap">
                    <img src="${p.img}" alt="${p.name_event}"/>
                    <span class="event-card__badge">${p.status}</span>
                </div>
                <div class="event-card__body">
                    <p class="event-card__title">${p.name_event}</p>
                    <div class="event-card__meta">
                        <span class="event-card__meta-item">
                            <span class="material-symbols-outlined"></span>
                            ${p.location}
                        </span>
                        <span class="event-card__meta-item">
                            <span class="material-symbols-outlined"></span>
                            ${f[2]} ${mes} ${f[0]}
                        </span>
                        <span class="event-card__meta-item">
                            <span class="material-symbols-outlined"></span>
                            ${p.event_time}
                        </span>
                    </div>
                    <div class="event-card__footer">
                        <span class="event-card__price">${p.price}€</span>
                        <button class="btn-ticket most_vist" id="${p.id_terra}">See more ...</button>
                   
                    </div>
                </div>
            </div>
            `);
        }

        const swiperMost = new Swiper('#mostSwiper', {
            slidesPerView: 3,
            slidesPerGroup: 1,
            spaceBetween: 18,
            loop: false,
            speed: 450,
            pagination: false,
        });

        document.getElementById('mostPrev').addEventListener('click', () => swiperMost.slidePrev());
        document.getElementById('mostNext').addEventListener('click', () => swiperMost.slideNext());


    }).catch(function(err) {
        console.log('error loadMostVisited', err);
    });
}

function clicks(){

            localStorage.removeItem('filter');
            localStorage.removeItem('filter_artist');
            localStorage.removeItem('filter_categories');
            localStorage.removeItem('filter_cities');
            localStorage.removeItem('filter_types');
            localStorage.removeItem('filter_price');

            
  


    $(document).on("click",'.cat_bot', function (){
        var filter = [];
        
      filter.push(['name_cat', this.getAttribute('id')]);
        // console.log(this.getAttribute('id'));
      localStorage.removeItem('filter');
      localStorage.setItem('filter', JSON.stringify(filter)); 
    //   console.log(filter);
        setTimeout(function(){ 
          window.location.href = 'index.php?page=controller_shop&op=view';
        }, 300);  
    }); 

    $(document).on("click",'.art_bot', function (){
      var filter = [];
      filter.push(['name_art', this.getAttribute('id')]);
    //   console.log(this.getAttribute('id'));
      localStorage.removeItem('filter');
      localStorage.setItem('filter', JSON.stringify(filter)); 
    
        setTimeout(function(){ 
          window.location.href = 'index.php?page=controller_shop&op=view';
        }, 300);  
    }); 

    $(document).on("click",'.cit_bot', function (){
      var filter = [];
      filter.push(['name_city', this.getAttribute('id')]);
      localStorage.removeItem('filter');
      localStorage.setItem('filter', JSON.stringify(filter)); 

        setTimeout(function(){ 
          window.location.href = 'index.php?page=controller_shop&op=view';
        }, 300);  
    });

    

    $(document).on("click",'.typ_bot', function (){
      var filter = [];
      filter.push(['name_type', this.getAttribute('id')]);
    //    console.log(this.getAttribute('id'));
      localStorage.removeItem('filter');
      localStorage.setItem('filter', JSON.stringify(filter)); 
       
      setTimeout(function(){ 
          window.location.href = 'index.php?page=controller_shop&op=view';
        }, 300);  
    });
 

    $(document).on("click", '.most_vist', function () {
        var id_terra = this.getAttribute('id');
        console.log(this.getAttribute('id'));
        localStorage.setItem('open_detail', id_terra);  // guarda el id
        window.location.href = 'index.php?page=controller_shop&op=view';
    });
}

/* ─── INIT ──────────────────────────────────────────────── */
$(document).ready(function () {
    loadEvents();
    loadCategory();
    loadArtist();
    loadCity();
    loadType();
    loadMostVisited();
    clicks();
});