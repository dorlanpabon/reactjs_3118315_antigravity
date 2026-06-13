# 🟢 Portal de Calificación de Evidencias - SENA
### Aplicación Web Interactiva para Instructores y Aprendices

Este proyecto es una plataforma web (Single Page Application) desarrollada en **React.js** y **Vite** diseñada para la gestión, entrega y calificación de evidencias formativas en el SENA. Implementa una base de datos local simulada en el navegador (`localStorage`) para que todas las operaciones de registro, inicio de sesión, carga de archivos, evaluación por rúbrica interactiva y analíticas sean **100% funcionales sin necesidad de configurar servidores externos**.

---

## 🛠️ Tecnologías Utilizadas

- **React.js 18**: Framework para la interfaz interactiva.
- **Vite**: Compilador y empaquetador de alto rendimiento para desarrollo ágil.
- **React Router DOM v6**: Administrador de navegación entre las vistas.
- **Lucide React**: Biblioteca de iconos vectoriales modernos.
- **Vanilla CSS (Glassmorphism)**: Diseño visual premium oscuro con efectos de transparencia y desenfoque, adaptado a dispositivos móviles y optimizado para impresión.

---

## 📂 Estructura General del Proyecto

A continuación se detalla la ubicación de los archivos clave para los desarrolladores interesados en auditar o expandir el código:

- [index.css](file:///d:/xampp/htdocs/reactjs_3118315_antigravity/src/index.css): Contiene todo el sistema de diseño global, variables de color neón, animaciones de entrada, estilos de tablas premium y directivas de impresión `@media print`.
- [AppContext.jsx](file:///d:/xampp/htdocs/reactjs_3118315_antigravity/src/context/AppContext.jsx): Administrador del estado de la aplicación. Comunica los cambios entre las vistas del aprendiz y del instructor y guarda los datos en el navegador.
- [mockDb.js](file:///d:/xampp/htdocs/reactjs_3118315_antigravity/src/data/mockDb.js): Capa de persistencia local que lee y escribe de forma estructurada en el `localStorage`.
- [seedData.js](file:///d:/xampp/htdocs/reactjs_3118315_antigravity/src/data/seedData.js): Generador de base de datos inicial con 3 cursos, 2 instructores, 10 aprendices y ~40 evidencias previas para poblar los gráficos de analíticas inmediatamente al iniciar la app.
- [App.jsx](file:///d:/xampp/htdocs/reactjs_3118315_antigravity/src/App.jsx): Administrador central de enrutamiento y accesos restringidos por rol de usuario.

---

## 🚀 Guía de Instalación (Para Perfiles Técnicos)

Si tienes conocimientos técnicos y deseas correr la aplicación en tu entorno de desarrollo, sigue estos pasos:

### Requisitos Previos
- Tener instalado **Node.js** (versión 16 o superior recomendada). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

### Pasos de Instalación
1. **Descargar y extraer el proyecto**: Descarga el código fuente y extrae su contenido en tu carpeta de preferencia.
2. **Abrir la consola/terminal**: Navega hasta la carpeta del proyecto en tu terminal.
3. **Instalar dependencias**: Ejecuta el comando para descargar los paquetes necesarios:
   ```bash
   npm install
   ```
4. **Iniciar servidor de desarrollo**: Lanza la aplicación local ejecutando:
   ```bash
   npm run dev
   ```
5. **Acceder a la app**: Abre tu navegador e ingresa a la dirección que te proporcione la terminal (comúnmente `http://localhost:5173`).

---

## 👥 Guía de Uso Rápido (Para Usuarios No Técnicos)

Si deseas probar la aplicación sin tocar código ni instalar herramientas complejas, ¡no te preocupes! El portal cuenta con herramientas para hacer tu experiencia lo más fácil posible:

### 1. Acceso a la Plataforma
- Al abrir la página web, verás la pantalla de **Inicio de Sesión**.
- Verás una sección llamada **"Cuentas de Prueba (Demo)"** con dos botones:
  - **Demo Instructor**: Si haces clic, se rellenarán automáticamente los datos de un instructor de pruebas. Haz clic en **Iniciar Sesión** para acceder al panel administrativo.
  - **Demo Aprendiz**: Si haces clic, se rellenarán automáticamente los datos de un aprendiz de pruebas. Haz clic en **Iniciar Sesión** para acceder al panel de estudiante.

### 2. Flujo del Aprendiz (Subir Tareas)
1. Inicia sesión con la cuenta de **Aprendiz Demo** (o regístrate con una cuenta nueva seleccionando tu curso).
2. En la pestaña **"Actividades por Entregar"**, verás las tareas asignadas a tu ficha formativa.
3. Haz clic en **"Subir Evidencia"** en cualquiera de las actividades disponibles.
4. Escribe un comentario sobre tu entrega, añade un enlace de repositorio (ej. GitHub/Drive) y escribe el nombre del archivo (ej. `tarea_arquitectura.zip`).
5. Haz clic en **"Enviar Evidencia"**. ¡Listo! Tu entrega ha sido registrada en el sistema.
6. Ve a la pestaña **"Mis Evidencias Enviadas"** para ver su estado actual ("Pendiente").

### 3. Flujo del Instructor (Calificar y Reportes)
1. Cierra sesión e ingresa con la cuenta de **Instructor Demo**.
2. En el panel principal (Dashboard), verás de forma interactiva las estadísticas de tus alumnos y dos gráficos SVG con los promedios de notas y estados generales.
3. En la sección inferior o a través del menú lateral en **"Calificar Evidencias"**, verás la entrega realizada por el aprendiz.
4. Haz clic en el botón **"Calificar"** para abrir el área de evaluación.
5. **Rúbrica Interactiva**: Selecciona una nota del 1 al 4 para cada criterio. Verás cómo la nota final sobre 100 se recalcula al instante en la pantalla.
6. Agrega un comentario técnico en la caja de comentarios (puedes hacer clic en los botones de plantilla rápida como *"Excelente"* o *"Deficiente"* para autocompletar el texto).
7. Haz clic en **"Guardar y Notificar Calificación"**. El estado cambiará automáticamente y se le enviará una alerta al aprendiz.

### 4. Generación de Reportes e Impresión
1. Haz clic en **"Generar Reportes"** en el menú lateral.
2. Filtra los datos según el curso o ficha que deseas auditar.
3. **Descargar Excel/Planilla**: Haz clic en **"Exportar CSV"** para descargar inmediatamente una hoja de cálculo con el consolidado de notas compatible con Microsoft Excel.
4. **Guardar como PDF**: Haz clic en **"Imprimir Reporte (PDF)"**. Se abrirá la ventana de impresión nativa de tu computadora configurada de forma limpia para guardar el reporte como archivo PDF sin menús ni botones molestos.

---

## 🔑 Cuentas Creadas por Defecto (Seed Accounts)

Puedes registrar tus propios usuarios, pero también puedes usar cualquiera de estos perfiles precargados:

| Rol | Correo Electrónico | Contraseña | Nombre del Usuario |
|---|---|---|---|
| **Instructor principal** | `instructor@sena.edu.co` | `Sena2024*` | Ing. Carlos Mendoza |
| **Instructor secundario** | `admin@sena.edu.co` | `Sena2024*` | Dra. Sofía Rincón |
| **Aprendiz principal** | `juan.perez@sena.edu.co` | `Sena2024*` | Juan Pérez García |
| **Aprendiz secundario** | `maria.gomez@sena.edu.co` | `Sena2024*` | María Gómez Restrepo |

---

## 🔄 Cómo Restablecer la Aplicación
Si has modificado muchas notas, subido datos de prueba o quieres limpiar todo para empezar una presentación desde cero:
1. En la parte superior derecha de la pantalla (cerca del perfil, dentro de la aplicación), haz clic en el botón con el icono de flechas circulares: **"Restablecer Demo"**.
2. Haz clic en **Aceptar** en la ventana flotante de confirmación.
3. La página se recargará y la base de datos se reiniciará a los valores originales predeterminados del SENA.
