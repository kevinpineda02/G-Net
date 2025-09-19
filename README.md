# G-Net - Red Social Universitaria UFG

Una plataforma de red social moderna y responsive diseñada específicamente para la comunidad universitaria de la Universidad Francisco Gavidia (UFG).

## 🎯 Descripción

G-Net es una red social completa que permite a estudiantes, profesores y personal administrativo de la UFG conectarse, compartir información académica, y mantenerse al día con eventos universitarios. La plataforma incluye funcionalidades de publicación, chat en tiempo real, y un calendario académico integrado.

## ✨ Características Principales

### 📱 Interfaz Moderna y Responsive
- Diseño adaptativo que funciona en dispositivos móviles, tablets y desktop
- Tema oscuro optimizado para reducir la fatiga visual
- Interfaz intuitiva inspirada en las mejores prácticas de UX/UI

### 📝 Sistema de Publicaciones
- Creación de publicaciones con texto, imágenes y videos
- Soporte para múltiples archivos multimedia (hasta 10 imágenes por publicación)
- Sistema de likes, comentarios y compartir
- Contador de caracteres en tiempo real (hasta 2500 caracteres)
- Vista previa de medios antes de publicar

### 💬 Sistema de Chat Integrado
- Chat en tiempo real entre usuarios
- Interfaz de chat moderna con sidebar de contactos
- Estados de conexión (online/offline)
- Diseño responsive optimizado para móviles

### 📅 Calendario Académico Fijo
- Publicación permanente del calendario académico 2025
- Múltiples vistas de meses (Enero-Diciembre)
- Información de fechas importantes, exámenes y eventos
- Siempre visible en la parte superior del feed

### 🔍 Funcionalidades Sociales
- Perfiles de usuario personalizados
- Seguimiento de usuarios (seguidores/siguiendo)
- Tendencias y hashtags populares (#UFG2025, #VidaEstudiantil, #CalendarioAcademico)
- Sugerencias de contactos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Estilo**: CSS personalizado con variables y animaciones
- **Iconografía**: SVG icons personalizados
- **Responsive Design**: Media queries y Flexbox/Grid
- **Multimedia**: Soporte nativo para imágenes y videos

## 📁 Estructura del Proyecto

```
Home/
├── index.html              # Página principal
├── style.css               # Estilos principales
├── script.js               # Lógica de la aplicación
├── README.md              # Este archivo
└── Imagenes/
    ├── Cards/             # Iconos y elementos de UI
    │   ├── enviar.png
    │   ├── message-circle-dots-svgrepo-com.svg
    │   └── store-business-marketplace-shop-sale-buy-marketing-svgrepo-com.svg
    ├── Encabezado/        # Elementos del header
    │   └── notificacion.png
    └── publicaciones/     # Imágenes de contenido
        ├── Calendario.png     # Calendario Ene-Feb 2025
        ├── Calendario2.png    # Calendario Mar-Abr 2025
        ├── Calendario3.png    # Calendario May-Jun 2025
        ├── Calendario4.png    # Calendario Jul-Ago 2025
        ├── Calendario5.png    # Calendario Nov-Dic 2025
        ├── fijado.png        # Icono de publicación fijada
        └── ai-generated-indoor-headshot-for-a-man-wearing-white-t-shirt.jpg
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### Instalación
1. Clona o descarga el repositorio
2. Abre `index.html` en tu navegador
3. ¡La aplicación estará lista para usar!

### Para Desarrollo Local
```bash
# Si tienes Python instalado
python -m http.server 8000

# O si tienes Node.js
npx http-server

# Luego visita: http://localhost:8000
```

## 📋 Funcionalidades Principales

### ✅ Crear Publicaciones
1. Escribe tu contenido en el área de texto
2. Adjunta imágenes o videos (máximo 10 archivos)
3. Haz clic en "Publicar"
4. Tu publicación aparecerá en el feed

### ✅ Interactuar con Publicaciones
- **Like**: Haz clic en el corazón para dar like
- **Comentar**: Haz clic en el ícono de comentarios
- **Compartir**: Usa el botón de compartir

### ✅ Chat
1. Haz clic en el botón de chat (esquina inferior derecha)
2. Selecciona un contacto de la lista
3. Escribe y envía mensajes en tiempo real

### ✅ Responsive Design
- La interfaz se adapta automáticamente a diferentes tamaños de pantalla
- Navegación optimizada para móviles
- Chat con sidebar colapsable en dispositivos pequeños

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario**: #ff8a5b (Naranja UFG)
- **Fondo**: #161616 (Negro profundo)
- **Secundario**: #202020 (Gris oscuro)
- **Texto**: #ffffff (Blanco)
- **Acentos**: #f7c325 (Amarillo dorado)

### Tipografía
- Fuente principal: System fonts (-apple-system, BlinkMacSystemFont)
- Tamaños responsivos con rem/em
- Jerarquía visual clara

## 🔧 Configuración

### Variables Principales (script.js)
```javascript
const MAX_CARACTERES = 2500;  // Límite de caracteres por publicación
const MAX_IMAGENES = 10;      // Máximo de imágenes por publicación
```

### Personalización de Estilos
Los estilos principales están en `style.css` y utilizan variables CSS para fácil personalización.

## 📱 Compatibilidad

- ✅ Chrome (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Edge (v90+)
- ✅ Dispositivos móviles iOS/Android

## 🤝 Contribución

Este proyecto fue desarrollado para la Universidad Francisco Gavidia. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está desarrollado para uso académico en la Universidad Francisco Gavidia (UFG).

## 👥 Autores

- **Desarrollador Principal**: Kevin
- **Universidad**: Universidad Francisco Gavidia (UFG)
- **Año**: 2025

## 📞 Contacto

Para soporte técnico o consultas sobre el proyecto, contacta a través de los canales oficiales de la UFG.

---

**Universidad Francisco Gavidia - Powered by Arizona State University®**

*G-Net - Conectando la comunidad universitaria UFG* 🎓