// JavaScript para la página de notificaciones

document.addEventListener('DOMContentLoaded', () => {
    let filtroActual = 'todas';

    // Cargar notificaciones
    function cargarNotificaciones() {
        const guardadas = localStorage.getItem('notificaciones');
        if (guardadas) {
            return JSON.parse(guardadas);
        }
        // Notificaciones por defecto
        return [
            {
                id: 1,
                titulo: "Nuevo pedido confirmado",
                mensaje: "Tu pedido #1234 ha sido confirmado y está en preparación. Tiempo estimado de entrega: 45 minutos.",
                tiempo: "Hace 5 minutos",
                icono: "fas fa-shopping-cart",
                leida: false,
                fecha: new Date().toISOString()
            },
            {
                id: 2,
                titulo: "Oferta especial disponible",
                mensaje: "¡Aprovecha! 20% de descuento en todos nuestros caldos esta semana. Válido hasta el domingo.",
                tiempo: "Hace 1 hora",
                icono: "fas fa-tag",
                leida: false,
                fecha: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 3,
                titulo: "Reservación confirmada",
                mensaje: "Tu mesa para 4 personas está confirmada para mañana a las 7:00 PM. ¡Te esperamos!",
                tiempo: "Hace 3 horas",
                icono: "fas fa-calendar",
                leida: true,
                fecha: new Date(Date.now() - 10800000).toISOString()
            },
            {
                id: 4,
                titulo: "Nuevo producto en el menú",
                mensaje: "Prueba nuestro nuevo Sancocho de 7 Carnes, disponible desde hoy. ¡Una explosión de sabores!",
                tiempo: "Hace 1 día",
                icono: "fas fa-utensils",
                leida: true,
                fecha: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 5,
                titulo: "Puntos de fidelidad",
                mensaje: "Has acumulado 150 puntos. ¡Canjéalos por un postre gratis en tu próxima visita!",
                tiempo: "Hace 2 días",
                icono: "fas fa-gift",
                leida: true,
                fecha: new Date(Date.now() - 172800000).toISOString()
            }
        ];
    }

    // Guardar notificaciones
    function guardarNotificaciones(notificaciones) {
        localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
    }

    // Actualizar contadores
    function actualizarContadores() {
        const notificaciones = cargarNotificaciones();
        const todas = notificaciones.length;
        const noLeidas = notificaciones.filter(n => !n.leida).length;
        const leidas = notificaciones.filter(n => n.leida).length;

        document.getElementById('countTodas').textContent = todas;
        document.getElementById('countNoLeidas').textContent = noLeidas;
        document.getElementById('countLeidas').textContent = leidas;
    }

    // Renderizar notificaciones
    function renderizarNotificaciones() {
        const notificaciones = cargarNotificaciones();
        const contenedor = document.getElementById('notificacionesContenido');
        contenedor.innerHTML = '';

        // Filtrar según el filtro actual
        let notificacionesFiltradas = notificaciones;
        if (filtroActual === 'no-leidas') {
            notificacionesFiltradas = notificaciones.filter(n => !n.leida);
        } else if (filtroActual === 'leidas') {
            notificacionesFiltradas = notificaciones.filter(n => n.leida);
        }

        // Mostrar mensaje si no hay notificaciones
        if (notificacionesFiltradas.length === 0) {
            contenedor.innerHTML = `
                <div class="notificaciones-vacio-pagina">
                    <i class="fas fa-bell-slash"></i>
                    <h3>No hay notificaciones</h3>
                    <p>Cuando tengas nuevas notificaciones, aparecerán aquí.</p>
                </div>
            `;
            return;
        }

        // Renderizar cada notificación
        notificacionesFiltradas.forEach(notif => {
            const card = document.createElement('div');
            card.className = `notificacion-card ${!notif.leida ? 'no-leida' : ''}`;
            card.innerHTML = `
                <div class="notificacion-card-icono">
                    <i class="${notif.icono}"></i>
                </div>
                <div class="notificacion-card-contenido">
                    <div class="notificacion-card-header">
                        <div>
                            <div class="notificacion-card-titulo">${notif.titulo}</div>
                        </div>
                        <div class="notificacion-card-tiempo">${notif.tiempo}</div>
                    </div>
                    <div class="notificacion-card-mensaje">${notif.mensaje}</div>
                    <div class="notificacion-card-acciones">
                        ${!notif.leida ? '<button class="notificacion-btn primary btn-marcar" data-id="' + notif.id + '">Marcar como leída</button>' : ''}
                        <button class="notificacion-btn btn-eliminar" data-id="${notif.id}">Eliminar</button>
                    </div>
                </div>
            `;

            // Event listeners
            const btnMarcar = card.querySelector('.btn-marcar');
            if (btnMarcar) {
                btnMarcar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    marcarComoLeida(notif.id);
                });
            }

            const btnEliminar = card.querySelector('.btn-eliminar');
            btnEliminar.addEventListener('click', (e) => {
                e.stopPropagation();
                eliminarNotificacion(notif.id);
            });

            contenedor.appendChild(card);
        });
    }

    // Marcar como leída
    function marcarComoLeida(id) {
        const notificaciones = cargarNotificaciones();
        const notif = notificaciones.find(n => n.id === id);
        if (notif) {
            notif.leida = true;
            guardarNotificaciones(notificaciones);
            actualizarContadores();
            renderizarNotificaciones();
        }
    }

    // Eliminar notificación
    function eliminarNotificacion(id) {
        if (confirm('¿Estás seguro de eliminar esta notificación?')) {
            let notificaciones = cargarNotificaciones();
            notificaciones = notificaciones.filter(n => n.id !== id);
            guardarNotificaciones(notificaciones);
            actualizarContadores();
            renderizarNotificaciones();
        }
    }

    // Marcar todas como leídas
    const btnMarcarTodas = document.getElementById('btnMarcarLeidas');
    if (btnMarcarTodas) {
        btnMarcarTodas.addEventListener('click', () => {
            const notificaciones = cargarNotificaciones();
            notificaciones.forEach(n => n.leida = true);
            guardarNotificaciones(notificaciones);
            actualizarContadores();
            renderizarNotificaciones();
        });
    }

    // Filtros
    const filtros = document.querySelectorAll('.filtro-btn');
    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            // Remover clase active de todos
            filtros.forEach(f => f.classList.remove('active'));
            
            // Agregar clase active al clickeado
            filtro.classList.add('active');
            
            // Actualizar filtro actual
            filtroActual = filtro.getAttribute('data-filtro');
            
            // Renderizar
            renderizarNotificaciones();
        });
    });

    // Inicializar
    actualizarContadores();
    renderizarNotificaciones();
});