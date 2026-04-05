document.addEventListener('DOMContentLoaded', () => {

    // --- SISTEMA DE IDIOMAS ---
    const idiomaActual = localStorage.getItem('idioma') || 'ES';
    
    // Actualizar el texto del botón de idioma al cargar
    const btnIdiomaTexto = document.querySelector('.btn-idioma span');
    if (btnIdiomaTexto) {
        btnIdiomaTexto.textContent = idiomaActual;
    }

    // Event listeners para cambiar idioma (usando el dropdown que YA EXISTE en el HTML)
    const dropdownItems = document.querySelectorAll('.dropdown-idioma .dropdown-item');
    dropdownItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            let nuevoIdioma = 'ES';
            
            // Determinar el idioma según el índice
            if (index === 0) nuevoIdioma = 'ES'; // Español
            else if (index === 1) nuevoIdioma = 'EN'; // English
            else if (index === 2) nuevoIdioma = 'FR'; // Français
            
            localStorage.setItem('idioma', nuevoIdioma);
            btnIdiomaTexto.textContent = nuevoIdioma;
            
            console.log(`Idioma cambiado a: ${nuevoIdioma}`);
        });
    });

    // --- MANEJO DEL MENÚ MÓVIL ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden-mobile');
            const iconoMenu = mobileMenuButton.querySelector('.icono-menu');
            if (iconoMenu) {
                iconoMenu.classList.toggle('fa-bars');
                iconoMenu.classList.toggle('fa-times');
            }
        });
    }

    // --- SCROLL SUAVE PARA ENLACES ANCLA ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offset = 80;
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                    // Cerrar menú móvil si está abierto
                    if (mobileMenu && !mobileMenu.classList.contains('hidden-mobile')) {
                        mobileMenu.classList.add('hidden-mobile');
                    }
                }
            }
        });
    });

    // --- ANIMACIÓN AL HACER SCROLL (IntersectionObserver) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-animation');
                entry.target.style.animationDelay = (Math.random() * 0.5) + 's';

                if (entry.target.classList.contains('stagger-animation-group')) {
                    const children = entry.target.querySelectorAll(':scope > *');
                    children.forEach((child, index) => {
                        child.style.animation = `staggerFadeIn 0.6s ease-out forwards`;
                        const baseDelay = parseFloat(entry.target.style.animationDelay || 0);
                        child.style.animationDelay = `${baseDelay + (index * 0.1)}s`;
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-animation, .stagger-animation-group').forEach(el => {
        observer.observe(el);
    });

    // --- EFECTOS DE HOVER MEJORADOS ---
    document.querySelectorAll('.menu-item, .card-3d').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02) rotateX(5deg)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0)';
            this.style.boxShadow = '';
        });
    });
    
    // --- ANIMACIÓN DE PRECIOS CON EFECTO DE PULSO ---
    const priceElements = document.querySelectorAll('.card-precio-secundario, .menu-item-precio');
    priceElements.forEach(price => {
        price.classList.add('pulse-slow-animation');
    });

    // --- EFECTO DE CARGA PROGRESIVA PARA IMÁGENES ---
    document.querySelectorAll('.card-imagen, .imagen-nosotros').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 700ms';
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // --- LÓGICA DEL MENÚ PERFIL (MEJORADO Y ARREGLADO) ---
    const btnPerfil = document.getElementById('btnPerfil');
    const menuPerfil = document.getElementById('menuPerfil');
    const btnCerrarSesion = document.getElementById('logout');

    if (btnPerfil && menuPerfil) {
        // Abrir/cerrar menú al hacer clic en el botón
        btnPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            menuPerfil.classList.toggle('mostrar');
            console.log('Menú perfil toggled'); // Para debug
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!menuPerfil.contains(e.target) && !btnPerfil.contains(e.target)) {
                menuPerfil.classList.remove('mostrar');
            }
        });

        // Prevenir que el menú se cierre al hacer clic dentro
        menuPerfil.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // --- LÓGICA DE CERRAR SESIÓN ---
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
                localStorage.removeItem('usuarioNombre');
                localStorage.removeItem('usuarioEmail');
                window.location.href = 'login.html'; 
            }
        });
    }

    // --- LÓGICA PARA MOSTRAR NOMBRE DEL USUARIO ---
    const nombreGuardado = localStorage.getItem('usuarioNombre');
    const emailGuardado = localStorage.getItem('usuarioEmail');

    // Actualizar el saludo en el menú desplegable
    if (nombreGuardado) {
        const usuarioInfo = document.querySelector('.usuario-info p');
        if (usuarioInfo) {
            usuarioInfo.innerHTML = `<strong>Hola, ${nombreGuardado}</strong>`;
        }
    }

    // Si estamos en la página de perfil, actualizar los datos
    const pNombre = document.getElementById('perfilNombre');
    const pEmail = document.getElementById('perfilEmail');
    const pTitulo = document.getElementById('perfilNombreTitulo');

    if (pNombre && nombreGuardado) pNombre.textContent = nombreGuardado;
    if (pTitulo && nombreGuardado) pTitulo.textContent = nombreGuardado;
    if (pEmail && emailGuardado) pEmail.textContent = emailGuardado;
});

// --- SISTEMA DE NOTIFICACIONES ---

// Array de notificaciones (simulado - después puedes traerlo de una API)
const notificaciones = [
    {
        id: 1,
        titulo: "Nuevo pedido confirmado",
        mensaje: "Tu pedido #1234 está en camino",
        tiempo: "Hace 5 min",
        icono: "fas fa-shopping-cart",
        leida: false,
        link: "#pedido-1234"
    },
    {
        id: 2,
        titulo: "Oferta especial",
        mensaje: "20% descuento en todos los caldos",
        tiempo: "Hace 1 hora",
        icono: "fas fa-tag",
        leida: false,
        link: "#ofertas"
    },
    {
        id: 3,
        titulo: "Reservación confirmada",
        mensaje: "Mesa para 4 personas mañana 7:00 PM",
        tiempo: "Hace 3 horas",
        icono: "fas fa-calendar",
        leida: true,
        link: "#reservaciones"
    }
];

// Guardar en localStorage
function guardarNotificaciones() {
    localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
}

// Cargar de localStorage
function cargarNotificaciones() {
    const guardadas = localStorage.getItem('notificaciones');
    if (guardadas) {
        return JSON.parse(guardadas);
    }
    return notificaciones;
}

// Contar no leídas
function contarNoLeidas() {
    const notifs = cargarNotificaciones();
    return notifs.filter(n => !n.leida).length;
}

// Actualizar contador
function actualizarContador() {
    const contador = document.getElementById('contadorNotificaciones');
    if (contador) {
        const noLeidas = contarNoLeidas();
        contador.textContent = noLeidas;
        
        if (noLeidas === 0) {
            contador.style.display = 'none';
        } else {
            contador.style.display = 'flex';
        }
    }
}

// Renderizar notificaciones en el dropdown
function renderizarNotificacionesDropdown() {
    const lista = document.getElementById('listaNotificaciones');
    if (!lista) return;

    const notifs = cargarNotificaciones();
    lista.innerHTML = '';

    if (notifs.length === 0) {
        lista.innerHTML = `
            <div class="notificaciones-vacio">
                <i class="fas fa-bell-slash"></i>
                <p>No tienes notificaciones</p>
            </div>
        `;
        return;
    }

    // Mostrar solo las últimas 5 en el dropdown
    const ultimas = notifs.slice(0, 5);

    ultimas.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notificacion-item ${!notif.leida ? 'no-leida' : ''}`;
        item.innerHTML = `
            <div class="notificacion-icono">
                <i class="${notif.icono}"></i>
            </div>
            <div class="notificacion-contenido">
                <div class="notificacion-titulo">${notif.titulo}</div>
                <div class="notificacion-texto">${notif.mensaje}</div>
                <div class="notificacion-tiempo">${notif.tiempo}</div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            // Marcar como leída
            notif.leida = true;
            guardarNotificaciones();
            actualizarContador();
            renderizarNotificacionesDropdown();
            
            // Ir al link o a la página de notificaciones
            if (notif.link && notif.link !== '#') {
                window.location.href = notif.link;
            } else {
                window.location.href = 'notificaciones.html';
            }
        });

        lista.appendChild(item);
    });
}

// Inicializar sistema de notificaciones
document.addEventListener('DOMContentLoaded', () => {
    const btnNotificacion = document.getElementById('btnNotificacion');
    const menuNotificaciones = document.getElementById('menuNotificaciones');

    if (btnNotificacion && menuNotificaciones) {
        // Toggle menú
        btnNotificacion.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            menuNotificaciones.classList.toggle('mostrar');
            
            // Cerrar menú de perfil si está abierto
            const menuPerfil = document.getElementById('menuPerfil');
            if (menuPerfil) {
                menuPerfil.classList.remove('mostrar');
            }
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!menuNotificaciones.contains(e.target) && !btnNotificacion.contains(e.target)) {
                menuNotificaciones.classList.remove('mostrar');
            }
        });

        // Prevenir cierre al hacer clic dentro
        menuNotificaciones.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Inicializar
    actualizarContador();
    renderizarNotificacionesDropdown();
});