// ══════════════════════════════
//  menu-script.js — Caldos Constitución
// ══════════════════════════════

// ── Menú móvil (hamburguesa) ──
const btnMobile  = document.getElementById('mobile-menu-button');
const menuMobile = document.getElementById('mobile-menu');

btnMobile.addEventListener('click', () => {
    menuMobile.classList.toggle('abierto');
});

// ── Filtros de categoría ──
const btnsFiltro = document.querySelectorAll('.btn-filtro');
const bloques    = document.querySelectorAll('.categoria-bloque');

btnsFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;

        // Quitar activo de todos y ponerlo solo al clickeado
        btnsFiltro.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');

        // Mostrar u ocultar bloques según categoría
        bloques.forEach(bloque => {
            if (cat === 'todos' || bloque.dataset.cat === cat) {
                bloque.classList.remove('oculto');
            } else {
                bloque.classList.add('oculto');
            }
        });
    });
});

// ── Sombra del header al hacer scroll ──
window.addEventListener('scroll', () => {
    const header = document.getElementById('nav-header');
    header.style.boxShadow = window.scrollY > 10
        ? '0 4px 30px rgba(59,31,14,.18)'
        : '0 2px 20px rgba(59,31,14,.10)';
});