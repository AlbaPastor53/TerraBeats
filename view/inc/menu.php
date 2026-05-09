
<nav class="navbar" id="navbar">
    <div class="navbar__inner">

        <!-- Logo -->
        <a href="index.php?page=controller_home&op=view" class="navbar__logo">
            <span class="navbar__logo-icon">♪</span>
            <span class="navbar__logo-text">TerraBeats</span>
        </a>

        <!-- Links de navegación -->
        <ul class="navbar__links" id="navLinks">
            <li>
                <a href="index.php?page=controller_shop&op=view"
                   class="navbar__link <?= (isset($_GET['page']) && $_GET['page'] === 'controller_shop') ? 'active' : '' ?>">
                   Shop
                </a>
            </li>
            
        </ul>

        <!-- Buscador + avatar -->
        <div class="navbar__actions">
            <!-- <div class="navbar__search">
                <input type="text" placeholder="Buscar eventos..." class="navbar__search-input" id="searchInput">
                <button class="navbar__search-btn" aria-label="Buscar">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                </button>
            </div> -->

            <div class="div_search" style="display: inline; width: 5%; height: 5%;">
                <select class="search_city"></select>
                <select class="search_category"></select>
                <input type="text" id="autocom" autocomplete="off" placeholder="City" style="width: 10%;" />
                <div id="search_auto"></div>
                <input type="button" value="search" id="search-btn" class="btna third" style="display: inline;" />
            </div>
            
            <a href="index.php?page=contactus" class="navbar__avatar" aria-label="Perfil">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </a>
        </div>

        <!-- Botón hamburguesa (móvil) -->
        <button class="navbar__hamburger" id="hamburger" aria-label="Menú" aria-expanded="false">
            <span> <a href="index.php?page=controller_shop&op=view"
                   class="navbar__link <?= (isset($_GET['page']) && $_GET['page'] === 'controller_shop') ? 'active' : '' ?>">
                   Shop
                </a></span>
            <span></span>
        </button>

    </div>
</nav>
