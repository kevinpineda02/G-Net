// Variables globales
let publicaciones = [];
let contadorPublicaciones = 1;
let imagenesSeleccionadas = [];
let inputImagen = null;
const MAX_CARACTERES = 2500;

// Publicación inicial del calendario académico (como una publicación normal)
const publicacionCalendario = {
    id: contadorPublicaciones++,
    contenido: '¡Ya está disponible el calendario académico 2025! 📅<br>Consulta aquí las fechas importantes de parciales, inscripciones y días festivos.<br>¿Tienes dudas sobre algún evento? Déjalo en los comentarios y te ayudamos.<br>#UFG #Calendario2025 #VidaEstudiantil.',
    autor: 'Gustambo',
    handle: '@gustambo',
    fecha: new Date(2025, 7, 15, 10, 0, 0), // 15 de agosto de 2025, 10:00am
    likes: 0,
    comentarios: 0,
    compartidas: 0,
    liked: false,
    imagenes: [
        {
            id: 'calendario2025-ene-feb',
            url: 'Imagenes/publicaciones/Calendario.png',
            nombre: 'Calendario Académico UFG 2025 (Enero-Febrero)'
        },
        {
            id: 'calendario2025-mar-abr',
            url: 'Imagenes/publicaciones/Calendario2.png',
            nombre: 'Calendario Académico UFG 2025 (Marzo-Abril)'
        },
        {
            id: 'calendario2025-may-jun',
            url: 'Imagenes/publicaciones/Calendario3.png',
            nombre: 'Calendario Académico UFG 2025 (Mayo-Junio)'
        },
        {
            id: 'calendario2025-jul-ago',
            url: 'Imagenes/publicaciones/Calendario4.png',
            nombre: 'Calendario Académico UFG 2025 (Julio-Agosto)'
        },
        {
            id: 'calendario2025-nov-dic',
            url: 'Imagenes/publicaciones/Calendario5.png',
            nombre: 'Calendario Académico UFG 2025 (Noviembre-Diciembre)'
        }
    ]
};

publicaciones.unshift(publicacionCalendario);
// Al cargar la página, renderizar la publicación del calendario académico
document.addEventListener('DOMContentLoaded', function() {
    renderizarPublicacion(publicacionCalendario);
});

// Función para inicializar los eventos
document.addEventListener('DOMContentLoaded', function() {
    // Registrar la publicación fija en el array publicaciones si existe
    inicializarPublicacionFija();
    inicializarEventos();
    inicializarContadorCaracteres();
});


// Registrar la publicación fija en el array publicaciones para que use el sistema global
function inicializarPublicacionFija() {
    const cardFija = document.querySelector('.card-fija');
    if (!cardFija) return;
    // Si ya tiene data-id, no hacer nada
    if (!cardFija.dataset.id) {
        cardFija.dataset.id = 'fija';
    }
    // Buscar si ya está en publicaciones
    if (!publicaciones.find(p => p.id === 'fija')) {
        // Obtener datos de la publicación fija
        const autor = cardFija.querySelector('.nombre-usuario')?.textContent?.trim() || 'Gustambo';
        const contenido = cardFija.querySelector('.texto-publicacion')?.textContent?.trim() || '';
        const likes = parseInt(cardFija.querySelector('.like-button span')?.textContent || '0');
        const comentarios = parseInt(cardFija.querySelector('.comment-button span')?.textContent || '0');
        publicaciones.unshift({
            id: 'fija',
            autor,
            contenido,
            fecha: new Date(),
            likes,
            comentarios,
            compartidas: 0,
            liked: false,
            comentariosLista: []
        });
    }
    // Asignar data-id a los botones
    const btnLike = cardFija.querySelector('.like-button');
    if (btnLike) btnLike.dataset.id = 'fija';
    const btnComment = cardFija.querySelector('.comment-button');
    if (btnComment) btnComment.dataset.id = 'fija';
    const btnShare = cardFija.querySelector('.share-button');
    if (btnShare) btnShare.dataset.id = 'fija';
    // Asignar data-publicacion-id al preview de comentarios si existe
    const preview = cardFija.querySelector('.comentarios-preview');
    if (preview) preview.dataset.publicacionId = 'fija';
}
function inicializarEventos() {
    console.log('Inicializando eventos...');
    
    // Evento para el botón de publicar
    const btnPublicar = document.querySelector('.publicar-button');
    console.log('Botón publicar encontrado:', btnPublicar);
    if (btnPublicar) {
        btnPublicar.addEventListener('click', function(e) {
            console.log('Click en botón publicar detectado');
            e.preventDefault();
            crearPublicacion();
        });
    } else {
        console.error('No se encontró el botón .publicar-button');
    }

    // Evento para el botón flotante de chat (chat-fab)
    const btnChatFab = document.querySelector('.chat-fab');
    if (btnChatFab) {
        btnChatFab.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarVentanaChats();
        });
    }

    // Evento para el input de compartir (Enter para publicar)
    const inputCompartir = document.querySelector('.input-Compartir');
    console.log('Input compartir encontrado:', inputCompartir);
    if (inputCompartir) {
        inputCompartir.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                console.log('Enter presionado en input');
                e.preventDefault();
                crearPublicacion();
            }
        });
        
        // Evento para mostrar/ocultar el botón publicar según el contenido
        inputCompartir.addEventListener('input', toggleBotonPublicar);
    } else {
        console.error('No se encontró el input .input-Compartir');
    }

    // Eventos para botones de interacción (like, comentar, compartir)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-button')) {
            toggleLike(e.target.closest('.like-button'));
        } else if (e.target.closest('.comment-button')) {
            mostrarComentarios(e.target.closest('.comment-button'));
        } else if (e.target.closest('.share-button')) {
            compartirPublicacion(e.target.closest('.share-button'));
        } else if (e.target.closest('.archivar-imagen')) {
            abrirSelectorImagen();
        } else if (e.target.closest('.expand-indicator')) {
            expandirImagen(e.target.closest('.expand-indicator'));
        } else if (e.target.closest('.carrusel-next')) {
            navegarCarrusel(e.target.closest('.carrusel-next'), 'next');
        } else if (e.target.closest('.carrusel-prev')) {
            navegarCarrusel(e.target.closest('.carrusel-prev'), 'prev');
        } else if (e.target.closest('.indicador')) {
            irAImagen(e.target.closest('.indicador'));
        } else if (e.target.closest('.ver-comentarios-btn')) {
            // Abrir modal de comentarios desde el botón "Ver comentarios"
            const publicacionId = parseInt(e.target.closest('.ver-comentarios-btn').dataset.publicacionId);
            const botonComentario = document.querySelector(`[data-id="${publicacionId}"] .comment-button`);
            if (botonComentario) {
                mostrarComentarios(botonComentario);
            }
        } else if (e.target.closest('.chat-button')) {
            mostrarVentanaChats();
        }
    });

    // Soporte para imágenes y videos en la card de publicar
    const inputMedia = document.querySelector('.input-media');
    const mediaPreview = document.querySelector('.media-preview');
    window.archivosSeleccionados = [];
    if (inputMedia && mediaPreview) {
        inputMedia.addEventListener('change', function() {
            let nuevas = Array.from(this.files);
            if (!window.archivosSeleccionados) window.archivosSeleccionados = [];
            // Limitar a solo un video por publicación
            const yaHayVideo = window.archivosSeleccionados.some(f => f.type && f.type.startsWith('video/'));
            let nuevasFiltradas = [];
            let videoAgregado = yaHayVideo;
            for (let i = 0; i < nuevas.length; i++) {
                const file = nuevas[i];
                if (file.type.startsWith('video/')) {
                    if (videoAgregado) {
                        mostrarModalAviso('Solo puedes adjuntar un video por publicación.');
                        continue;
                    }
                    videoAgregado = true;
                }
                nuevasFiltradas.push(file);
            }
    // Modal visual para avisos
    function mostrarModalAviso(mensaje) {
        // Si ya hay un modal, no crear otro
        if (document.querySelector('.modal-aviso')) return;
        const modal = document.createElement('div');
        modal.className = 'modal-aviso';
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.45);
            display: flex; align-items: center; justify-content: center;
            z-index: 99999;
        `;
        const card = document.createElement('div');
        card.style.cssText = `
            background: #23253a;
            color: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 32px #0007;
            padding: 32px 28px 22px 28px;
            min-width: 320px;
            max-width: 90vw;
            text-align: center;
            font-size: 1.13rem;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        `;
        card.innerHTML = `
            <div style="font-size:2.1rem;margin-bottom:10px;">⚠️</div>
            <div style="margin-bottom:22px;">${mensaje}</div>
            <button style="background:#ff8a5b;color:#fff;border:none;padding:8px 28px;border-radius:8px;font-size:1.05rem;font-weight:600;cursor:pointer;box-shadow:0 2px 8px #0002;transition:background 0.18s;">Aceptar</button>
        `;
        const btn = card.querySelector('button');
        btn.onclick = function() {
            document.body.removeChild(modal);
        };
        modal.appendChild(card);
        document.body.appendChild(modal);
    }
            // Filtrar para no pasar de 4 archivos en total
            let total = window.archivosSeleccionados.length + nuevasFiltradas.length;
            if (total > 4) {
                alert('Máximo 4 archivos por publicación');
                nuevasFiltradas = nuevasFiltradas.slice(0, 4 - window.archivosSeleccionados.length);
            }
            // Agregar nuevas imágenes/videos, evitando duplicados por nombre y tamaño
            nuevasFiltradas.forEach(nueva => {
                if (!window.archivosSeleccionados.some(f => f.name === nueva.name && f.size === nueva.size)) {
                    window.archivosSeleccionados.push(nueva);
                }
            });
            mostrarPreviewMedia();
            toggleBotonPublicar();
            this.value = '';
        });
    }

    // Botón para abrir el input de archivos
    const btnArchivo = document.querySelector('.archivar-imagen');
    if (btnArchivo && inputMedia) {
        btnArchivo.addEventListener('click', function(e) {
            e.preventDefault();
            inputMedia.click();
        });
    }

    function mostrarPreviewMedia() {
        mediaPreview.innerHTML = '';
        if (!window.archivosSeleccionados || window.archivosSeleccionados.length === 0) return;
        window.archivosSeleccionados.forEach(file => {
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                // Usar una propiedad temporal para la URL, pero NO revocar aquí
                if (!file._previewUrl) file._previewUrl = URL.createObjectURL(file);
                img.src = file._previewUrl;
                img.style.maxWidth = '120px';
                img.style.maxHeight = '120px';
                img.style.marginRight = '8px';
                mediaPreview.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                if (!file._previewUrl) file._previewUrl = URL.createObjectURL(file);
                video.src = file._previewUrl;
                video.controls = true;
                video.style.maxWidth = '160px';
                video.style.maxHeight = '120px';
                video.style.marginRight = '8px';
                mediaPreview.appendChild(video);
            }
        });
    }
}
// Función para mostrar la ventana de chats a pantalla completa
function mostrarVentanaChats() {

    // Si ya existe una ventana de chats, no crear otra
    if (document.querySelector('.ventana-chats')) return;

    // Perfiles de ejemplo
    const perfiles = [
        { nombre: 'Carlos Mendez', handle: '@carlosmendez', iniciales: 'CM', online: true },
        { nombre: 'Laura Ruiz', handle: '@lauraruiz', iniciales: 'LR', online: false },
        { nombre: 'Ana Torres', handle: '@anatorres', iniciales: 'AT', online: true },
        { nombre: 'Juan Pérez', handle: '@juanperez', iniciales: 'JP', online: false }
    ];

    const modalChats = document.createElement('div');
    modalChats.className = 'ventana-chats';
    modalChats.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #161616;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Header de la ventana de chats
    const header = document.createElement('div');
    header.style.cssText = `
        background: #202020;
        color: #fff;
        padding: 0px 24px;
        font-size: 1.3rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #22253a;
        position: relative;
    `;
    let salirBtnHtml = '';
    if (window.innerWidth <= 700) {
        salirBtnHtml = `<button class="salir-chats-portal" style="position:absolute;left:8px;top:8px;background:#23253a;color:#ff8a5b;border:none;padding:4px 13px 4px 10px;border-radius:7px;font-size:1.01rem;z-index:20;cursor:pointer;box-shadow:0 2px 8px #0002;display:flex;align-items:center;gap:4px;transition:background 0.18s;">
            <span style='font-size:1.2em;line-height:1;'>⎋</span> <span style='font-size:1em;'>Salir</span>
        </button>`;
    }
    header.innerHTML = `
        ${salirBtnHtml}
        <span style="color: #ff8a5b;">Chats</span>
        <button class="cerrar-chats" style="background: none; border: none; color: #ff8a5b; font-size: 2rem; cursor: pointer; border-radius: 8px; padding: 4px 12px; transition: background 0.2s;">×</button>
    `;

    // Contenedor principal de chats (sidebar + chat)
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        flex: 1;
        display: flex;
        min-height: 0;
        min-width: 0;
        background: #161616;
    `;

    // Sidebar de perfiles
    const sidebar = document.createElement('div');
    if (window.innerWidth <= 700) {
        // RESPONSIVO: sidebar ocupa toda la pantalla, sin borde derecho, padding más pequeño
        sidebar.style.cssText = `
            width: 100vw;
            height: 100vh;
            background: #18191b;
            display: flex;
            flex-direction: column;
            padding: 0;
            overflow-y: auto;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 2002;
        `;
        sidebar.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;padding: 18px 12px 10px 18px;">
                <span style="color: #A0AEC0; font-size: 1.13rem; font-weight: 600; letter-spacing:0.5px;">Personas</span>
                <button class="salir-chats-portal" style="background:#23253a;color:#ff8a5b;border:none;padding:4px 13px 4px 10px;border-radius:7px;font-size:1.01rem;z-index:20;cursor:pointer;box-shadow:0 2px 8px #0002;display:flex;align-items:center;gap:4px;transition:background 0.18s;">
                    <span style='font-size:1.2em;line-height:1;'>⎋</span> <span style='font-size:1em;'>Salir</span>
                </button>
            </div>
        `;
    } else {
        // ESCRITORIO: sidebar tradicional
        sidebar.style.cssText = `
            width: 320px;
            background: #18191b;
            border-right: 1px solid #22253a;
            display: flex;
            flex-direction: column;
            padding: 0;
            overflow-y: auto;
        `;
        sidebar.innerHTML = `<div style="padding: 24px 24px 12px 24px; color: #A0AEC0; font-size: 1.15rem; font-weight: 600; letter-spacing:0.5px;">Personas</div>`;
    }

    const listaPerfiles = document.createElement('div');
    listaPerfiles.style.cssText = 'flex:1;';
    perfiles.forEach((perfil, idx) => {
        const perfilDiv = document.createElement('div');
        perfilDiv.className = 'perfil-chat-item';
        perfilDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 14px 24px;
            cursor: pointer;
            border-radius: 10px;
            margin: 0 10px 6px 10px;
            transition: background 0.2s;
        `;
        perfilDiv.innerHTML = `
            <div style="width: 46px; height: 46px; border-radius: 50%; background: #22253a; color: #ff8a5b; display: flex; align-items: center; justify-content: center; font-size: 1.22rem; font-weight: 700; position: relative;">
                ${perfil.iniciales}
                ${perfil.online ? '<span style=\"position:absolute;bottom:7px;right:7px;width:11px;height:11px;background:#4ade80;border-radius:50%;border:2px solid #18191b;\"></span>' : ''}
            </div>
            <div style="flex:1;">
                <div style="color:#E6ECF3;font-weight:600;font-size:1.07rem;">${perfil.nombre}</div>
                <div style="color:#A0AEC0;font-size:0.97rem;">${perfil.handle}</div>
            </div>
        `;
            perfilDiv.addEventListener('click', function() {
                mostrarChatDePerfil(perfil);
                // Solo en responsivo: ocultar sidebar y mostrar solo el chat
                if (window.innerWidth <= 700) {
                    sidebar.style.display = 'none';
                    chatArea.style.flex = '1 1 100%';
                    chatArea.style.width = '100vw';
                    chatArea.style.maxWidth = '100vw';
                    chatArea.style.minWidth = '0';
                    chatArea.style.height = '100vh';
                    chatArea.style.position = 'fixed';
                    chatArea.style.left = '0';
                    chatArea.style.top = '0';
                    chatArea.style.zIndex = '2002';
                    chatArea.style.background = '#161616';
                    // Botón para volver al listado de personas (mejorado)
                    if (!chatArea.querySelector('.btn-volver-personas')) {
                        const btnVolver = document.createElement('button');
                        btnVolver.innerHTML = '<span style="font-size:1.1em;line-height:1;">←</span> <span style="font-size:1em;">Personas</span>';
                        btnVolver.className = 'btn-volver-personas';
                        btnVolver.style.cssText = 'position:absolute;top:10px;left:10px;background:#23253a;color:#ff8a5b;border:none;padding:3px 10px 3px 8px;border-radius:7px;font-size:0.93rem;z-index:10;cursor:pointer;box-shadow:0 2px 8px #0002;display:flex;align-items:center;gap:4px;transition:background 0.18s;';
                        btnVolver.onclick = function() {
                            sidebar.style.display = 'flex';
                            chatArea.style.flex = '1';
                            chatArea.style.width = '';
                            chatArea.style.maxWidth = '';
                            chatArea.style.minWidth = '';
                            chatArea.style.height = '';
                            chatArea.style.position = '';
                            chatArea.style.left = '';
                            chatArea.style.top = '';
                            chatArea.style.zIndex = '';
                            chatArea.style.background = '';
                            btnVolver.remove();
                        };
                        chatArea.appendChild(btnVolver);
                    }
                }
            });
        listaPerfiles.appendChild(perfilDiv);
    });
    sidebar.appendChild(listaPerfiles);
    // Asignar evento al botón salir del sidebar (responsivo) después de agregar sidebar al DOM
    setTimeout(() => {
        const btnSalirSidebar = sidebar.querySelector('.salir-chats-portal');
        if (btnSalirSidebar) {
            btnSalirSidebar.onclick = function() {
                cerrarVentanaChats();
            };
        }
    }, 0);

    // Área de chat (por defecto placeholder)
    const chatArea = document.createElement('div');
    chatArea.className = 'chat-area';
    chatArea.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
        color: #A0AEC0;
        font-size: 1.1rem;
        min-width: 0;
        min-height: 0;
        background: #161616;
    `;
    chatArea.innerHTML = `<div style="height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center; color:#A0AEC0;">
        Selecciona un perfil para chatear.<br>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='72' height='72' style='margin-top:28px; display:block; margin-left:auto; margin-right:auto;'>
            <path d='M8 32c0-11.05 10.75-20 24-20s24 8.95 24 20-10.75 20-24 20c-2.6 0-5.13-.23-7.54-.68-2.13.97-7.46 3.18-11.46 3.68-1.13.14-2.01-.97-1.54-2.01 1.13-2.5 2.41-6.13 2.41-8.13C10.13 41.13 8 36.77 8 32z' fill='none' stroke='#FF8A5B' stroke-width='3'/>
            <circle cx='24' cy='34' r='3' fill='#FF8A5B'/>
            <circle cx='32' cy='34' r='3' fill='#FF8A5B'/>
            <circle cx='40' cy='34' r='3' fill='#FF8A5B'/>
        </svg>
    </div>`;

    // Función para mostrar el chat de un perfil
    // Almacenar mensajes por perfil (en memoria, solo para la sesión actual)
    const mensajesPorPerfil = {};

    function mostrarChatDePerfil(perfil) {
        if (!mensajesPorPerfil[perfil.handle]) mensajesPorPerfil[perfil.handle] = [];
        if (window.innerWidth <= 700) {
            // RESPONSIVO: prompt y botones más compactos, botón volver mejorado
            chatArea.innerHTML = `
                <div id="chat-contenedor" style="width:100vw;height:100vh;display:flex;flex-direction:column;background:#191a1e;position:relative;">
                    <div style="position:sticky;top:0;left:0;right:0;z-index:10;background:#202020;display:flex;align-items:center;gap:10px;padding:10px 6px 8px 6px;border-bottom:1.5px solid #23263a;min-height:44px;">
                        <button class='btn-volver-personas' style='background:#23253a;color:#ff8a5b;border:none;padding:3px 10px 3px 8px;border-radius:7px;font-size:0.93rem;cursor:pointer;box-shadow:0 2px 8px #0002;margin-right:8px;display:flex;align-items:center;gap:4px;transition:background 0.18s;' tabindex="0">
                            <span style="font-size:1.1em;line-height:1;">←</span>
                            <span style="font-size:1em;">Personas</span>
                        </button>
                        <div style='width:32px;height:32px;border-radius:50%;background:#22253a;color:#ff8a5b;display:flex;align-items:center;justify-content:center;font-size:0.97rem;font-weight:700;'>${perfil.iniciales}</div>
                        <div style='flex:1;'>
                            <div style='color:#E6ECF3;font-weight:700;font-size:0.95rem;'>${perfil.nombre}</div>
                            <div style='color:#A0AEC0;font-size:0.85rem;'>${perfil.handle}</div>
                        </div>
                    </div>
                    <div id="mensajes-chat" style='flex:1;display:flex;flex-direction:column;gap:10px;overflow-y:auto;padding:14px 4px 0 4px;background:#191a1e;'>
                    </div>
                    <div style='position:fixed;left:0;right:0;bottom:0;z-index:20;background:linear-gradient(0deg,#191a1e 90%,#191a1e00 100%);padding:0 0 4px 0;'>
                        <div id="form-mensaje-chat" style='display:flex;align-items:center;justify-content:flex-start;position:relative;background:#23253a;border-radius:12px;max-width:98vw;margin:auto 4px;width:calc(100vw - 8px);box-shadow:0 2px 8px #0002;padding:2px 0;'>
                            <button id='btn-adjuntar-imagen' title='Adjuntar imagen' style='background:#23253a;border:none;color:#ff8a5b;padding:7px 8px;border-radius:8px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;margin-right:4px;'>📎</button>
                            <div id='preview-imagen-chat' style='display:none;align-items:center;justify-content:center;margin-left:0;margin-right:6px;'></div>
                            <input id='input-mensaje-chat' type='text' autocomplete='off' placeholder='Escribe un mensaje...' style='flex:1;max-width:100vw;padding:9px 10px;border-radius:8px;border:none;background:#23253a;color:#E6ECF3;font-size:0.98rem;outline:none;'>
                            <input id='input-imagen-chat' type='file' accept='image/*' style='display:none;'>
                            <button id='btn-enviar-mensaje' style='background:#ff8a5b;border:none;color:#fff;padding:9px 13px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.98rem;margin-left:4px;'>Enviar</button>
                        </div>
                    </div>
                </div>
            `;
            // Asignar evento al botón de volver después de renderizar
            const btnVolver = chatArea.querySelector('.btn-volver-personas');
            if (btnVolver) {
                btnVolver.onclick = function() {
                    sidebar.style.display = 'flex';
                    chatArea.style.flex = '1';
                    chatArea.style.width = '';
                    chatArea.style.maxWidth = '';
                    chatArea.style.minWidth = '';
                    chatArea.style.height = '';
                    chatArea.style.position = '';
                    chatArea.style.left = '';
                    chatArea.style.top = '';
                    chatArea.style.zIndex = '';
                    chatArea.style.background = '';
                    // Restaurar placeholder de selección de perfil
                    chatArea.innerHTML = `<div style=\"height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center; color:#A0AEC0;\">Selecciona un perfil para chatear.<br><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='72' height='72' style='margin-top:28px; display:block; margin-left:auto; margin-right:auto;'><path d='M8 32c0-11.05 10.75-20 24-20s24 8.95 24 20-10.75 20-24 20c-2.6 0-5.13-.23-7.54-.68-2.13.97-7.46 3.18-11.46 3.68-1.13.14-2.01-.97-1.54-2.01 1.13-2.5 2.41-6.13 2.41-8.13C10.13 41.13 8 36.77 8 32z' fill='none' stroke='#FF8A5B' stroke-width='3'/><circle cx='24' cy='34' r='3' fill='#FF8A5B'/><circle cx='32' cy='34' r='3' fill='#FF8A5B'/><circle cx='40' cy='34' r='3' fill='#FF8A5B'/></svg></div>`;
                };
            }
        } else {
            // ESCRITORIO: chat tradicional
            chatArea.innerHTML = `
                <div id="chat-contenedor" style="width:100%;max-width:700px;margin:auto;display:flex;flex-direction:column;height:100%;min-height:0;">
                    <div style="display:flex;align-items:center;gap:18px;padding:32px 0 22px 0;border-bottom:1.5px solid #22253a;min-height:80px;">
                        <div style='width:52px;height:52px;border-radius:50%;background:#22253a;color:#ff8a5b;display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:700;'>${perfil.iniciales}</div>
                        <div style='flex:1;'>
                            <div style='color:#E6ECF3;font-weight:700;font-size:1.18rem;'>${perfil.nombre}</div>
                            <div style='color:#A0AEC0;font-size:1.01rem;'>${perfil.handle}</div>
                        </div>
                    </div>
                    <div id="mensajes-chat" style='flex:1;display:flex;flex-direction:column;gap:12px;overflow-y:auto;padding:32px 0 0 0;'>
                    </div>
                    <div style='padding:0 0 48px 0;display:flex;flex-direction:column;gap:8px;align-items:stretch;justify-content:flex-end;background:none;'>
                        <div id="form-mensaje-chat" style='display:flex;align-items:center;justify-content:flex-start;position:relative;background:#23253a;border-radius:12px;max-width:98%;margin:auto;'>
                            <button id='btn-adjuntar-imagen' title='Adjuntar imagen' style='background:#23253a;border:none;color:#ff8a5b;padding:11px 14px;border-radius:10px;cursor:pointer;font-size:1.25rem;display:flex;align-items:center;justify-content:center;margin-right:10px;'>📎</button>
                            <div id='preview-imagen-chat' style='display:none;align-items:center;justify-content:center;margin-left:0;margin-right:12px;'></div>
                            <input id='input-mensaje-chat' type='text' autocomplete='off' placeholder='Escribe un mensaje...' style='flex:1;max-width:370px;padding:13px 18px;border-radius:10px;border:none;background:#23253a;color:#E6ECF3;font-size:1.07rem;outline:none;'>
                            <input id='input-imagen-chat' type='file' accept='image/*' style='display:none;'>
                            <button id='btn-enviar-mensaje' style='background:#ff8a5b;border:none;color:#fff;padding:13px 28px;border-radius:10px;font-weight:700;cursor:pointer;font-size:1.07rem;margin-left:10px;'>Enviar</button>
                        </div>
                    </div>
                </div>
            `;
        }
        const mensajesDiv = chatArea.querySelector('#mensajes-chat');
        function renderizarMensajes() {
            mensajesDiv.innerHTML = '';
            if (mensajesPorPerfil[perfil.handle].length === 0) {
                mensajesDiv.innerHTML = `<span style='text-align:center;color:#A0AEC0;font-size:1.13rem;margin:auto;'>Aquí aparecerán los mensajes con <b>${perfil.nombre}</b>.<br><br><span style='font-size:2.7rem;'>💬</span></span>`;
            } else {
                mensajesPorPerfil[perfil.handle].forEach(m => {
                    if (m.imagen) {
                        mensajesDiv.innerHTML += `<div style='display:flex;justify-content:${m.remitente==='yo'?'flex-end':'flex-start'};'><div style='background:${m.remitente==='yo'?'#ff8a5b':'#23253a'};color:${m.remitente==='yo'?'#fff':'#E6ECF3'};padding:10px 16px;border-radius:12px;max-width:70%;font-size:1.05rem;box-shadow:0 2px 8px 0 #0002;'><img src='${m.imagen}' style='max-width:180px;max-height:180px;border-radius:8px;display:block;margin-bottom:6px;'>${m.texto ? `<div>${m.texto}</div>` : ''}</div></div>`;
                    } else {
                        mensajesDiv.innerHTML += `<div style='display:flex;justify-content:${m.remitente==='yo'?'flex-end':'flex-start'};'><div style='background:${m.remitente==='yo'?'#ff8a5b':'#23253a'};color:${m.remitente==='yo'?'#fff':'#E6ECF3'};padding:10px 16px;border-radius:12px;max-width:70%;font-size:1.05rem;box-shadow:0 2px 8px 0 #0002;'>${m.texto}</div></div>`;
                    }
                });
                mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
            }
        }
        renderizarMensajes();
        // Enviar mensaje y adjuntar imagen
        const formDiv = chatArea.querySelector('#form-mensaje-chat');
        const input = chatArea.querySelector('#input-mensaje-chat');
        const btnEnviar = chatArea.querySelector('#btn-enviar-mensaje');
        const btnAdjuntar = chatArea.querySelector('#btn-adjuntar-imagen');
        const inputImagen = chatArea.querySelector('#input-imagen-chat');
        const previewImagen = chatArea.querySelector('#preview-imagen-chat');
        let imagenSeleccionada = null;
        btnAdjuntar.addEventListener('click', function(e) {
            e.preventDefault();
            inputImagen.click();
        });
        inputImagen.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                imagenSeleccionada = url;
                previewImagen.innerHTML = `<div style='display:flex;align-items:center;gap:8px;'><img src='${url}' style='max-width:60px;max-height:60px;border-radius:8px;box-shadow:0 2px 8px #0003;'><button id='btn-cancelar-imagen' style='background:none;color:#ff8a5b;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:0.95rem;'>Quitar</button></div>`;
                previewImagen.style.display = 'flex';
                // Botón para quitar imagen
                previewImagen.querySelector('#btn-cancelar-imagen').onclick = function() {
                    imagenSeleccionada = null;
                    inputImagen.value = '';
                    previewImagen.innerHTML = '';
                    previewImagen.style.display = 'none';
                };
            } else {
                imagenSeleccionada = null;
                previewImagen.innerHTML = '';
                previewImagen.style.display = 'none';
            }
        });
        function enviarMensaje(e) {
            if (e) e.preventDefault();
            const texto = input.value.trim();
            if (texto || imagenSeleccionada) {
                mensajesPorPerfil[perfil.handle].push({ remitente: 'yo', texto, imagen: imagenSeleccionada });
                input.value = '';
                imagenSeleccionada = null;
                inputImagen.value = '';
                previewImagen.innerHTML = '';
                previewImagen.style.display = 'none';
                renderizarMensajes();
            }
        }
        btnEnviar.addEventListener('click', enviarMensaje);
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                enviarMensaje();
            }
        });
    }

    mainContainer.appendChild(sidebar);
    mainContainer.appendChild(chatArea);

    modalChats.appendChild(header);
    modalChats.appendChild(mainContainer);
    document.body.appendChild(modalChats);

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    // Animación de entrada
    setTimeout(() => {
        modalChats.style.opacity = '1';
    }, 10);

    // Cerrar ventana
    const btnCerrar = header.querySelector('.cerrar-chats');
    btnCerrar.addEventListener('click', cerrarVentanaChats);
    modalChats.addEventListener('click', function(e) {
        if (e.target === modalChats) cerrarVentanaChats();
    });
    // Botón salir para responsivo
    const btnSalir = header.querySelector('.salir-chats-portal');
    if (btnSalir) {
        btnSalir.addEventListener('click', function() {
            cerrarVentanaChats();
        });
    }
    function cerrarVentanaChats() {
        modalChats.style.opacity = '0';
        setTimeout(() => {
            if (modalChats.parentNode) document.body.removeChild(modalChats);
            document.body.style.overflow = '';
        }, 300);
    }
    // Cerrar con ESC
    function manejarEscape(e) {
        if (e.key === 'Escape') {
            cerrarVentanaChats();
            document.removeEventListener('keydown', manejarEscape);
        }
    }
    document.addEventListener('keydown', manejarEscape);
}

function crearPublicacion() {
    console.log('Función crearPublicacion llamada');
    
    const inputCompartir = document.querySelector('.input-Compartir');
    console.log('Input encontrado:', inputCompartir);
    
    if (!inputCompartir) {
        console.error('No se pudo encontrar el input .input-Compartir');
        alert('Error: No se encontró el campo de texto');
        return;
    }
    
    const contenido = inputCompartir.value.trim();
    console.log('Contenido del input:', contenido);
    console.log('Imágenes seleccionadas:', imagenesSeleccionadas);
    // Permitir publicar si hay texto o si hay archivos multimedia seleccionados
    let archivosSeleccionados = [];
    // Usar window.archivosSeleccionados si existen (para varias imágenes)
    if (window.archivosSeleccionados && window.archivosSeleccionados.length > 0) {
        archivosSeleccionados = window.archivosSeleccionados;
    } else {
        const inputMedia = document.querySelector('.input-media');
        if (inputMedia && inputMedia.files && inputMedia.files.length > 0) {
            archivosSeleccionados = Array.from(inputMedia.files);
        }
    }
    if (contenido === '' && archivosSeleccionados.length === 0 && imagenesSeleccionadas.length === 0) {
        // No hacer nada si no hay texto ni archivos
        return;
    }

    // Crear objeto de publicación con imágenes y/o videos
    let media = [];
    if (typeof archivosSeleccionados !== 'undefined' && archivosSeleccionados.length > 0) {
        media = archivosSeleccionados.map(file => {
            return {
                id: Date.now() + Math.random(),
                url: URL.createObjectURL(file),
                nombre: file.name,
                tipo: file.type.startsWith('video/') ? 'video' : 'imagen',
                file: file
            };
        });
    } else if (imagenesSeleccionadas.length > 0) {
        // Compatibilidad: si solo hay imágenes del sistema anterior
        media = imagenesSeleccionadas.map(img => ({
            id: img.id,
            url: img.url,
            nombre: img.nombre,
            tipo: 'imagen',
            file: img.archivo
        }));
    }

    const nuevaPublicacion = {
        id: contadorPublicaciones++,
        contenido: contenido,
        autor: 'Usuario Demo',
        handle: '@usuario_demo',
        fecha: new Date(),
        likes: 0,
        comentarios: 0,
        compartidas: 0,
        liked: false,
        media: media
    };

    publicaciones.unshift(nuevaPublicacion);
    renderizarPublicacion(nuevaPublicacion);
    inputCompartir.value = '';
    window.archivosSeleccionados = [];
    // Limpiar input de archivos y previsualización
    let inputMediaLocal = document.querySelector('.input-media');
    if (inputMediaLocal) inputMediaLocal.value = '';
    // Limpiar la previsualización correctamente
    let mediaPreviewLocal = document.querySelector('.media-preview');
    if (mediaPreviewLocal) mediaPreviewLocal.innerHTML = '';
    limpiarImagenes();
    toggleBotonPublicar();
}

// Funciones para manejo de imágenes
function crearInputImagen() {
    if (!inputImagen) {
        inputImagen = document.createElement('input');
        inputImagen.type = 'file';
        inputImagen.accept = 'image/*';
        inputImagen.multiple = true;
        inputImagen.style.display = 'none';
        
        inputImagen.addEventListener('change', function(e) {
            manejarSeleccionImagen(e.target.files);
        });
        
        document.body.appendChild(inputImagen);
    }
}

function abrirSelectorImagen() {
    if (inputImagen) {
        inputImagen.click();
    }
}

function manejarSeleccionImagen(archivos) {
    console.log('Archivos seleccionados:', archivos);
    
    // Validar número máximo de imágenes (10)
    if (imagenesSeleccionadas.length + archivos.length > 10) {
        alert('Máximo 10 imágenes por publicación');
        return;
    }
    
    Array.from(archivos).forEach(archivo => {
        // Validar que sea imagen
        if (!archivo.type.startsWith('image/')) {
            alert(`${archivo.name} no es una imagen válida`);
            return;
        }
        
        // Validar tamaño (máximo 5MB)
        if (archivo.size > 5 * 1024 * 1024) {
            alert(`${archivo.name} es muy grande. Máximo 5MB`);
            return;
        }
        
        // Crear objeto imagen
        const imagen = {
            id: Date.now() + Math.random(),
            archivo: archivo,
            url: URL.createObjectURL(archivo),
            nombre: archivo.name
        };
        
        imagenesSeleccionadas.push(imagen);
    });
    
    // Mostrar preview de imágenes
    mostrarPreviewImagenes();
}

function mostrarPreviewImagenes() {
    const cardPublicar = document.querySelector('.card-publicar');
    let contenedorImagenes = cardPublicar.querySelector('.imagenes-preview');
    
    // Crear contenedor si no existe
    if (!contenedorImagenes) {
        contenedorImagenes = document.createElement('div');
        contenedorImagenes.className = 'imagenes-preview';
        contenedorImagenes.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 8px;
            margin: 12px 0;
            max-height: 120px;
            overflow: hidden;
            width: 100%;
            box-sizing: border-box;
        `;
        
        const cardFooter = cardPublicar.querySelector('.card-footer');
        cardFooter.parentNode.insertBefore(contenedorImagenes, cardFooter);
    }
    
    // Limpiar contenedor
    contenedorImagenes.innerHTML = '';
    
    // Agregar imágenes
    imagenesSeleccionadas.forEach(imagen => {
        const imagenElement = document.createElement('div');
        imagenElement.className = 'imagen-preview';
        imagenElement.style.cssText = `
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            background: #1C2335;
            aspect-ratio: 1;
            width: 100%;
            height: 80px;
            min-width: 80px;
            max-width: 120px;
        `;
        
        imagenElement.innerHTML = `
            <img src="${imagen.url}" style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
                display: block;
            ">
            <button onclick="eliminarImagen('${imagen.id}')" style="
                position: absolute;
                top: 4px;
                right: 4px;
                background: rgba(0, 0, 0, 0.8);
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                line-height: 1;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='rgba(239, 68, 68, 0.9)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.8)'">×</button>
        `;
        
        contenedorImagenes.appendChild(imagenElement);
    });
    
    // Ocultar contenedor si no hay imágenes
    if (imagenesSeleccionadas.length === 0) {
        contenedorImagenes.style.display = 'none';
    } else {
        contenedorImagenes.style.display = 'grid';
    }
    
    // Actualizar estado del botón publicar
    toggleBotonPublicar();
}

function eliminarImagen(imagenId) {
    // Liberar la URL del objeto antes de eliminarlo
    const imagenAEliminar = imagenesSeleccionadas.find(img => img.id == imagenId);
    if (imagenAEliminar) {
        URL.revokeObjectURL(imagenAEliminar.url);
    }
    
    imagenesSeleccionadas = imagenesSeleccionadas.filter(img => img.id != imagenId);
    mostrarPreviewImagenes();
}

function limpiarImagenes() {
    // Liberar URLs de objetos
    imagenesSeleccionadas.forEach(imagen => {
        URL.revokeObjectURL(imagen.url);
    });
    
    imagenesSeleccionadas = [];
    mostrarPreviewImagenes();
}

function generarHTMLImagenes(imagenes) {
    if (!imagenes || imagenes.length === 0) {
        return '';
    }
    
    const numImagenes = imagenes.length;
    let claseGrid = '';
    
    switch (numImagenes) {
        case 1:
            claseGrid = 'single';
            break;
        case 2:
            claseGrid = 'grid-2';
            break;
        case 3:
            claseGrid = 'grid-3';
            break;
        case 4:
            claseGrid = 'grid-4';
            break;
    }
    
    const imagenesHTML = imagenes.map(imagen => 
        `<img src="${imagen.url}" alt="${imagen.nombre}" loading="lazy">`
    ).join('');
    
    return `
        <div class="Publicacion-img ${claseGrid}">
            ${imagenesHTML}
        </div>
    `;
}

function generarHTMLImagenesExistente(imagenes) {
    if (!imagenes || imagenes.length === 0) {
        return '';
    }
    if (imagenes.length === 1) {
        // Una sola imagen, sin carrusel
        const imagen = imagenes[0];
        return `
            <div class="Publicacion-img" style="position:relative;min-height:220px;overflow:hidden;display:flex;align-items:center;justify-content:center;border-radius:16px;background:#202020;">
                <img src="${imagen.url}" alt="${imagen.nombre}" style="display:block;width:100%;height:auto;border-radius:16px;max-height:420px;object-fit:cover;background:#;">
                <button class="expand-indicator" title="Ver imagen completa" style="position: absolute; top: 12px; right: 12px;">
                    <svg viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
                    </svg>
                </button>
            </div>
        `;
    }
    // Carrusel para varias imágenes
    return `
        <div class="carrusel-imagenes Publicacion-img" data-total="${imagenes.length}" style="position:relative;min-height:220px;overflow:hidden;border-radius:16px;background:#202020;">
            <button class="expand-indicator" title="Ver imagen completa" style="position: absolute; top: 14px; right: 14px;">
                <svg viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
                </svg>
            </button>
            <div class="carrusel-contenedor" style="position:relative;overflow:hidden;min-height:220px;display:flex;align-items:center;justify-content:center;">
                ${imagenes.map((imagen, idx) => `
                    <img src="${imagen.url}" alt="${imagen.nombre}" style="width:100%;height:auto;max-height:420px;border-radius:16px;object-fit:cover;background:#181c2a;display:${idx===0?'block':'none'};margin:auto;transition:opacity 0.3s;">
                `).join('')}
                <button class="carrusel-prev" style="position:absolute;top:50%;left:10px;transform:translateY(-50%);background:rgba(0,0,0,0.5);border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:#fff;cursor:pointer;z-index:2;">
                    <svg viewBox="0 0 24 24" width="20" height="20"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button class="carrusel-next" style="position:absolute;top:50%;right:10px;transform:translateY(-50%);background:rgba(0,0,0,0.5);border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:#fff;cursor:pointer;z-index:2;">
                    <svg viewBox="0 0 24 24" width="20" height="20"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>
            <div class="carrusel-indicadores" style="display:flex;justify-content:center;gap:6px;margin-top:8px;">
                ${imagenes.map((_, idx) => `
                    <span class="indicador${idx===0?' activo':''}" data-index="${idx}" style="width:10px;height:10px;border-radius:50%;background:${idx===0?'#FF6F3C':'#A0AECF'};display:inline-block;cursor:pointer;"></span>
                `).join('')}
            </div>
        </div>
    `;
}

// Hacer eliminarImagen global para poder llamarla desde HTML
window.eliminarImagen = eliminarImagen;

function expandirImagen(botonExpand) {
    // Encontrar la imagen visible actualmente en el contenedor padre
    const contenedorImagen = botonExpand.closest('.Publicacion-img');
    let imagen = null;
    // Si es carrusel, buscar la imagen visible
    if (contenedorImagen.classList.contains('carrusel-imagenes')) {
        imagen = contenedorImagen.querySelector('img[style*="display: block"]');
        // fallback si no hay display:block (por si acaso)
        if (!imagen) {
            const imagenes = contenedorImagen.querySelectorAll('img');
            imagen = Array.from(imagenes).find(img => img.offsetParent !== null) || imagenes[0];
        }
    } else {
        imagen = contenedorImagen.querySelector('img');
    }
    if (!imagen) return;

    // Crear modal para mostrar la imagen expandida
    const modal = document.createElement('div');
    modal.className = 'modal-imagen-expandida';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;
    `;

    // Crear imagen expandida
    const imagenExpandida = document.createElement('img');
    imagenExpandida.src = imagen.src;
    imagenExpandida.alt = imagen.alt;
    imagenExpandida.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        width: auto;
        height: auto;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        transform: scale(0.8);
        transition: transform 0.3s ease;
        cursor: default;
    `;
    
    // Crear botón de cerrar
    const botonCerrar = document.createElement('button');
    botonCerrar.innerHTML = '×';
    botonCerrar.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.7);
        border: none;
        color: white;
        font-size: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10000;
    `;
    
    // Agregar elementos al modal
    modal.appendChild(imagenExpandida);
    modal.appendChild(botonCerrar);
    document.body.appendChild(modal);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Animación de entrada
    setTimeout(() => {
        modal.style.opacity = '1';
        imagenExpandida.style.transform = 'scale(1)';
    }, 10);
    
    // Función para cerrar modal
    function cerrarModal() {
        modal.style.opacity = '0';
        imagenExpandida.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Event listeners para cerrar
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });
    
    botonCerrar.addEventListener('click', cerrarModal);
    
    // Cerrar con ESC
    function manejarEscape(e) {
        if (e.key === 'Escape') {
            cerrarModal();
            document.removeEventListener('keydown', manejarEscape);
        }
    }
    document.addEventListener('keydown', manejarEscape);
    
    // Hover effects para el botón cerrar
    botonCerrar.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(239, 68, 68, 0.8)';
        this.style.transform = 'scale(1.1)';
    });
    
    botonCerrar.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(0, 0, 0, 0.7)';
        this.style.transform = 'scale(1)';
    });
    
    // Prevenir que el click en la imagen cierre el modal
    imagenExpandida.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function navegarCarrusel(boton, direccion) {
    const carrusel = boton.closest('.carrusel-imagenes');
    const imagenes = carrusel.querySelectorAll('img');
    const indicadores = carrusel.querySelectorAll('.indicador');
    const total = parseInt(carrusel.dataset.total);
    
    // Encontrar imagen activa actual
    let indiceActual = 0;
    imagenes.forEach((img, index) => {
        if (img.style.display === 'block') {
            indiceActual = index;
        }
    });
    
    // Calcular nuevo índice
    let nuevoIndice;
    if (direccion === 'next') {
        nuevoIndice = (indiceActual + 1) % total;
    } else {
        nuevoIndice = (indiceActual - 1 + total) % total;
    }
    
    // Actualizar imágenes
    cambiarImagenCarrusel(carrusel, indiceActual, nuevoIndice);
}

function irAImagen(indicador) {
    const carrusel = indicador.closest('.carrusel-imagenes');
    const nuevoIndice = parseInt(indicador.dataset.index);
    const imagenes = carrusel.querySelectorAll('img');
    
    // Encontrar imagen activa actual
    let indiceActual = 0;
    imagenes.forEach((img, index) => {
        if (img.style.display === 'block') {
            indiceActual = index;
        }
    });
    
    if (indiceActual !== nuevoIndice) {
        cambiarImagenCarrusel(carrusel, indiceActual, nuevoIndice);
    }
}

function cambiarImagenCarrusel(carrusel, indiceActual, nuevoIndice) {
    const imagenes = carrusel.querySelectorAll('img');
    const indicadores = carrusel.querySelectorAll('.indicador');

    // Ocultar imagen actual
    imagenes[indiceActual].style.display = 'none';
    indicadores[indiceActual].classList.remove('activo');
    indicadores[indiceActual].style.background = '#A0AECF';

    // Mostrar nueva imagen con animación
    const imagenNueva = imagenes[nuevoIndice];
    imagenNueva.style.opacity = '0';
    imagenNueva.style.display = 'block';
    indicadores[nuevoIndice].classList.add('activo');
    indicadores[nuevoIndice].style.background = '#FF6F3C';

    // Animación de entrada
    setTimeout(() => {
        imagenNueva.style.transition = 'opacity 0.3s ease';
        imagenNueva.style.opacity = '1';
    }, 10);

    // Limpiar transición después
    setTimeout(() => {
        imagenNueva.style.transition = '';
    }, 320);
}

function renderizarPublicacion(publicacion) {
    console.log('Renderizando publicación:', publicacion);
    
    const contenedorPublicaciones = document.querySelector('.cards');
    const cardPublicar = document.querySelector('.card-publicar');
    
    console.log('Contenedor encontrado:', contenedorPublicaciones);
    console.log('Card publicar encontrada:', cardPublicar);
    
    if (!cardPublicar) {
        console.error('No se encontró .card-publicar');
        alert('Error: No se encontró la card de publicar');
        return;
    }
    
    // Crear el HTML de la nueva publicación usando la misma estructura existente
    let mediaHTML = '';
    if (publicacion.media && publicacion.media.length > 0) {
        const imagenes = publicacion.media.filter(m => m.tipo === 'imagen');
        const videos = publicacion.media.filter(m => m.tipo === 'video');
        if (imagenes.length > 0) {
            // Adaptar formato para generarHTMLImagenesExistente
            const imagenesAdaptadas = imagenes.map(img => ({ url: img.url, nombre: img.nombre }));
            mediaHTML += generarHTMLImagenesExistente(imagenesAdaptadas);
        }
        if (videos.length > 0) {
            videos.forEach(m => {
                mediaHTML += `<div style="margin-bottom:12px;"><video src="${m.url}" controls playsinline style="width:100%;height:auto;max-height:420px;border-radius:16px;object-fit:contain;background:#202020;display:block;pointer-events:auto;z-index:2;" ontouchstart="event.stopPropagation();event.stopImmediatePropagation();" onclick="event.stopPropagation();event.stopImmediatePropagation();"></video></div>`;
            });
        }
    } else if (publicacion.imagenes && publicacion.imagenes.length > 0) {
        // Compatibilidad con publicaciones antiguas solo de imágenes
        mediaHTML = generarHTMLImagenesExistente(publicacion.imagenes);
    }


    let claseExtra = '';
    let htmlAncla = '';
    if (
        publicacion.id === 1 || publicacion.id === 'calendario2025' || (publicacion.imagenes && publicacion.imagenes.some(img => img.id === 'calendario2025'))
    ) {
        claseExtra = ' card-calendario';
        htmlAncla = `<div class="ancla-calendario" title="Publicación fijada" style="position:absolute;top:12px;right:18px;z-index:2;display:flex;align-items:center;gap:4px;background:#transparent;padding:3px 10px 3px 8px;border-radius:8px;"><img src="Imagenes/publicaciones/fijado.png" alt="Fijado" style="width:18px;height:18px;object-fit:contain;vertical-align:middle;"> <span style="color:#fff;font-weight:bold;">Fijado</span></div>`;
    }

    const htmlPublicacion = `
        <div class="card${claseExtra}" data-id="${publicacion.id}" style="position:relative;">
            ${htmlAncla}
            <div class="card-content">
                <p class="person">UD</p>
                <div class="usuario-info">
                    <span class="nombre-usuario">${publicacion.autor}</span>
                    <span class="fecha-publicacion">${formatearFecha(publicacion.fecha)}</span>
                </div>
            </div>
            <p class="texto-publicacion" style="word-break: break-all; overflow-wrap: break-word; white-space: pre-line;">${publicacion.contenido}</p>
            ${mediaHTML}
            <div class="card-footer">
                <button class="like-button" data-id="${publicacion.id}">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.598 1.127-4.312 2.733-.714-1.606-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.125 9 12 9 12s9-4.875 9-12z"/>
                    </svg>
                    <span>${publicacion.likes}</span>
                </button>
                <button class="comment-button" data-id="${publicacion.id}">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 12c0-4.556 3.86-8.25 8.625-8.25s8.625 3.694 8.625 8.25-3.86 8.25-8.625 8.25a9.735 9.735 0 01-4.063-.873L3 20.25l.813-3.252A8.964 8.964 0 012.25 12z"/>
                    </svg>
                    <span>${publicacion.comentarios}</span>
                </button>
                <button class="share-button" data-id="${publicacion.id}">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                        <circle cx="18" cy="5" r="3" stroke-width="2"/>
                        <circle cx="6" cy="12" r="3" stroke-width="2"/>
                        <circle cx="18" cy="19" r="3" stroke-width="2"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke-width="2"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke-width="2"/>
                    </svg>
                    <span>${publicacion.compartidas}</span>
                </button>
            </div>
            <div class="comentarios-preview" data-publicacion-id="${publicacion.id}">
                <!-- Los comentarios se mostrarán aquí -->
            </div>
        </div>
    `;

    // Si es la publicación del calendario, eliminar cualquier otra y fijar después de card-publicar
    if (claseExtra) {
        const contenedor = document.querySelector('.cards');
        const cardCalendarioExistente = contenedor.querySelector('.card.card-calendario');
        if (cardCalendarioExistente) cardCalendarioExistente.remove();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlPublicacion;
        contenedor.insertBefore(tempDiv.firstElementChild, cardPublicar.nextSibling);
        return;
    }
    // Si no es la del calendario, insertar después de la card-calendario si existe, si no después de card-publicar
    const contenedor = document.querySelector('.cards');
    const cardCalendario = contenedor.querySelector('.card.card-calendario');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlPublicacion;
    if (cardCalendario) {
        contenedor.insertBefore(tempDiv.firstElementChild, cardCalendario.nextSibling);
    } else {
        contenedor.insertBefore(tempDiv.firstElementChild, cardPublicar.nextSibling);
    }
    console.log('Publicación insertada en el DOM');

    // Agregar animación de entrada
    const nuevaCard = cardPublicar.nextElementSibling;
    console.log('Nueva card:', nuevaCard);

    if (nuevaCard) {
        nuevaCard.style.opacity = '0';
        nuevaCard.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            nuevaCard.style.transition = 'all 0.3s ease';
            nuevaCard.style.opacity = '1';
            nuevaCard.style.transform = 'translateY(0)';
        }, 100);
    }
}

function toggleBotonPublicar() {
    const inputCompartir = document.querySelector('.input-Compartir');
    const btnPublicar = document.querySelector('.publicar-button');
    
    if (inputCompartir && btnPublicar) {
        // Permitir publicar si hay texto o si hay archivos seleccionados (imagen/video)
        let archivosSeleccionados = [];
        const inputMedia = document.querySelector('.input-media');
        if (inputMedia && inputMedia.files && inputMedia.files.length > 0) {
            archivosSeleccionados = Array.from(inputMedia.files);
        }
        const tieneTexto = inputCompartir.value.trim() !== '';
        const tieneArchivos = archivosSeleccionados.length > 0;
        if (tieneTexto || tieneArchivos) {
            btnPublicar.style.opacity = '1';
            btnPublicar.style.pointerEvents = 'auto';
            btnPublicar.disabled = false;
        } else {
            btnPublicar.style.opacity = '0.5';
            btnPublicar.style.pointerEvents = 'none';
            btnPublicar.disabled = true;
        }
    }
}

function toggleLike(boton) {
    let publicacionId = boton.dataset.id;
    // Si es un número, convertirlo
    if (!isNaN(publicacionId) && publicacionId !== 'fija') publicacionId = parseInt(publicacionId);
    const publicacion = publicaciones.find(p => p.id === publicacionId);
    
    if (publicacion) {
        publicacion.liked = !publicacion.liked;
        
        if (publicacion.liked) {
            publicacion.likes++;
            boton.style.color = '#ef4444';
            boton.querySelector('svg').style.fill = '#ef4444';
        } else {
            publicacion.likes--;
            boton.style.color = '#A0AEC0';
            boton.querySelector('svg').style.fill = 'none';
        }
        
        // Actualizar el contador
        const contador = boton.querySelector('span');
        contador.textContent = publicacion.likes;
        
        // Animación del botón
        boton.style.transform = 'scale(1.2)';
        setTimeout(() => {
            boton.style.transform = 'scale(1)';
        }, 150);
    }
}

function mostrarComentarios(boton) {
    let publicacionId = boton.dataset.id;
    if (!isNaN(publicacionId) && publicacionId !== 'fija') publicacionId = parseInt(publicacionId);
    const publicacion = publicaciones.find(p => p.id === publicacionId);
    
    if (!publicacion) {
        console.error('Publicación no encontrada');
        return;
    }
    
    // Inicializar comentarios si no existen
    if (!publicacion.comentariosLista) {
        publicacion.comentariosLista = [];
    }
    
    // Crear modal de comentarios
    const modalComentarios = document.createElement('div');
    modalComentarios.className = 'modal-comentarios';
    modalComentarios.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Crear contenedor del modal
    const contenedorModal = document.createElement('div');
    contenedorModal.style.cssText = `
        background: #202020;
        border: 1px solid #1c1e35;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        transform: scale(0.9);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;
    
    // Header del modal
    const headerModal = document.createElement('div');
    headerModal.style.cssText = `
        padding: 16px 20px;
        border-bottom: 1px solid #1c1e35;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const tituloModal = document.createElement('h3');
    tituloModal.textContent = 'Comentarios';
    tituloModal.style.cssText = `
        margin: 0;
        color: #E6ECF3;
        font-size: 1.2rem;
        font-weight: 600;
    `;
    
    const botonCerrar = document.createElement('button');
    botonCerrar.innerHTML = '×';
    botonCerrar.style.cssText = `
        background: none;
        border: none;
        color: #A0AEC0;
        font-size: 24px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.3s ease;
    `;
    
    headerModal.appendChild(tituloModal);
    headerModal.appendChild(botonCerrar);
    
    // Contenedor de comentarios
    const contenedorComentarios = document.createElement('div');
    contenedorComentarios.style.cssText = `
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 16px 20px;
        min-height: 200px;
        max-height: 400px;
        word-break: break-all;
        overflow-wrap: break-word;
    `;
    
    // Footer con input para nuevo comentario
    const footerModal = document.createElement('div');
    footerModal.style.cssText = `
        padding: 16px 20px;
        border-top: 1px solid #1c1e35;
        display: flex;
        gap: 12px;
        align-items: flex-end;
    `;
    
    const inputComentario = document.createElement('textarea');
    inputComentario.placeholder = 'Escribe un comentario...';
    inputComentario.style.cssText = `
        flex: 1;
        background: #141B2D;
        border: 1px solid #39445f;
        border-radius: 8px;
        color: #E6ECF3;
        padding: 12px;
        font-family: Arial, sans-serif;
        font-size: 0.9rem;
        resize: none;
        min-height: 40px;
        max-height: 120px;
        outline: none;
        transition: border-color 0.3s ease;
    `;
    
    const botonEnviar = document.createElement('button');
    botonEnviar.textContent = 'Enviar';
    botonEnviar.style.cssText = `
        background: linear-gradient(135deg, #FF6F3C 0%, #FF8A5B 100%);
        border: none;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        opacity: 0.5;
        pointer-events: none;
    `;
    
    footerModal.appendChild(inputComentario);
    footerModal.appendChild(botonEnviar);
    
    // Ensamblar modal
    contenedorModal.appendChild(headerModal);
    contenedorModal.appendChild(contenedorComentarios);
    contenedorModal.appendChild(footerModal);
    modalComentarios.appendChild(contenedorModal);
    document.body.appendChild(modalComentarios);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Función para forzar quiebre de palabras largas
    // Forzar quiebre de palabras largas usando <wbr>
    function breakLongWords(text, maxLen = 30) {
        return text.replace(new RegExp(`(\S{${maxLen},})`, 'g'), function(longWord) {
            return longWord.replace(new RegExp(`(.{1,${maxLen}})`, 'g'), '$1<wbr>');
        });
    }

    // Función para renderizar comentarios
    function renderizarComentarios() {
        contenedorComentarios.innerHTML = '';
        
        if (publicacion.comentariosLista.length === 0) {
            const mensajeVacio = document.createElement('div');
            mensajeVacio.style.cssText = `
                text-align: center;
                color: #A0AEC0;
                font-style: italic;
                padding: 40px 20px;
            `;
            mensajeVacio.textContent = 'Sé el primero en comentar';
            contenedorComentarios.appendChild(mensajeVacio);
            return;
        }
        
        publicacion.comentariosLista.forEach(comentario => {
            const comentarioElement = document.createElement('div');
            comentarioElement.style.cssText = `
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid #1c1e35;
            `;
            // Aplicar quiebre solo al texto del comentario
            const textoAjustado = breakLongWords(comentario.texto);
            comentarioElement.innerHTML = `
                <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #FF6F3C;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.8rem;
                    flex-shrink: 0;
                ">UD</div>
                <div style="flex: 1;">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 4px;
                    ">
                        <span style="
                            color: #E6ECF3;
                            font-weight: 600;
                            font-size: 0.9rem;
                        ">Usuario Demo</span>
                        <span style="
                            color: #A0AEC0;
                            font-size: 0.8rem;
                        ">${formatearFecha(comentario.fecha)}</span>
                    </div>
                    <p style="
                        margin: 0;
                        color: #E6ECF3;
                        line-height: 1.4;
                        font-size: 0.9rem;
                        white-space: pre-wrap;
                    ">${textoAjustado}</p>
                </div>
            `;
            
            contenedorComentarios.appendChild(comentarioElement);
        });
        
        // Scroll al final
        contenedorComentarios.scrollTop = contenedorComentarios.scrollHeight;
    }
    
    // Función para agregar comentario
    function agregarComentario() {
        const textoComentario = inputComentario.value.trim();
        if (textoComentario === '') return;
        
        const nuevoComentario = {
            id: Date.now(),
            texto: textoComentario,
            autor: 'Usuario Demo',
            fecha: new Date()
        };
        
        publicacion.comentariosLista.push(nuevoComentario);
        publicacion.comentarios = publicacion.comentariosLista.length;
        
        // Actualizar contador en la UI
        const contadorComentarios = document.querySelector(`[data-id="${publicacionId}"] .comment-button span`);
        if (contadorComentarios) {
            contadorComentarios.textContent = publicacion.comentarios;
        }
        
        // Actualizar vista previa de comentarios en la publicación
        actualizarComentariosPreview(publicacionId);
        
        // Limpiar input
        inputComentario.value = '';
        
        // Re-renderizar comentarios
        renderizarComentarios();
        
        // Actualizar estado del botón
        actualizarBotonEnviar();
    }
    
    // Función para actualizar estado del botón enviar
    function actualizarBotonEnviar() {
        const tieneTexto = inputComentario.value.trim() !== '';
        if (tieneTexto) {
            botonEnviar.style.opacity = '1';
            botonEnviar.style.pointerEvents = 'auto';
        } else {
            botonEnviar.style.opacity = '0.5';
            botonEnviar.style.pointerEvents = 'none';
        }
    }
    
    // Función para cerrar modal
    function cerrarModal() {
        modalComentarios.style.opacity = '0';
        contenedorModal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (modalComentarios.parentNode) {
                document.body.removeChild(modalComentarios);
            }
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Event listeners
    botonCerrar.addEventListener('click', cerrarModal);
    
    modalComentarios.addEventListener('click', function(e) {
        if (e.target === modalComentarios) {
            cerrarModal();
        }
    });
    
    botonEnviar.addEventListener('click', agregarComentario);
    
    inputComentario.addEventListener('input', actualizarBotonEnviar);
    
    inputComentario.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (inputComentario.value.trim() !== '') {
                agregarComentario();
            }
        }
    });
    
    // Hover effects
    botonCerrar.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(239, 68, 68, 0.1)';
        this.style.color = '#ef4444';
    });
    
    botonCerrar.addEventListener('mouseleave', function() {
        this.style.background = 'none';
        this.style.color = '#A0AEC0';
    });
    
    inputComentario.addEventListener('focus', function() {
        this.style.borderColor = '#FF6F3C';
        this.style.boxShadow = '0 0 0 2px rgba(255, 111, 60, 0.2)';
    });
    
    inputComentario.addEventListener('blur', function() {
        this.style.borderColor = '#39445f';
        this.style.boxShadow = 'none';
    });
    
    // Cerrar con ESC
    function manejarEscape(e) {
        if (e.key === 'Escape') {
            cerrarModal();
            document.removeEventListener('keydown', manejarEscape);
        }
    }
    document.addEventListener('keydown', manejarEscape);
    
    // Animación de entrada
    setTimeout(() => {
        modalComentarios.style.opacity = '1';
        contenedorModal.style.transform = 'scale(1)';
    }, 10);
    
    // Renderizar comentarios existentes
    renderizarComentarios();
    
    // Focus en el input
    setTimeout(() => {
        inputComentario.focus();
    }, 300);
}

function compartirPublicacion(boton) {
    const publicacionId = parseInt(boton.dataset.id);
    const publicacion = publicaciones.find(p => p.id === publicacionId);
    
    if (publicacion) {
        publicacion.compartidas++;
        
        // Actualizar el contador
        const contador = boton.querySelector('span');
        contador.textContent = publicacion.compartidas;
        
        // Animación del botón
        boton.style.transform = 'scale(1.2)';
        setTimeout(() => {
            boton.style.transform = 'scale(1)';
        }, 150);
    }
}

function formatearFecha(fecha) {
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (minutos < 1) {
        return 'ahora';
    } else if (minutos < 60) {
        return `${minutos}m`;
    } else if (horas < 24) {
        return `${horas}h`;
    } else {
        return `${dias}d`;
    }
}

// Función para inicializar contador de caracteres
function inicializarContadorCaracteres() {
    const textarea = document.querySelector('.input-Compartir');
    if (textarea) {
        // Crear elemento del contador si no existe
        let contador = document.querySelector('.character-counter');
        if (!contador) {
            contador = document.createElement('div');
            contador.className = 'character-counter';
            contador.innerHTML = `<span class="count">0</span>/${MAX_CARACTERES}`;
            
            // Insertarlo después del input
            textarea.parentNode.insertBefore(contador, textarea.nextSibling);
        }
        
        // Agregar evento de input
        textarea.addEventListener('input', function() {
            const caracteresUsados = this.value.length;
            const spanCount = contador.querySelector('.count');
            spanCount.textContent = caracteresUsados;
            
            // Cambiar color cuando se acerque al límite
            if (caracteresUsados > MAX_CARACTERES * 0.9) {
                contador.style.color = '#FF6F3C';
            } else {
                contador.style.color = '#666';
            }
            
            // Deshabilitar envío si excede el límite
            const botonPublicar = document.querySelector('.publicar-button');
            if (caracteresUsados > MAX_CARACTERES) {
                botonPublicar.disabled = true;
                botonPublicar.style.opacity = '0.5';
                contador.style.color = '#ff4444';
            } else {
                botonPublicar.disabled = false;
                botonPublicar.style.opacity = '1';
            }
        });
    }
}

function actualizarComentariosPreview(publicacionId) {
    const publicacion = publicaciones.find(p => p.id === publicacionId);
    if (!publicacion || !publicacion.comentariosLista) return;
    
    const contenedorPreview = document.querySelector(`[data-publicacion-id="${publicacionId}"]`);
    if (!contenedorPreview) return;
    
    const comentariosParaMostrar = publicacion.comentariosLista.slice(0, 3);
    
    if (comentariosParaMostrar.length === 0) {
        contenedorPreview.style.display = 'none';
        return;
    }
    
    contenedorPreview.style.display = 'block';
    contenedorPreview.style.cssText = `
        display: block;
        padding: 12px 16px 0 16px;
        border-top: 1px solid #1c1e35;
        margin-top: 8px;
    `;
    
    let htmlComentarios = '';
    
    // Función para forzar quiebre de palabras largas
    // Forzar quiebre de palabras largas usando <wbr>
    function breakLongWords(text, maxLen = 30) {
        return text.replace(new RegExp(`(\S{${maxLen},})`, 'g'), function(longWord) {
            return longWord.replace(new RegExp(`(.{1,${maxLen}})`, 'g'), '$1<wbr>');
        });
    }

    comentariosParaMostrar.forEach((comentario, index) => {
        const textoAjustado = breakLongWords(comentario.texto);
        htmlComentarios += `
            <div style="
                display: flex;
                gap: 10px;
                margin-bottom: ${index === comentariosParaMostrar.length - 1 ? '8px' : '12px'};
                align-items: flex-start;
            ">
                <div style="
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #FF6F3C;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.7rem;
                    flex-shrink: 0;
                    margin-top: 2px;
                ">UD</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        margin-bottom: 2px;
                        flex-wrap: wrap;
                    ">
                        <span style="
                            color: #E6ECF3;
                            font-weight: 600;
                            font-size: 0.85rem;
                        ">Usuario Demo</span>
                        <span style="
                            color: #A0AEC0;
                            font-size: 0.75rem;
                        ">${formatearFecha(comentario.fecha)}</span>
                    </div>
                    <p style="
                        margin: 0;
                        color: #E6ECF3;
                        line-height: 1.3;
                        font-size: 0.85rem;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    ">${textoAjustado}</p>
                </div>
            </div>
        `;
    });
    
    // Si hay más de 3 comentarios, mostrar botón para ver todos
    if (publicacion.comentariosLista.length > 3) {
        htmlComentarios += `
            <div style="
                text-align: center;
                margin-top: 8px;
                padding-bottom: 8px;
            ">
                <button data-publicacion-id="${publicacionId}" class="ver-comentarios-btn" style="
                    background: none;
                    border: none;
                    color: #A0AEC0;
                    cursor: pointer;
                    font-size: 0.8rem;
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.color='#FF8A5B'; this.style.background='rgba(255, 111, 60, 0.1)'" onmouseout="this.style.color='#A0AECF'; this.style.background='none'">
                    Ver los ${publicacion.comentariosLista.length} comentarios
                </button>
            </div>
        `;
    }
    
    contenedorPreview.innerHTML = htmlComentarios;
}

// Inicializar la opacidad del botón publicar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    toggleBotonPublicar();
});

