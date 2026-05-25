# Portfolio 2026 — David Muñoz Valdés

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-davidcode--ai.github.io-00ff88?style=for-the-badge&logo=github)](https://davidcode-ai.github.io/portfolio-2026/)
[![GitHub](https://img.shields.io/badge/GitHub-Davidcode--ai-181717?style=for-the-badge&logo=github)](https://github.com/Davidcode-ai)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-David%20Muñoz-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/david-muñoz-valdés-8b26932b8/)
[![Made with](https://img.shields.io/badge/Made%20with-Vanilla%20JS%20%2B%20Tailwind-38bdf8?style=for-the-badge)](https://tailwindcss.com)

**Backend Developer Junior — Python · FastAPI · Automatización · Bases de datos**

[**→ Ver portfolio en vivo**](https://davidcode-ai.github.io/portfolio-2026/)

</div>

---

## Descripción

Portfolio personal de **David Muñoz Valdés**, diseñado con estética *Tech / Dark Mode* inspirada en herramientas como Vercel, Linear y Stripe. La propuesta diferencial es tratar el propio portfolio como si fuera un producto de software: cada sección tiene una metáfora técnica real y toda la UI está construida con las mismas herramientas que uso en mis proyectos.

En lugar de un portfolio estático convencional, el diseño simula una **API REST interactiva** donde el visitante puede "consumir" endpoints para descubrir mis proyectos, habilidades y datos de contacto, exactamente como lo haría un desarrollador con Postman o Swagger.

---

## Características

| Feature | Descripción |
|---|---|
| **Terminal Hero** | Simula una sesión `bash` macOS con efecto de escritura automática y respuesta JSON |
| **Interactive API Console** | Interfaz estilo Postman con endpoints clicables, spinner de carga y latency meter |
| **System Architecture Diagram** | Diagrama de flujo CSS con nodos interactivos y efecto glow neón |
| **Scroll Reveal** | Secciones animadas con `IntersectionObserver` — zero dependencias externas |
| **JSON Syntax Highlighting** | Coloreado de JSON implementado desde cero con regex, sin librerías |
| **Responsive** | Mobile-first, colapsa correctamente en todos los breakpoints |
| **Active Nav Highlight** | Enlace activo en navbar sincronizado con la sección visible |
| **Dark Mode nativo** | Paleta `#0a0a0a` base, tokens de color definidos en Tailwind config |

---

## Tech Stack

```
Frontend:  HTML5 · Tailwind CSS (CDN JIT) · Vanilla JavaScript (ES2022)
Tipografía: JetBrains Mono (código) · Inter (prosa) — Google Fonts
Animaciones: CSS @keyframes + IntersectionObserver API
Deploy:    GitHub Pages (rama main, raíz /)
Sin frameworks · Sin bundler · Sin dependencias npm
```

**Decisión de arquitectura:** se eligió Vanilla JS intencionalmente. Un portfolio es un artefacto estático que debe cargarse en < 1 segundo y funcionar sin Node.js, build steps ni pipelines de CI/CD. Todo el JavaScript cabe en un solo archivo de ~300 líneas con JSDoc completo.

---

## Estructura del proyecto

```
portfolio-2026/
├── index.html      # SPA shell — estructura completa, Tailwind config, todas las secciones
├── style.css       # Keyframes, componentes custom, variables de tema
├── script.js       # Lógica JS — API Console, terminal, animaciones, observers
└── README.md       # Este archivo
```

### `index.html`
Archivo principal y único punto de entrada. Contiene:
- Configuración de Tailwind CSS (tokens de color, fuentes, animaciones, keyframes) vía `tailwind.config`
- 5 secciones semánticas: `#hero`, `#api-console`, `#architecture`, `#about`, `#footer`
- Navbar fija con menú mobile
- Sin ningún JavaScript inline — toda la lógica está separada en `script.js`

### `style.css`
Estilos que Tailwind no puede generar dinámicamente:
- `@keyframes`: `blink`, `fadeInUp`, `fadeIn`, `glow`, `glowPulse`, `shimmer`, `arrowFlow`, `jsonReveal`
- Clases de componentes: `.terminal-window`, `.endpoint-btn`, `.arch-node`, `.hobby-card`, `.badge-base`
- Sintax highlighting del terminal JSON: `.json-key`, `.json-str`, `.json-num`, `.json-bool`
- Efecto `#navbar.scrolled` con `backdrop-filter: blur`

### `script.js`
Módulo principal dividido en capas bien diferenciadas:

| Capa | Responsabilidad |
|---|---|
| `ENDPOINTS` | Data layer — payloads JSON de cada endpoint simulado |
| `PROFILE_DATA` | Datos del perfil usados en el terminal hero |
| `syntaxHighlight()` | Utilidad pura — colorea JSON con regex sin dependencias |
| `loadEndpointResponse()` | Controla el ciclo de vida de una petición simulada (loading → response → badge) |
| `activateEndpoint()` | Gestiona el estado activo de los botones del sidebar |
| `typeText()` | Motor de escritura carácter a carácter con callback |
| `revealTerminalResponse()` | Orquesta la secuencia de animación del terminal |
| `initScrollReveal()` | `IntersectionObserver` para fade-in de secciones al hacer scroll |
| `initNavbar()` | Blur backdrop en scroll |
| `initMobileMenu()` | Toggle del menú hamburguesa |
| `initActiveNav()` | Resaltado del enlace activo sincronizado con viewport |

---

## Instalación y uso local

No hay dependencias que instalar. Simplemente clona el repo y abre `index.html`:

```bash
git clone https://github.com/Davidcode-ai/portfolio-2026.git
cd portfolio-2026

# Opción A — abrir directamente
start index.html          # Windows
open index.html           # macOS

# Opción B — servidor local (recomendado para evitar CORS en fuentes)
python -m http.server 8080
# → http://localhost:8080
```

> **Nota:** Tailwind CSS se carga vía CDN. Necesitas conexión a internet la primera vez. Para uso offline, descarga Tailwind CLI y genera el CSS estático.

---

## Secciones en detalle

### 1. Hero — Terminal Emulator
Simula una ventana de terminal macOS con los tres botones de control (rojo, amarillo, verde). Al cargar la página se ejecuta automáticamente:

1. Efecto de escritura del comando `curl -X GET .../api/profile` (45 ms/carácter)
2. Pausa de 400 ms simulando latencia de red
3. Fade-in del bloque JSON con mis datos de perfil coloreados con syntax highlighting

### 2. Interactive API Console
Réplica visual de Postman / Swagger con datos reales de mis proyectos:

- **`GET /projects/solbabackups`** → Metadatos del proyecto SolbaBackups (en producción desde mayo 2026)
- **`GET /skills`** → Stack técnico categorizado por área
- **`POST /contact`** → Simula una respuesta `201 Created` con mis canales de contacto

Cada endpoint muestra: spinner de carga, badge de estado HTTP (`200 OK` / `201 Created`), latency meter con código de color (verde < 80 ms, amarillo < 150 ms, rojo > 150 ms) y JSON con syntax highlighting.

### 3. System Architecture
Diagrama de flujo del sistema [SolbaBackups](https://github.com/Davidcode-ai/solbabackups):

```
[Client] → [FastAPI Server] → [PostgreSQL] → [Google Drive]
```

Implementado en CSS puro (flexbox + SVG inline para las flechas). Cada nodo tiene un tooltip descriptivo y un efecto `glow` neón al pasar el ratón.

### 4. About Me
Sección biográfica con stack pills y tarjetas de hobbies (Calistenia, Kawasaki H2R, AI/LLMs, Clean Code). Panel "Currently" con estado en tiempo real de lo que estoy construyendo, aprendiendo y explorando.

---

## Proyectos relacionados

| Proyecto | Descripción | Repo |
|---|---|---|
| **SolbaBackups** | Sistema de backup automatizado — FastAPI + PostgreSQL + Google Drive API | [Davidcode-ai/solbabackups](https://github.com/Davidcode-ai/solbabackups) |

---

## Rendimiento

El portfolio carga sin JavaScript bloqueante. Las únicas peticiones de red al arrancar son:
1. `cdn.tailwindcss.com` — Tailwind CDN (~30 KB gzip)
2. `fonts.googleapis.com` — Inter + JetBrains Mono (2 familias)

Todo el JavaScript de la interactividad es Vanilla, sin bundler ni transpilación.

---

## Contacto

| Canal | Enlace |
|---|---|
| Email | [davidmv030306@gmail.com](mailto:davidmv030306@gmail.com) |
| GitHub | [github.com/Davidcode-ai](https://github.com/Davidcode-ai) |
| LinkedIn | [David Muñoz Valdés](https://www.linkedin.com/in/david-muñoz-valdés-8b26932b8/) |

---

<div align="center">
  <sub>© 2026 David Muñoz Valdés — Construido sin frameworks, con demasiada cafeína y muchas ganas.</sub>
</div>
