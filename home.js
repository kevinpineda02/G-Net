// Variables globales para el carrusel
let slideActual = 0;
let totalSlides = 0;

// Inicializar carrusel cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes básicos
    inicializarCarrusel();
    inicializarAnimacionesEntrada();
    
    // Configurar el selector de imágenes con mejor manejo de eventos
    const selectorImagenes = document.getElementById('selector-imagenes');
    if (selectorImagenes) {
        // Agregar el listener para cambios
        selectorImagenes.addEventListener('change', manejarSeleccionImagenes);
        
        // Debug: verificar propiedades del input
        console.log('Input file configurado:', {
            multiple: selectorImagenes.multiple,
            accept: selectorImagenes.accept,
            type: selectorImagenes.type
        });
    }
    
    // Evitar que el modal se cierre al hacer click en la imagen
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
    
    // Cargar preferencia de modo guardada
    cargarModoGuardado();
    
    // Inicializar contadores de comentarios para publicaciones existentes
    inicializarContadoresComentarios();
});

// Función para inicializar animaciones de entrada desde arriba
function inicializarAnimacionesEntrada() {
    // Agregar clase para elementos que necesitan animación (sin imágenes)
    const elementosAnimar = document.querySelectorAll('.publicacion, .accion-btn, .avatar, .separador');
    
    elementosAnimar.forEach((elemento, index) => {
        // Agregar estilo inicial (oculto y desplazado hacia arriba)
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(-30px)';
        elemento.style.transition = 'all 0.4s ease-out';
        
        // Animar con delay escalonado más rápido
        setTimeout(() => {
            elemento.style.opacity = '1';
            elemento.style.transform = 'translateY(0)';
        }, 100 * (index + 1) + 800); // Comenzar antes y con delays más cortos
    });
    
    // Animar botones de iconos con efecto especial más rápido
    const iconos = document.querySelectorAll('.icono-btn');
    iconos.forEach((icono, index) => {
        icono.style.opacity = '0';
        icono.style.transform = 'translateY(-20px) scale(0.8)';
        icono.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            icono.style.opacity = '1';
            icono.style.transform = 'translateY(0) scale(1)';
        }, 50 * index + 1000);
    });
}

// Función para animar nuevos elementos dinámicos
function animarElementoDesdeArriba(elemento, delay = 0) {
    elemento.style.opacity = '0';
    elemento.style.transform = 'translateY(-30px)';
    elemento.style.transition = 'all 0.4s ease-out';
    
    setTimeout(() => {
        elemento.style.opacity = '1';
        elemento.style.transform = 'translateY(0)';
    }, delay);
}

// Función para inicializar el carrusel
function inicializarCarrusel() {
    const slides = document.querySelectorAll('.imagen-slide');
    totalSlides = slides.length;
    
    if (totalSlides > 0) {
        document.getElementById('total-imagenes').textContent = totalSlides;
        actualizarSlide();
    }
}

// Función para cambiar de slide
function cambiarSlide(direccion) {
    const slides = document.querySelectorAll('.imagen-slide');
    const indicadores = document.querySelectorAll('.indicador');
    
    // Remover clase active del slide actual
    slides[slideActual].classList.remove('active');
    indicadores[slideActual].classList.remove('active');
    
    // Calcular nuevo slide
    slideActual += direccion;
    
    // Ciclo infinito
    if (slideActual >= totalSlides) {
        slideActual = 0;
    } else if (slideActual < 0) {
        slideActual = totalSlides - 1;
    }
    
    // Activar nuevo slide
    slides[slideActual].classList.add('active');
    indicadores[slideActual].classList.add('active');
    
    // Actualizar contador
    document.getElementById('imagen-actual').textContent = slideActual + 1;
}

// Función para ir a un slide específico
function irSlide(index) {
    const slides = document.querySelectorAll('.imagen-slide');
    const indicadores = document.querySelectorAll('.indicador');
    
    // Remover clase active del slide actual
    slides[slideActual].classList.remove('active');
    indicadores[slideActual].classList.remove('active');
    
    // Cambiar al slide seleccionado
    slideActual = index;
    
    // Activar nuevo slide
    slides[slideActual].classList.add('active');
    indicadores[slideActual].classList.add('active');
    
    // Actualizar contador
    document.getElementById('imagen-actual').textContent = slideActual + 1;
}

// Función para actualizar el slide inicial
function actualizarSlide() {
    document.getElementById('imagen-actual').textContent = slideActual + 1;
}

// Navegación con teclado para el carrusel
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        cambiarSlide(-1);
    } else if (event.key === 'ArrowRight') {
        cambiarSlide(1);
    } else if (event.key === 'Escape') {
        cerrarModal();
    }
});

// Función para expandir imagen
function expandirImagen(src, alt) {
    const modal = document.getElementById('modal-imagen');
    const imagenExpandida = document.getElementById('imagen-expandida');
    
    // Configurar la imagen en el modal
    imagenExpandida.src = src;
    imagenExpandida.alt = alt;
    
    // Mostrar el modal
    modal.classList.add('active');
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

// Función para cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modal-imagen');
    
    // Ocultar el modal
    modal.classList.remove('active');
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
}

// Función para cambiar entre modo claro y oscuro
function cambiarModo() {
    const root = document.documentElement;
    const isModoClaro = root.classList.contains('modo-claro');
    
    if (isModoClaro) {
        // Cambiar a modo oscuro
        root.classList.remove('modo-claro');
        localStorage.setItem('tema', 'oscuro');
        actualizarIconoModo(false);
    } else {
        // Cambiar a modo claro
        root.classList.add('modo-claro');
        localStorage.setItem('tema', 'claro');
        actualizarIconoModo(true);
    }
}

// Función para actualizar el icono según el modo
function actualizarIconoModo(esModoClaro) {
    const iconoModo = document.getElementById('icono-modo');
    
    if (esModoClaro) {
        // Icono de sol para modo claro
        iconoModo.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />`;
    } else {
        // Icono de luna para modo oscuro
        iconoModo.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />`;
    }
}

// Función para cargar el modo guardado en localStorage
function cargarModoGuardado() {
    const temaGuardado = localStorage.getItem('tema');
    const root = document.documentElement;
    
    if (temaGuardado === 'claro') {
        root.classList.add('modo-claro');
        actualizarIconoModo(true);
    } else {
        root.classList.remove('modo-claro');
        actualizarIconoModo(false);
    }
}

// Función para seleccionar ventana en el sidebar
function seleccionarVentana(botonSeleccionado) {
    // Remover clase active de todos los botones del sidebar
    const botonesSidebar = document.querySelectorAll('.secciones button');
    botonesSidebar.forEach(boton => {
        boton.classList.remove('active');
        // Pequeña animación de salida
        boton.style.transform = 'translateY(-5px)';
        setTimeout(() => {
            boton.style.transform = 'translateY(0)';
        }, 150);
    });
    
    // Agregar clase active al botón seleccionado con animación especial
    botonSeleccionado.classList.add('active');
    botonSeleccionado.style.transform = 'translateY(-10px) scale(1.05)';
    setTimeout(() => {
        botonSeleccionado.style.transform = 'translateY(0) scale(1)';
    }, 300);
}

// Botones para cambiar de seccion

// Variables para manejo de imágenes
let imagenesSeleccionadas = [];

// Función para abrir el selector de archivos multimedia (imágenes y videos)
function abrirSelectorImagenes() {
    const selectorImagenes = document.getElementById('selector-imagenes');
    
    // Verificar si ya se alcanzó el límite
    if (imagenesSeleccionadas.length >= 5) {
        alert('Ya tienes el máximo de 5 archivos seleccionados. Elimina algunos para agregar nuevos.');
        return;
    }
    
    // Configurar para imágenes y videos
    selectorImagenes.accept = "image/*,image/jpeg,image/png,image/gif,image/webp,video/*,video/mp4,video/webm,video/ogg";
    
    // Limpiar el valor del input para permitir seleccionar los mismos archivos
    selectorImagenes.value = '';
    // Activar el selector
    selectorImagenes.click();
}

// Función para abrir el selector solo de videos
function abrirSelectorVideos() {
    const selectorImagenes = document.getElementById('selector-imagenes');
    
    // Verificar si ya se alcanzó el límite
    if (imagenesSeleccionadas.length >= 5) {
        alert('Ya tienes el máximo de 5 archivos seleccionados. Elimina algunos para agregar nuevos.');
        return;
    }
    
    // Configurar solo para videos
    selectorImagenes.accept = "video/*,video/mp4,video/webm,video/ogg";
    
    // Limpiar el valor del input para permitir seleccionar los mismos archivos
    selectorImagenes.value = '';
    // Activar el selector
    selectorImagenes.click();
}

// Función para manejar la selección de imágenes
function manejarSeleccionImagenes(event) {
    const archivos = Array.from(event.target.files);
    const previewContainer = document.getElementById('preview-imagenes');
    const listaPreview = document.getElementById('lista-preview-imagenes');
    
    console.log(`Archivos seleccionados: ${archivos.length}`); // Debug
    console.log(`Imágenes ya seleccionadas: ${imagenesSeleccionadas.length}`); // Debug
    
    // Verificar que hay archivos seleccionados
    if (archivos.length === 0) {
        return;
    }
    
    // Calcular cuántas imágenes se pueden agregar
    const espacioDisponible = 5 - imagenesSeleccionadas.length;
    
    if (espacioDisponible <= 0) {
        alert('Ya tienes el máximo de 5 archivos seleccionados. Elimina algunos para agregar nuevos.');
        event.target.value = ''; // Limpiar selección
        return;
    }
    
    // Verificar si la nueva selección excede el límite
    if (archivos.length > espacioDisponible) {
        alert(`Solo puedes agregar ${espacioDisponible} imagen${espacioDisponible !== 1 ? 'es' : ''} más. Tienes ${imagenesSeleccionadas.length} de 5 imágenes seleccionadas.`);
        event.target.value = ''; // Limpiar selección
        return;
    }
    
    // Mostrar contenedor de preview si no está visible
    if (imagenesSeleccionadas.length === 0) {
        previewContainer.style.display = 'block';
    }
    
    let imagenesProcessadas = 0;
    const totalArchivos = archivos.length;
    
    archivos.forEach((archivo, index) => {
        // Verificar que sea un archivo de imagen o video
        if (!archivo.type.startsWith('image/') && !archivo.type.startsWith('video/')) {
            imagenesProcessadas++;
            if (imagenesProcessadas === totalArchivos) {
                actualizarContadorImagenes();
                // Limpiar el input para permitir seleccionar los mismos archivos de nuevo si es necesario
                event.target.value = '';
            }
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const archivoData = {
                archivo: archivo,
                dataUrl: e.target.result,
                nombre: archivo.name,
                tipo: archivo.type.startsWith('image/') ? 'imagen' : 'video'
            };
            
            // Agregar a los archivos existentes (no reemplazar)
            imagenesSeleccionadas.push(archivoData);
            
            // Crear elemento de preview
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            let contenidoMultimedia = '';
            if (archivo.type.startsWith('image/')) {
                contenidoMultimedia = `<img src="${e.target.result}" alt="${archivo.name}">`;
            } else if (archivo.type.startsWith('video/')) {
                contenidoMultimedia = `
                    <video controls>
                        <source src="${e.target.result}" type="${archivo.type}">
                        Tu navegador no soporta el elemento video.
                    </video>
                `;
            }
            
            previewItem.innerHTML = `
                <div class="preview-imagen">
                    ${contenidoMultimedia}
                    <button class="btn-eliminar-imagen" onclick="eliminarImagenPorElemento(this)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="12" height="12">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <span class="nombre-archivo">${archivo.name}</span>
            `;
            
            // Agregar el nuevo elemento al final de la lista
            listaPreview.appendChild(previewItem);
            
            // Animar entrada del elemento
            setTimeout(() => {
                animarElementoDesdeArriba(previewItem, 0);
            }, 100 * imagenesProcessadas);
            
            imagenesProcessadas++;
            
            // Actualizar contador y limpiar input cuando todas las imágenes estén procesadas
            if (imagenesProcessadas === totalArchivos) {
                actualizarContadorImagenes();
                // Limpiar el input para permitir seleccionar más imágenes
                event.target.value = '';
            }
        };
        
        reader.onerror = function() {
            console.error(`Error al leer el archivo: ${archivo.name}`);
            imagenesProcessadas++;
            if (imagenesProcessadas === totalArchivos) {
                actualizarContadorImagenes();
                // Limpiar el input
                event.target.value = '';
            }
        };
        
        reader.readAsDataURL(archivo);
    });
}

// Función para eliminar imagen basada en el elemento del botón
function eliminarImagenPorElemento(botonEliminar) {
    const previewItem = botonEliminar.closest('.preview-item');
    const listaPreview = document.getElementById('lista-preview-imagenes');
    const previewContainer = document.getElementById('preview-imagenes');
    
    if (previewItem) {
        // Encontrar el índice del elemento en la lista actual
        const items = Array.from(listaPreview.querySelectorAll('.preview-item'));
        const index = items.indexOf(previewItem);
        
        if (index !== -1) {
            // Animar salida
            previewItem.style.opacity = '0';
            previewItem.style.transform = 'translateX(-100px)';
            
            setTimeout(() => {
                // Remover de la lista de imágenes seleccionadas
                imagenesSeleccionadas.splice(index, 1);
                
                // Remover elemento del DOM
                previewItem.remove();
                
                // Actualizar contador
                actualizarContadorImagenes();
                
                // Ocultar preview si no hay imágenes
                if (imagenesSeleccionadas.length === 0) {
                    previewContainer.style.display = 'none';
                    // Limpiar también el input file
                    const selectorImagenes = document.getElementById('selector-imagenes');
                    selectorImagenes.value = '';
                }
            }, 300);
        }
    }
}

// Función para actualizar el contador de archivos multimedia
function actualizarContadorImagenes() {
    const contador = document.getElementById('contador-imagenes');
    const cantidad = imagenesSeleccionadas.length;
    const espacioDisponible = 5 - cantidad;
    
    // Contar imágenes y videos por separado
    const imagenes = imagenesSeleccionadas.filter(item => item.tipo === 'imagen').length;
    const videos = imagenesSeleccionadas.filter(item => item.tipo === 'video').length;
    
    let texto = '';
    if (imagenes > 0 && videos > 0) {
        texto = `${imagenes} imagen${imagenes !== 1 ? 'es' : ''} y ${videos} video${videos !== 1 ? 's' : ''} seleccionado${videos !== 1 ? 's' : ''}`;
    } else if (imagenes > 0) {
        texto = `${imagenes} imagen${imagenes !== 1 ? 'es' : ''} seleccionada${imagenes !== 1 ? 's' : ''}`;
    } else if (videos > 0) {
        texto = `${videos} video${videos !== 1 ? 's' : ''} seleccionado${videos !== 1 ? 's' : ''}`;
    } else {
        texto = '0 archivos seleccionados';
    }
    
    if (cantidad < 5) {
        texto += ` (puedes agregar ${espacioDisponible} más)`;
    } else {
        texto += ` (máximo alcanzado)`;
    }
    
    contador.textContent = texto;
}

// Función para limpiar todas las imágenes
function limpiarImagenes() {
    const previewContainer = document.getElementById('preview-imagenes');
    const listaPreview = document.getElementById('lista-preview-imagenes');
    const selectorImagenes = document.getElementById('selector-imagenes');
    
    // Animar salida de todos los elementos
    const items = listaPreview.querySelectorAll('.preview-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
        }, index * 50);
    });
    
    setTimeout(() => {
        imagenesSeleccionadas = [];
        listaPreview.innerHTML = '';
        selectorImagenes.value = '';
        previewContainer.style.display = 'none';
    }, items.length * 50 + 300);
}

// Función unificada para publicar contenido (texto, imágenes y encuestas)
function publicarContenido() {
    const textoPublicacion = document.getElementById('texto-publicacion').value.trim();
    const creadorEncuesta = document.getElementById('creador-encuesta');
    
    // Si hay una encuesta abierta, validarla primero
    if (creadorEncuesta && creadorEncuesta.style.display !== 'none') {
        if (!crearEncuesta()) {
            return; // Si la validación falla, no continuar
        }
    }
    
    // Verificar que hay contenido para publicar
    if (textoPublicacion === '') {
        alert('Debe escribir un texto para publicar.');
        document.getElementById('texto-publicacion').focus();
        return;
    }
    
    // Debug: verificar que la encuesta existe
    if (encuestaActual) {
        console.log('Publicando encuesta:', encuestaActual);
    } else {
        console.log('No hay encuesta para publicar');
    }
    
    // Crear nueva publicación con todos los elementos disponibles
    crearNuevaPublicacion(textoPublicacion, imagenesSeleccionadas, encuestaActual);
    
    // Limpiar formulario
    document.getElementById('texto-publicacion').value = '';
    limpiarImagenes();
    ocultarIndicadorEncuesta();
    encuestaActual = null;
}

// Función para verificar si se presiona Enter para publicar
function verificarEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        publicarContenido();
    }
}

// Función para crear una nueva publicación con el formato existente
function crearNuevaPublicacion(texto, imagenes, encuesta = null) {
    const feedPublicaciones = document.querySelector('.feed-publicaciones');
    
    // Crear contenedor individual para esta publicación
    const contenedorPublicacion = document.createElement('div');
    contenedorPublicacion.className = 'contenedor-publicacion';
    
    // Crear la publicación
    const nuevaPublicacion = document.createElement('div');
    nuevaPublicacion.className = 'publicacion';
    
    // Generar ID único para esta publicación
    const publicacionId = 'pub_' + Date.now();
    nuevaPublicacion.id = publicacionId;
    
    // Generar HTML de multimedia si existen
    let htmlImagenes = '';
    if (imagenes.length > 0) {
        htmlImagenes = `
            <div class="carrusel-imagenes">
                <div class="carrusel-contenedor">
                    ${imagenes.map((archivo, index) => `
                        <div class="imagen-slide ${index === 0 ? 'active' : ''} ${archivo.tipo === 'video' ? 'tiene-video' : ''}">
                            ${archivo.tipo === 'imagen' ? 
                                `<img src="${archivo.dataUrl}" alt="${archivo.nombre}">
                                 <button class="btn-expandir" onclick="expandirImagen('${archivo.dataUrl}', '${archivo.nombre}')">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                                         <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                     </svg>
                                 </button>` :
                                `<video controls preload="metadata">
                                     <source src="${archivo.dataUrl}" type="${archivo.archivo.type}">
                                     Tu navegador no soporta el elemento video.
                                 </video>`
                            }
                        </div>
                    `).join('')}
                </div>
                
                ${imagenes.length > 1 ? `
                <!-- Botones de navegación -->
                <button class="btn-anterior" onclick="cambiarSlidePublicacion('${publicacionId}', -1)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button class="btn-siguiente" onclick="cambiarSlidePublicacion('${publicacionId}', 1)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
                
                <!-- Indicadores -->
                <div class="indicadores">
                    ${imagenes.map((_, index) => `
                        <div class="indicador ${index === 0 ? 'active' : ''}" onclick="irSlidePublicacion('${publicacionId}', ${index})"></div>
                    `).join('')}
                </div>
                
                <!-- Contador de archivos -->
                <div class="contador-imagenes">
                    <span class="imagen-actual">1</span> / <span class="total-imagenes">${imagenes.length}</span>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    // Generar HTML de encuesta si existe
    let htmlEncuesta = '';
    if (encuesta) {
        console.log('Generando HTML para encuesta:', encuesta);
        const encuestaId = 'encuesta_' + Date.now();
        const tiempoRestanteTexto = tiempoRestante(encuesta.fechaCreacion, encuesta.duracionHoras);
        
        htmlEncuesta = `
            <div class="encuesta-publicada" id="${encuestaId}" data-encuesta='${JSON.stringify(encuesta).replace(/'/g, "&apos;")}' style="display: block;">
                <div class="encuesta-pregunta">
                    <h4>${encuesta.pregunta}</h4>
                </div>
                <div class="encuesta-opciones">
                    ${encuesta.opciones.map((opcion, index) => `
                        <div class="opcion-encuesta" onclick="votarEnEncuesta('${encuestaId}', ${index})">
                            <div class="opcion-contenido">
                                <span class="texto-opcion">${opcion.texto}</span>
                                <div class="resultados-opcion">
                                    <span class="porcentaje-votos">0%</span>
                                    <span class="numero-votos">0 votos</span>
                                </div>
                            </div>
                            <div class="barra-progreso-container">
                                <div class="barra-progreso" style="width: 0%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="encuesta-info">
                    <span class="total-votos">${encuesta.totalVotos} votos totales</span>
                    <span class="tiempo-restante">${tiempoRestanteTexto}</span>
                </div>
            </div>
        `;
        console.log('HTML de encuesta generado:', htmlEncuesta);
    } else {
        console.log('No hay encuesta para generar HTML');
    }
    
    nuevaPublicacion.innerHTML = `
        <div class="usuario-info">
            <div class="avatar">
                <img src="/publicaciones/UFGPerfil.jpg" alt="Avatar usuario">
            </div>
            <div class="usuario-datos">
                <h4>UFG</h4>
                <p class="usuario-handle">@ufg</p>
                <p class="tiempo-publicacion">hace unos segundos</p>
            </div>
            <div class="menu-opciones">
                <button class="btn-menu-publicacion" onclick="toggleMenuPublicacion('${publicacionId}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                    </svg>
                </button>
                <div class="menu-dropdown-publicacion" id="menu-pub-${publicacionId}">
                    <button class="menu-opcion eliminar" onclick="eliminarPublicacion('${publicacionId}')">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Eliminar publicación
                    </button>
                </div>
            </div>
        </div>
        <div class="contenido-publicacion">
            ${texto ? `<p>${texto}</p>` : ''}
            ${htmlImagenes}
            ${htmlEncuesta}
        </div>
        <div class="separador"></div>
        <div class="acciones-publicacion">
            <button class="accion-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <span>0</span>
            </button>
            <button class="accion-btn" data-publicacion="${publicacionId}" data-accion="comentar" onclick="toggleComentarios('${publicacionId}')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                </svg>
                <span>0</span>
            </button>
            <button class="accion-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-11.814a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Z" />
                </svg>
                <span>Compartir</span>
            </button>
        </div>
    `;
    
    // Agregar la publicación al contenedor
    contenedorPublicacion.appendChild(nuevaPublicacion);
    
    // Insertar el contenedor al principio del feed
    feedPublicaciones.insertBefore(contenedorPublicacion, feedPublicaciones.firstChild);
    
    // Animar entrada del contenedor
    animarElementoDesdeArriba(contenedorPublicacion, 0);
    
    // Inicializar carrusel específico para esta publicación si hay múltiples imágenes
    if (imagenes.length > 1) {
        inicializarCarruselPublicacion(publicacionId, imagenes.length);
    }
}

// Sistema de carruseles para publicaciones dinámicas
let carruselesPublicaciones = {};

// Función para inicializar carrusel específico de una publicación
function inicializarCarruselPublicacion(publicacionId, totalImagenes) {
    carruselesPublicaciones[publicacionId] = {
        slideActual: 0,
        totalSlides: totalImagenes
    };
}

// Función para cambiar slide en una publicación específica
function cambiarSlidePublicacion(publicacionId, direccion) {
    if (!carruselesPublicaciones[publicacionId]) return;
    
    const publicacion = document.getElementById(publicacionId);
    if (!publicacion) return;
    
    const slides = publicacion.querySelectorAll('.imagen-slide');
    const indicadores = publicacion.querySelectorAll('.indicador');
    const contadorActual = publicacion.querySelector('.imagen-actual');
    
    const carrusel = carruselesPublicaciones[publicacionId];
    
    // Remover clase active del slide actual
    slides[carrusel.slideActual].classList.remove('active');
    indicadores[carrusel.slideActual].classList.remove('active');
    
    // Calcular nuevo slide
    carrusel.slideActual += direccion;
    
    // Ciclo infinito
    if (carrusel.slideActual >= carrusel.totalSlides) {
        carrusel.slideActual = 0;
    } else if (carrusel.slideActual < 0) {
        carrusel.slideActual = carrusel.totalSlides - 1;
    }
    
    // Activar nuevo slide
    slides[carrusel.slideActual].classList.add('active');
    indicadores[carrusel.slideActual].classList.add('active');
    
    // Actualizar contador
    contadorActual.textContent = carrusel.slideActual + 1;
}

// Función para ir a un slide específico en una publicación
function irSlidePublicacion(publicacionId, index) {
    if (!carruselesPublicaciones[publicacionId]) return;
    
    const publicacion = document.getElementById(publicacionId);
    if (!publicacion) return;
    
    const slides = publicacion.querySelectorAll('.imagen-slide');
    const indicadores = publicacion.querySelectorAll('.indicador');
    const contadorActual = publicacion.querySelector('.imagen-actual');
    
    const carrusel = carruselesPublicaciones[publicacionId];
    
    // Remover clase active del slide actual
    slides[carrusel.slideActual].classList.remove('active');
    indicadores[carrusel.slideActual].classList.remove('active');
    
    // Cambiar al slide seleccionado
    carrusel.slideActual = index;
    
    // Activar nuevo slide
    slides[carrusel.slideActual].classList.add('active');
    indicadores[carrusel.slideActual].classList.add('active');
    
    // Actualizar contador
    contadorActual.textContent = carrusel.slideActual + 1;
}

// Función para inicializar contadores de comentarios en publicaciones existentes
function inicializarContadoresComentarios() {
    // Actualizar contadores para todas las publicaciones que tienen comentarios
    Object.keys(comentariosPorPublicacion).forEach(publicacionId => {
        actualizarContadorComentarios(publicacionId);
    });
}

// ==================== FUNCIONES DE COMENTARIOS ====================

// Variable para almacenar comentarios de todas las publicaciones
let comentariosPorPublicacion = {
    // Comentarios de ejemplo para la publicación existente
    'pub_ejemplo_1': [
        {
            id: 'comment_ejemplo_1',
            texto: '¡Excelente información! Muy útil para planificar el semestre.',
            autor: 'María Estudiante',
            handle: '@maria.est',
            avatar: '/publicaciones/UFGPerfil.jpg',
            fecha: new Date(Date.now() - 2 * 60 * 60 * 1000), // hace 2 horas
            likes: 5,
            liked: false
        },
        {
            id: 'comment_ejemplo_2',
            texto: '¿Ya está disponible para descargar el calendario completo?',
            autor: 'Carlos Admin',
            handle: '@carlos.admin',
            avatar: '/publicaciones/UFGPerfil.jpg',
            fecha: new Date(Date.now() - 1 * 60 * 60 * 1000), // hace 1 hora
            likes: 2,
            liked: true
        },
        {
            id: 'comment_ejemplo_3',
            texto: 'Gracias por mantener a la comunidad informada 👍',
            autor: 'Ana Profesora',
            handle: '@ana.prof',
            avatar: '/publicaciones/UFGPerfil.jpg',
            fecha: new Date(Date.now() - 30 * 60 * 1000), // hace 30 minutos
            likes: 8,
            liked: false
        },
        {
            id: 'comment_ejemplo_4',
            texto: 'Muy importante tener estas fechas claras desde el inicio del período.',
            autor: 'Roberto Coordinador',
            handle: '@roberto.coord',
            avatar: '/publicaciones/UFGPerfil.jpg',
            fecha: new Date(Date.now() - 20 * 60 * 1000), // hace 20 minutos
            likes: 3,
            liked: false
        },
        {
            id: 'comment_ejemplo_5',
            texto: '¿Las fechas de exámenes finales también están incluidas?',
            autor: 'Sofía Estudiante',
            handle: '@sofia.est',
            avatar: '/publicaciones/UFGPerfil.jpg',
            fecha: new Date(Date.now() - 15 * 60 * 1000), // hace 15 minutos
            likes: 1,
            liked: false
        },
        {
            id: 'comment_ejemplo_6',
            texto: 'Perfecto para organizar mi horario de estudio durante el semestre.',
            autor: 'Diego Alumno',
            handle: '@diego.alumno',
            avatar: '/publicaciones/UFGPerfil.jpg',
            fecha: new Date(Date.now() - 10 * 60 * 1000), // hace 10 minutos
            likes: 4,
            liked: true
        },
        {
            id: 'comment_ejemplo_7',
            texto: 'Recomiendo imprimir el calendario y pegarlo en el escritorio.',
            autor: 'Patricia Secretaria',
            handle: '@patricia.sec',
            avatar: '/publicaciones/UFGPerfil.jpg',
            fecha: new Date(Date.now() - 5 * 60 * 1000), // hace 5 minutos
            likes: 6,
            liked: false
        },
        {
            id: 'comment_ejemplo_8',
            texto: 'Gracias a todos por sus comentarios. El calendario estará disponible pronto.',
            autor: 'UFG',
            handle: '@ufg',
            avatar: '/publicaciones/UFGPerfil.jpg',
            fecha: new Date(Date.now() - 2 * 60 * 1000), // hace 2 minutos
            likes: 3,
            liked: false
        },
        {
            id: 'comment_ejemplo_9',
            texto: 'Estaremos compartiendo más información académica regularmente.',
            autor: 'UFG',
            handle: '@ufg',
            avatar: '/publicaciones/UFGPerfil.jpg',
            fecha: new Date(Date.now() - 1 * 60 * 1000), // hace 1 minuto
            likes: 1,
            liked: false
        }
    ]
};

// Función para alternar la visibilidad de los comentarios
function toggleComentarios(publicacionId) {
    const seccionComentarios = document.getElementById(`comentarios-${publicacionId}`);
    const botonComentarios = document.querySelector(`[onclick="toggleComentarios('${publicacionId}')"]`);
    
    if (!seccionComentarios) {
        // Crear sección de comentarios si no existe
        crearSeccionComentarios(publicacionId);
        return;
    }
    
    if (seccionComentarios.style.display === 'none' || seccionComentarios.style.display === '') {
        seccionComentarios.style.display = 'block';
        cargarComentarios(publicacionId);
    } else {
        seccionComentarios.style.display = 'none';
    }
}

// Función para crear la sección de comentarios
function crearSeccionComentarios(publicacionId) {
    const publicacion = document.getElementById(publicacionId);
    if (!publicacion) return;
    
    const separador = publicacion.querySelector('.separador');
    if (!separador) return;
    
    // Crear HTML de la sección de comentarios
    const seccionComentarios = document.createElement('div');
    seccionComentarios.id = `comentarios-${publicacionId}`;
    seccionComentarios.className = 'seccion-comentarios';
    seccionComentarios.innerHTML = `
        <div class="contador-comentarios">
            <span id="count-${publicacionId}">0</span> comentarios
        </div>
        
        <!-- Formulario para agregar comentario -->
        <div class="formulario-comentario">
            <div class="avatar-comentario">
                <img src="/publicaciones/UFGPerfil.jpg" alt="Tu avatar">
            </div>
            <div class="input-comentario">
                <textarea 
                    id="campo-comentario-${publicacionId}" 
                    class="campo-comentario" 
                    placeholder="Escribe un comentario..."
                    maxlength="500"
                    rows="1"
                ></textarea>
                <div class="acciones-comentario">
                    <button class="btn-cancelar" onclick="cancelarComentario('${publicacionId}')">
                        Cancelar
                    </button>
                    <button class="btn-comentario" onclick="publicarComentario('${publicacionId}')">
                        Comentar
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Lista de comentarios -->
        <div id="lista-comentarios-${publicacionId}" class="lista-comentarios">
            <!-- Los comentarios se cargarán aquí -->
        </div>
    `;
    
    // Insertar después del separador
    separador.parentNode.insertBefore(seccionComentarios, separador.nextSibling);
    
    // Configurar auto-resize para el textarea
    const textarea = seccionComentarios.querySelector('.campo-comentario');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
    
    // Cargar comentarios existentes
    cargarComentarios(publicacionId);
}

// Función para publicar un comentario
function publicarComentario(publicacionId) {
    const campoComentario = document.getElementById(`campo-comentario-${publicacionId}`);
    const textoComentario = campoComentario.value.trim();
    
    if (textoComentario === '') {
        alert('Escribe algo para comentar');
        campoComentario.focus();
        return;
    }
    
    // Crear objeto de comentario
    const nuevoComentario = {
        id: 'comment_' + Date.now(),
        texto: textoComentario,
        autor: 'UFG',
        handle: '@ufg',
        avatar: '/publicaciones/UFGPerfil.jpg',
        fecha: new Date(),
        likes: 0,
        liked: false
    };
    
    // Agregar comentario al storage
    if (!comentariosPorPublicacion[publicacionId]) {
        comentariosPorPublicacion[publicacionId] = [];
    }
    comentariosPorPublicacion[publicacionId].unshift(nuevoComentario);
    
    // Limpiar campo
    campoComentario.value = '';
    campoComentario.style.height = 'auto';
    
    // Actualizar contador en el botón
    actualizarContadorComentarios(publicacionId);
    
    // Recargar comentarios
    cargarComentarios(publicacionId);
    
    console.log('Comentario publicado:', nuevoComentario);
}

// Función para cancelar comentario
function cancelarComentario(publicacionId) {
    const campoComentario = document.getElementById(`campo-comentario-${publicacionId}`);
    campoComentario.value = '';
    campoComentario.style.height = 'auto';
    campoComentario.blur();
}

// Función para cargar comentarios
function cargarComentarios(publicacionId) {
    const listaComentarios = document.getElementById(`lista-comentarios-${publicacionId}`);
    const contadorComentarios = document.getElementById(`count-${publicacionId}`);
    
    if (!listaComentarios || !contadorComentarios) return;
    
    const comentarios = comentariosPorPublicacion[publicacionId] || [];
    contadorComentarios.textContent = comentarios.length;
    
    if (comentarios.length === 0) {
        listaComentarios.innerHTML = '<div class="sin-comentarios">Sé el primero en comentar</div>';
        return;
    }
    
    // Generar HTML de comentarios
    listaComentarios.innerHTML = comentarios.map(comentario => {
        const esComentarioPropio = comentario.handle === '@ufg'; // Verificar si es comentario del usuario actual
        
        return `
        <div class="comentario" id="${comentario.id}">
            <div class="avatar-comentario">
                <img src="${comentario.avatar}" alt="Avatar de ${comentario.autor}">
            </div>
            <div class="comentario-contenido">
                <div class="comentario-header">
                    <span class="comentario-autor">${comentario.autor}</span>
                    <span class="comentario-handle">${comentario.handle}</span>
                    <span class="comentario-tiempo">${formatearTiempo(comentario.fecha)}</span>
                    ${esComentarioPropio ? `
                        <div class="comentario-menu">
                            <button class="btn-menu-comentario" onclick="toggleMenuComentario('${comentario.id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </button>
                            <div class="menu-dropdown" id="menu-${comentario.id}">
                                <button class="menu-opcion eliminar" onclick="eliminarComentario('${publicacionId}', '${comentario.id}')">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="comentario-texto">${comentario.texto}</div>
                <div class="comentario-acciones">
                    <button class="accion-comentario ${comentario.liked ? 'liked' : ''}" 
                            onclick="toggleLikeComentario('${publicacionId}', '${comentario.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="${comentario.liked ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <span>${comentario.likes}</span>
                    </button>
                    <button class="accion-comentario" onclick="responderComentario('${publicacionId}', '${comentario.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                        </svg>
                        Responder
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    // Verificar si hay scroll y agregar clase para el indicador de fade
    setTimeout(() => {
        if (listaComentarios.scrollHeight > listaComentarios.clientHeight) {
            listaComentarios.classList.add('has-scroll');
        } else {
            listaComentarios.classList.remove('has-scroll');
        }
    }, 100);
}

// Función para dar like a un comentario
function toggleLikeComentario(publicacionId, comentarioId) {
    const comentarios = comentariosPorPublicacion[publicacionId];
    if (!comentarios) return;
    
    const comentario = comentarios.find(c => c.id === comentarioId);
    if (!comentario) return;
    
    if (comentario.liked) {
        comentario.likes = Math.max(0, comentario.likes - 1);
        comentario.liked = false;
    } else {
        comentario.likes++;
        comentario.liked = true;
    }
    
    // Recargar comentarios para actualizar la UI
    cargarComentarios(publicacionId);
}

// Función para responder a un comentario
function responderComentario(publicacionId, comentarioId) {
    const campoComentario = document.getElementById(`campo-comentario-${publicacionId}`);
    const comentarios = comentariosPorPublicacion[publicacionId];
    
    if (!comentarios || !campoComentario) return;
    
    const comentario = comentarios.find(c => c.id === comentarioId);
    if (!comentario) return;
    
    // Agregar mención al campo de comentario
    campoComentario.value = `${comentario.handle} `;
    campoComentario.focus();
    
    // Posicionar cursor al final
    campoComentario.setSelectionRange(campoComentario.value.length, campoComentario.value.length);
}

// Función para actualizar contador de comentarios en el botón
function actualizarContadorComentarios(publicacionId) {
    const botonComentarios = document.querySelector(`[data-publicacion="${publicacionId}"][data-accion="comentar"]`);
    if (!botonComentarios) return;
    
    const contador = botonComentarios.querySelector('span');
    const numeroComentarios = (comentariosPorPublicacion[publicacionId] || []).length;
    
    if (contador) {
        contador.textContent = numeroComentarios;
    }
}

// Función para mostrar/ocultar menú de opciones de comentario
function toggleMenuComentario(comentarioId) {
    const menu = document.getElementById(`menu-${comentarioId}`);
    if (!menu) return;
    
    // Cerrar otros menús abiertos
    document.querySelectorAll('.menu-dropdown.visible').forEach(otroMenu => {
        if (otroMenu.id !== `menu-${comentarioId}`) {
            otroMenu.classList.remove('visible');
        }
    });
    
    // Toggle del menú actual
    menu.classList.toggle('visible');
    
    // Cerrar menú al hacer click fuera
    if (menu.classList.contains('visible')) {
        setTimeout(() => {
            document.addEventListener('click', function cerrarMenu(e) {
                if (!menu.contains(e.target) && !e.target.closest('.btn-menu-comentario')) {
                    menu.classList.remove('visible');
                    document.removeEventListener('click', cerrarMenu);
                }
            });
        }, 100);
    }
}

// Función para eliminar comentario (eliminación directa y silenciosa)
function eliminarComentario(publicacionId, comentarioId) {
    const comentarios = comentariosPorPublicacion[publicacionId];
    if (!comentarios) return;
    
    // Verificar que el comentario pertenece al usuario actual
    const comentario = comentarios.find(c => c.id === comentarioId);
    if (!comentario || comentario.handle !== '@ufg') {
        // Eliminación silenciosa - no mostrar mensaje de error
        return;
    }
    
    // Animar eliminación inmediatamente
    const elementoComentario = document.getElementById(comentarioId);
    if (elementoComentario) {
        elementoComentario.style.transition = 'all 0.3s ease';
        elementoComentario.style.opacity = '0';
        elementoComentario.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            // Eliminar comentario del array
            const index = comentarios.findIndex(c => c.id === comentarioId);
            if (index !== -1) {
                comentarios.splice(index, 1);
                
                // Actualizar contador en el botón
                actualizarContadorComentarios(publicacionId);
                
                // Recargar comentarios
                cargarComentarios(publicacionId);
                
                console.log('Comentario eliminado:', comentarioId);
            }
        }, 300);
    }
    
    // Cerrar menú inmediatamente
    const menusAbiertos = document.querySelectorAll('.menu-dropdown.activo');
    menusAbiertos.forEach(menu => menu.classList.remove('activo'));
}

// Función para formatear tiempo relativo
function formatearTiempo(fecha) {
    const ahora = new Date();
    const diferencia = ahora - fecha;
    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const semanas = Math.floor(dias / 7);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(dias / 365);
    
    if (segundos < 30) return 'ahora';
    if (segundos < 60) return 'hace unos segundos';
    if (minutos === 1) return 'hace 1 min';
    if (minutos < 60) return `hace ${minutos} min`;
    if (horas === 1) return 'hace 1 hora';
    if (horas < 24) return `hace ${horas} horas`;
    if (dias === 1) return 'hace 1 día';
    if (dias < 7) return `hace ${dias} días`;
    if (semanas === 1) return 'hace 1 semana';
    if (semanas < 4) return `hace ${semanas} semanas`;
    if (meses === 1) return 'hace 1 mes';
    if (meses < 12) return `hace ${meses} meses`;
    if (años === 1) return 'hace 1 año';
    if (años > 1) return `hace ${años} años`;
    
    return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: fecha.getFullYear() !== ahora.getFullYear() ? 'numeric' : undefined
    });
}

// ==================== FUNCIONES DE ENCUESTAS ====================

// Variable para almacenar datos de encuesta
let encuestaActual = null;

// Función para abrir el creador de encuestas
function abrirCreadorEncuesta() {
    const creadorEncuesta = document.getElementById('creador-encuesta');
    
    // Limpiar datos anteriores
    document.getElementById('pregunta-encuesta').value = '';
    const opciones = document.querySelectorAll('.opcion-input input');
    opciones.forEach(input => input.value = '');
    
    // Resetear a 2 opciones
    const opcionesContainer = document.querySelector('.opciones-encuesta');
    const todasLasOpciones = opcionesContainer.querySelectorAll('.opcion-input');
    todasLasOpciones.forEach((opcion, index) => {
        if (index >= 2) {
            opcion.remove();
        }
    });
    
    // Limpiar encuesta actual si existe
    encuestaActual = null;
    
    // Mostrar creador
    creadorEncuesta.style.display = 'block';
    setTimeout(() => {
        creadorEncuesta.classList.add('visible');
    }, 10);
    
    // Enfocar en la pregunta
    document.getElementById('pregunta-encuesta').focus();
}

// Función para cerrar el creador de encuestas
function cerrarCreadorEncuesta(limpiarEncuesta = true) {
    const creadorEncuesta = document.getElementById('creador-encuesta');
    creadorEncuesta.classList.remove('visible');
    setTimeout(() => {
        creadorEncuesta.style.display = 'none';
    }, 300);
    
    // Solo limpiar datos si se especifica (no cuando se está creando una encuesta)
    if (limpiarEncuesta) {
        encuestaActual = null;
    }
}

// Función para agregar una nueva opción
function agregarOpcion() {
    const opcionesContainer = document.querySelector('.opciones-encuesta');
    const opcionesActuales = opcionesContainer.querySelectorAll('.opcion-input');
    
    // Máximo 6 opciones
    if (opcionesActuales.length >= 6) {
        alert('Máximo 6 opciones permitidas');
        return;
    }
    
    const numeroOpcion = opcionesActuales.length + 1;
    const nuevaOpcion = document.createElement('div');
    nuevaOpcion.className = 'opcion-input';
    nuevaOpcion.innerHTML = `
        <input type="text" placeholder="Opción ${numeroOpcion}" maxlength="100">
        <button class="btn-eliminar-opcion" onclick="eliminarOpcion(this)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="12" height="12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
    `;
    
    opcionesContainer.appendChild(nuevaOpcion);
    
    // Mostrar botones de eliminar si hay más de 2 opciones
    actualizarBotonesEliminar();
    
    // Enfocar en la nueva opción
    nuevaOpcion.querySelector('input').focus();
}

// Función para eliminar una opción
function eliminarOpcion(boton) {
    const opcion = boton.parentElement;
    const opcionesContainer = document.querySelector('.opciones-encuesta');
    const opcionesActuales = opcionesContainer.querySelectorAll('.opcion-input');
    
    // Mínimo 2 opciones
    if (opcionesActuales.length <= 2) {
        return;
    }
    
    opcion.remove();
    actualizarBotonesEliminar();
    actualizarPlaceholders();
}

// Función para actualizar la visibilidad de botones eliminar
function actualizarBotonesEliminar() {
    const opcionesContainer = document.querySelector('.opciones-encuesta');
    const opciones = opcionesContainer.querySelectorAll('.opcion-input');
    const botones = opcionesContainer.querySelectorAll('.btn-eliminar-opcion');
    
    botones.forEach(boton => {
        boton.style.display = opciones.length > 2 ? 'flex' : 'none';
    });
}

// Función para actualizar placeholders
function actualizarPlaceholders() {
    const opciones = document.querySelectorAll('.opcion-input input');
    opciones.forEach((input, index) => {
        input.placeholder = `Opción ${index + 1}`;
    });
}

// Función para validar y crear encuesta
function crearEncuesta() {
    const pregunta = document.getElementById('pregunta-encuesta').value.trim();
    const duracion = document.getElementById('duracion-encuesta').value;
    const opciones = Array.from(document.querySelectorAll('.opcion-input input'))
        .map(input => input.value.trim())
        .filter(texto => texto.length > 0);
    
    // Validaciones
    if (!pregunta) {
        alert('Debes escribir una pregunta para la encuesta');
        document.getElementById('pregunta-encuesta').focus();
        return false;
    }
    
    if (opciones.length < 2) {
        alert('Debes tener al menos 2 opciones para la encuesta');
        return false;
    }
    
    // Crear objeto de encuesta
    encuestaActual = {
        pregunta: pregunta,
        opciones: opciones.map(opcion => ({
            texto: opcion,
            votos: 0
        })),
        duracionHoras: parseInt(duracion),
        fechaCreacion: new Date(),
        votantes: [], // IDs de usuarios que han votado
        totalVotos: 0
    };
    
    console.log('Encuesta creada:', encuestaActual);
    
    // Mostrar indicador de encuesta creada
    mostrarIndicadorEncuesta(encuestaActual);
    
    // Cerrar el creador sin limpiar la encuesta
    cerrarCreadorEncuesta(false);
    return true;
}

// Función para votar en una encuesta
function votarEnEncuesta(encuestaId, opcionIndex) {
    const userId = 'usuario_actual'; // En una app real sería el ID del usuario logueado
    const encuesta = document.getElementById(encuestaId);
    
    if (!encuesta) {
        console.error('Encuesta no encontrada:', encuestaId);
        return;
    }
    
    let datosEncuesta;
    try {
        const dataAttr = encuesta.dataset.encuesta.replace(/&apos;/g, "'");
        datosEncuesta = JSON.parse(dataAttr);
    } catch (error) {
        console.error('Error al parsear datos de encuesta:', error);
        return;
    }
    
    // Verificar si ya votó
    if (datosEncuesta.votantes.includes(userId)) {
        alert('Ya has votado en esta encuesta');
        return;
    }
    
    // Verificar si la encuesta ha expirado
    if (encuestaExpirada(new Date(datosEncuesta.fechaCreacion), datosEncuesta.duracionHoras)) {
        alert('Esta encuesta ya ha expirado');
        return;
    }
    
    // Registrar voto
    datosEncuesta.opciones[opcionIndex].votos++;
    datosEncuesta.totalVotos++;
    datosEncuesta.votantes.push(userId);
    
    // Actualizar dataset
    encuesta.dataset.encuesta = JSON.stringify(datosEncuesta).replace(/'/g, "&apos;");
    
    // Actualizar visualización
    actualizarResultadosEncuesta(encuestaId, datosEncuesta);
    
    // Marcar todas las opciones como votadas (deshabilitar futuras votaciones)
    const opciones = encuesta.querySelectorAll('.opcion-encuesta');
    opciones.forEach(opcion => {
        opcion.classList.add('votada');
        opcion.style.cursor = 'not-allowed';
        opcion.onclick = null;
    });
}

// Función para actualizar los resultados visuales de la encuesta
function actualizarResultadosEncuesta(encuestaId, datosEncuesta) {
    const encuesta = document.getElementById(encuestaId);
    if (!encuesta) {
        console.error('No se encontró la encuesta con ID:', encuestaId);
        return;
    }
    
    const opciones = encuesta.querySelectorAll('.opcion-encuesta');
    
    opciones.forEach((opcion, index) => {
        const porcentajeElement = opcion.querySelector('.porcentaje-votos');
        const numeroVotosElement = opcion.querySelector('.numero-votos');
        const barraProgreso = opcion.querySelector('.barra-progreso');
        
        if (!porcentajeElement || !numeroVotosElement || !barraProgreso) {
            console.error('No se encontraron elementos de la opción:', index);
            return;
        }
        
        const votos = datosEncuesta.opciones[index].votos;
        const porcentaje = datosEncuesta.totalVotos > 0 ? 
            Math.round((votos / datosEncuesta.totalVotos) * 100) : 0;
        
        porcentajeElement.textContent = `${porcentaje}%`;
        numeroVotosElement.textContent = `${votos} voto${votos !== 1 ? 's' : ''}`;
        
        // Animar la barra de progreso
        setTimeout(() => {
            barraProgreso.style.width = `${porcentaje}%`;
        }, 100);
        
        // Deshabilitar clic para futuras votaciones
        opcion.style.pointerEvents = 'none';
        opcion.classList.add('votada');
    });
    
    // Actualizar total de votos
    const totalVotos = encuesta.querySelector('.total-votos');
    if (totalVotos) {
        totalVotos.textContent = `${datosEncuesta.totalVotos} voto${datosEncuesta.totalVotos !== 1 ? 's' : ''} totales`;
    }
    
    // Actualizar tiempo restante
    const tiempoRestanteElement = encuesta.querySelector('.tiempo-restante');
    if (tiempoRestanteElement) {
        const tiempoRestanteTexto = tiempoRestante(new Date(datosEncuesta.fechaCreacion), datosEncuesta.duracionHoras);
        tiempoRestanteElement.textContent = tiempoRestanteTexto;
    }
}

// Función para verificar si una encuesta ha expirado
function encuestaExpirada(fechaCreacion, duracionHoras) {
    const ahora = new Date();
    const fechaExpiracion = new Date(fechaCreacion.getTime() + (duracionHoras * 60 * 60 * 1000));
    return ahora > fechaExpiracion;
}

// Función para obtener tiempo restante de encuesta
function tiempoRestante(fechaCreacion, duracionHoras) {
    const ahora = new Date();
    const fechaExpiracion = new Date(fechaCreacion.getTime() + (duracionHoras * 60 * 60 * 1000));
    const diferencia = fechaExpiracion - ahora;
    
    if (diferencia <= 0) return 'Expirada';
    
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    
    if (dias > 0) return `${dias}d ${horas}h restantes`;
    if (horas > 0) return `${horas}h ${minutos}m restantes`;
    return `${minutos}m restantes`;
}

// Función para mostrar indicador de encuesta creada
function mostrarIndicadorEncuesta(encuesta) {
    const indicador = document.getElementById('indicador-encuesta');
    const preguntaPreview = document.getElementById('pregunta-preview');
    const opcionesPreview = document.getElementById('opciones-preview');
    const duracionPreview = document.getElementById('duracion-preview');
    
    if (!indicador || !preguntaPreview || !opcionesPreview || !duracionPreview) {
        console.error('No se encontraron elementos del indicador de encuesta');
        return;
    }
    
    // Llenar contenido del preview
    preguntaPreview.textContent = `Pregunta: ${encuesta.pregunta}`;
    opcionesPreview.textContent = `${encuesta.opciones.length} opciones: ${encuesta.opciones.map(o => o.texto).join(', ')}`;
    duracionPreview.textContent = `Duración: ${encuesta.duracionHoras}h`;
    
    // Mostrar indicador
    indicador.style.display = 'block';
    
    // Animar entrada
    setTimeout(() => {
        indicador.style.opacity = '1';
        indicador.style.transform = 'translateY(0)';
    }, 10);
}

// Función para eliminar encuesta pendiente
function eliminarEncuestaPendiente() {
    const indicador = document.getElementById('indicador-encuesta');
    
    // Ocultar indicador
    indicador.style.display = 'none';
    
    // Limpiar encuesta
    encuestaActual = null;
    
    console.log('Encuesta pendiente eliminada');
}

// Función para ocultar indicador de encuesta después de publicar
function ocultarIndicadorEncuesta() {
    const indicador = document.getElementById('indicador-encuesta');
    if (indicador) {
        indicador.style.display = 'none';
    }
}

// Event listeners para funcionalidad de encuestas
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar encuesta con Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const creadorEncuesta = document.getElementById('creador-encuesta');
            if (creadorEncuesta && creadorEncuesta.style.display !== 'none') {
                cerrarCreadorEncuesta();
            }
        }
    });
});

// ==================== FUNCIONES DE MENÚ DE PUBLICACIONES ====================

// Función para alternar menú de publicación
function toggleMenuPublicacion(publicacionId) {
    // Cerrar otros menús abiertos
    const otrosMenus = document.querySelectorAll('.menu-dropdown-publicacion.activo');
    otrosMenus.forEach(menu => {
        if (menu.id !== `menu-pub-${publicacionId}`) {
            menu.classList.remove('activo');
        }
    });
    
    // Alternar el menú actual
    const menu = document.getElementById(`menu-pub-${publicacionId}`);
    if (menu) {
        menu.classList.toggle('activo');
    }
}

// Función para eliminar publicación
function eliminarPublicacion(publicacionId) {
    // Verificar que sea una publicación propia (en este caso todas son de @ufg)
    const elementoPublicacion = document.getElementById(publicacionId);
    if (!elementoPublicacion) return;
    
    // Animar eliminación
    elementoPublicacion.style.transition = 'all 0.4s ease';
    elementoPublicacion.style.opacity = '0';
    elementoPublicacion.style.transform = 'translateX(-30px) scale(0.95)';
    
    setTimeout(() => {
        // Buscar el contenedor padre de la publicación
        const contenedorPublicacion = elementoPublicacion.closest('.contenedor-publicacion');
        if (contenedorPublicacion) {
            contenedorPublicacion.remove();
        } else {
            elementoPublicacion.remove();
        }
        
        console.log('Publicación eliminada:', publicacionId);
    }, 400);
    
    // Cerrar menú inmediatamente
    const menusAbiertos = document.querySelectorAll('.menu-dropdown-publicacion.activo');
    menusAbiertos.forEach(menu => menu.classList.remove('activo'));
}

// Event listener para cerrar menús al hacer clic fuera
document.addEventListener('click', function(event) {
    // Cerrar menús de publicaciones
    if (!event.target.closest('.menu-dropdown-publicacion') && !event.target.closest('.btn-menu-publicacion')) {
        const menusPublicacionAbiertos = document.querySelectorAll('.menu-dropdown-publicacion.activo');
        menusPublicacionAbiertos.forEach(menu => {
            menu.classList.remove('activo');
        });
    }
});

