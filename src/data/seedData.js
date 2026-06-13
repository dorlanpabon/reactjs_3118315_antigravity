export const seedData = {
  cursos: [
    {
      id: "cur-des-soft",
      nombre: "Análisis y Desarrollo de Software",
      ficha: "2834912",
      descripcion: "Formación integral en programación web, bases de datos y arquitectura de software.",
      instructorId: "inst-1",
      createdAt: "2026-01-10T08:00:00Z"
    },
    {
      id: "cur-dis-multi",
      nombre: "Diseño e Integración Multimedia",
      ficha: "2845920",
      descripcion: "Creación de experiencias digitales interactivas, modelado 3D e interfaces de usuario (UI/UX).",
      instructorId: "inst-1",
      createdAt: "2026-01-12T08:00:00Z"
    },
    {
      id: "cur-redes-datos",
      nombre: "Gestión de Redes de Datos",
      ficha: "2811345",
      descripcion: "Administración, configuración y seguridad en infraestructuras de red y telecomunicaciones.",
      instructorId: "inst-2",
      createdAt: "2026-01-15T08:00:00Z"
    }
  ],
  usuarios: [
    {
      id: "inst-1",
      nombre: "Ing. Carlos Mendoza",
      email: "instructor@sena.edu.co",
      password: "Sena2024*",
      rol: "instructor",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=carlos",
      createdAt: "2026-01-01T08:00:00Z"
    },
    {
      id: "inst-2",
      nombre: "Dra. Sofía Rincón",
      email: "admin@sena.edu.co",
      password: "Sena2024*",
      rol: "instructor",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=sofia",
      createdAt: "2026-01-01T08:00:00Z"
    },
    // Aprendices Desarrollo de Software
    {
      id: "ap-1",
      nombre: "Juan Pérez García",
      email: "juan.perez@sena.edu.co",
      password: "Sena2024*",
      rol: "aprendiz",
      cursoId: "cur-des-soft",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=juan",
      createdAt: "2026-02-01T09:00:00Z"
    },
    {
      id: "ap-2",
      nombre: "María Gómez Restrepo",
      email: "maria.gomez@sena.edu.co",
      password: "Sena2024*",
      rol: "aprendiz",
      cursoId: "cur-des-soft",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=maria",
      createdAt: "2026-02-01T09:15:00Z"
    },
    {
      id: "ap-3",
      nombre: "Diego Torres Beltrán",
      email: "diego.torres@sena.edu.co",
      password: "Sena2024*",
      rol: "aprendiz",
      cursoId: "cur-des-soft",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=diego",
      createdAt: "2026-02-02T10:00:00Z"
    },
    {
      id: "ap-4",
      nombre: "Laura Castro Ortiz",
      email: "laura.castro@sena.edu.co",
      password: "Sena2024*",
      rol: "aprendiz",
      cursoId: "cur-des-soft",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=laura",
      createdAt: "2026-02-02T10:30:00Z"
    },
    // Aprendices Diseño Multimedia
    {
      id: "ap-5",
      nombre: "Andrés Felipe Silva",
      email: "andres.silva@sena.edu.co",
      password: "Sena2024*",
      rol: "aprendiz",
      cursoId: "cur-dis-multi",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=andres",
      createdAt: "2026-02-05T09:00:00Z"
    },
    {
      id: "ap-6",
      nombre: "Camila Rojas Duarte",
      email: "camila.rojas@sena.edu.co",
      password: "Sena2024*",
      rol: "aprendiz",
      cursoId: "cur-dis-multi",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=camila",
      createdAt: "2026-02-05T09:40:00Z"
    },
    {
      id: "ap-7",
      nombre: "Santiago Patiño",
      email: "santiago.patino@sena.edu.co",
      password: "Sena2024*",
      rol: "aprendiz",
      cursoId: "cur-dis-multi",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=santiago",
      createdAt: "2026-02-06T11:00:00Z"
    },
    // Aprendices Redes de Datos
    {
      id: "ap-8",
      nombre: "Esteban Henao",
      email: "esteban.henao@sena.edu.co",
      password: "Sena2024*",
      rol: "aprendiz",
      cursoId: "cur-redes-datos",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=esteban",
      createdAt: "2026-02-10T09:00:00Z"
    },
    {
      id: "ap-9",
      nombre: "Valentina Ospina",
      email: "valentina.ospina@sena.edu.co",
      password: "Sena2024*",
      rol: "aprendiz",
      cursoId: "cur-redes-datos",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=valentina",
      createdAt: "2026-02-10T09:30:00Z"
    },
    {
      id: "ap-10",
      nombre: "Mateo Villamil",
      email: "mateo.villamil@sena.edu.co",
      password: "Sena2024*",
      rol: "aprendiz",
      cursoId: "cur-redes-datos",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=mateo",
      createdAt: "2026-02-11T10:00:00Z"
    }
  ],
  actividades: [
    // Actividades Desarrollo de Software
    {
      id: "act-soft-1",
      cursoId: "cur-des-soft",
      titulo: "Evidencia 1: Diagrama de Clases y Casos de Uso",
      descripcion: "Crear un documento detallado con el diseño conceptual de la arquitectura de software, incluyendo diagramas UML estructurados.",
      competencia: "Diseñar la arquitectura de software de acuerdo con los requisitos.",
      fechaLimite: "2026-06-05T23:59:59Z", // Overdue
      puntajeMaximo: 100,
      criteriosRubrica: [
        "Identificación de actores y casos de uso del sistema",
        "Diseño correcto de relaciones y multiplicidad en clases UML",
        "Documentación técnica y ortografía"
      ]
    },
    {
      id: "act-soft-2",
      cursoId: "cur-des-soft",
      titulo: "Evidencia 2: Maquetación y Prototipado UX/UI",
      descripcion: "Diseñar los wireframes interactivos para la aplicación en Figma o similar y documentar los flujos de navegación.",
      competencia: "Diseñar interfaces gráficas de usuario integrando estándares y accesibilidad.",
      fechaLimite: "2026-06-18T23:59:59Z", // Future
      puntajeMaximo: 100,
      criteriosRubrica: [
        "Consistencia visual e identidad gráfica",
        "Facilidad de uso y navegación responsiva",
        "Interactividad y presentación del prototipo"
      ]
    },
    {
      id: "act-soft-3",
      cursoId: "cur-des-soft",
      titulo: "Evidencia 3: Base de Datos Relacional SQL",
      descripcion: "Crear el script DDL e insertar datos semilla, incluyendo llaves primarias, foráneas e índices optimizados en MySQL/PostgreSQL.",
      competencia: "Implementar la base de datos de acuerdo con el diseño técnico.",
      fechaLimite: "2026-06-25T23:59:59Z", // Future
      puntajeMaximo: 100,
      criteriosRubrica: [
        "Normalización del modelo relacional (hasta 3FN)",
        "Creación de llaves, restricciones e índices",
        "Consultas complejas utilizando JOINs y agregaciones"
      ]
    },
    {
      id: "act-soft-4",
      cursoId: "cur-des-soft",
      titulo: "Evidencia 4: Desarrollo de API REST con Node.js",
      descripcion: "Crear una API RESTful funcional con rutas para CRUD, manejo de estados y middlewares de autenticación.",
      competencia: "Desarrollar la estructura lógica del software según requerimientos de codificación.",
      fechaLimite: "2026-07-10T23:59:59Z", // Future
      puntajeMaximo: 100,
      criteriosRubrica: [
        "Rutas e implementación lógica de métodos HTTP",
        "Middlewares de validación y manejo de errores",
        "Conexión con base de datos e integración segura"
      ]
    },

    // Actividades Diseño Multimedia
    {
      id: "act-multi-1",
      cursoId: "cur-dis-multi",
      titulo: "Evidencia 1: Guion Técnico de Video Promocional",
      descripcion: "Redactar el guion técnico y literario estructurado por escenas con tiempos, audios y descripciones gráficas.",
      competencia: "Planear la producción del proyecto multimedia de acuerdo con el guion.",
      fechaLimite: "2026-06-03T23:59:59Z", // Overdue
      puntajeMaximo: 100,
      criteriosRubrica: [
        "Estructura narrativa y coherencia con la marca",
        "Detalle de audios, locución y efectos de sonido",
        "Especificación técnica visual"
      ]
    },
    {
      id: "act-multi-2",
      cursoId: "cur-dis-multi",
      titulo: "Evidencia 2: Ilustración Vectorial en Illustrator",
      descripcion: "Diseñar el set de personajes vectoriales y recursos de interfaz con escalabilidad perfecta.",
      competencia: "Ilustrar elementos vectoriales integrando principios de composición.",
      fechaLimite: "2026-06-20T23:59:59Z",
      puntajeMaximo: 100,
      criteriosRubrica: [
        "Uso de la pluma y herramientas de vectores",
        "Armonía cromática y teoría del color",
        "Originalidad y limpieza de trazo"
      ]
    },

    // Actividades Redes de Datos
    {
      id: "act-redes-1",
      cursoId: "cur-redes-datos",
      titulo: "Evidencia 1: Diseño de Topología en Cisco Packet Tracer",
      descripcion: "Simular una red corporativa con subredes VLSM, routers, switches, DHCP y servidores activos.",
      competencia: "Diseñar la infraestructura física y lógica de la red.",
      fechaLimite: "2026-06-08T23:59:59Z", // Overdue
      puntajeMaximo: 100,
      criteriosRubrica: [
        "Cálculo e implementación de direccionamiento VLSM",
        "Configuración básica de routers y switches",
        "Conectividad y simulación de ping exitosa"
      ]
    },
    {
      id: "act-redes-2",
      cursoId: "cur-redes-datos",
      titulo: "Evidencia 2: Configuración de Enrutamiento Dinámico OSPF",
      descripcion: "Configurar el protocolo OSPF multiárea en tres routers de frontera y verificar las tablas de enrutamiento.",
      competencia: "Configurar los dispositivos activos de red según la topología lógica.",
      fechaLimite: "2026-06-22T23:59:59Z",
      puntajeMaximo: 100,
      criteriosRubrica: [
        "Asignación correcta de IDs de router y áreas OSPF",
        "Verificación de adyacencias y rutas dinámicas",
        "Redundancia y tolerancia a fallos"
      ]
    }
  ],
  evidencias: [
    // Evidencias Entregadas y Calificadas
    {
      id: "ev-1",
      actividadId: "act-soft-1",
      aprendizId: "ap-1", // Juan Perez
      contenidoTexto: "Profesor, adjunto el diagrama de casos de uso y diagrama de clases del proyecto de E-commerce. Utilicé la herramienta Lucidchart y añadí todas las relaciones con multiplicidad y herencia.",
      adjuntoNombre: "diagrama_arquitectura_ecom.pdf",
      adjuntoBase64: "data:application/pdf;base64,JVBERi0xLjQKJ...",
      enlaceExterno: "https://lucid.app/lucidchart/invitation/accept/...",
      estado: "aprobado",
      calificacionRubrica: {
        "Identificación de actores y casos de uso del sistema": 4, // Excelente
        "Diseño correcto de relaciones y multiplicidad en clases UML": 3, // Alto
        "Documentación técnica y ortografía": 4 // Excelente
      },
      notaFinal: 92,
      retroalimentacion: "Muy buen diagrama. Las entidades e interfaces del dominio están bien planteadas. Buen uso de relaciones de composición y agregación. Felicitaciones.",
      instructorId: "inst-1",
      fechaEntrega: "2026-06-04T15:30:00Z",
      fechaCalificacion: "2026-06-06T10:00:00Z",
      entregaTardia: false
    },
    {
      id: "ev-2",
      actividadId: "act-soft-1",
      aprendizId: "ap-2", // María Gómez
      contenidoTexto: "Subo mi primer entregable de diagramas. Me costó entender la herencia en base de datos pero hice mi mejor esfuerzo.",
      adjuntoNombre: "UML_Gomez.pdf",
      adjuntoBase64: "",
      enlaceExterno: "",
      estado: "deficiente",
      calificacionRubrica: {
        "Identificación de actores y casos de uso del sistema": 2, // Básico
        "Diseño correcto de relaciones y multiplicidad en clases UML": 1, // Bajo
        "Documentación técnica y ortografía": 2 // Básico
      },
      notaFinal: 45,
      retroalimentacion: "María, el diagrama de clases carece de atributos y métodos. Asimismo, la multiplicidad está al revés en la relación Cliente-Pedido. Revisa el material de apoyo de la semana 2 y vuelve a subir la evidencia modificada.",
      instructorId: "inst-1",
      fechaEntrega: "2026-06-05T20:45:00Z",
      fechaCalificacion: "2026-06-07T11:20:00Z",
      entregaTardia: false
    },
    // Evidencias por Calificar (Pendientes)
    {
      id: "ev-3",
      actividadId: "act-soft-1",
      aprendizId: "ap-3", // Diego Torres
      contenidoTexto: "Profesor Mendoza, subo mi evidencia sobre el modelado UML para el proyecto de gimnasios. Añadí la generalización para perfiles de usuario y las agregaciones de planes de suscripción.",
      adjuntoNombre: "Gym_UML_Diego.pdf",
      adjuntoBase64: "data:application/pdf;base64,JVBERi0xLjQKJ...",
      enlaceExterno: "https://github.com/diego-torres/gym-uml",
      estado: "pendiente",
      calificacionRubrica: {},
      notaFinal: 0,
      retroalimentacion: "",
      instructorId: "",
      fechaEntrega: "2026-06-11T18:15:00Z",
      fechaCalificacion: "",
      entregaTardia: true // Actividad vencía el 5 de Junio
    },
    {
      id: "ev-4",
      actividadId: "act-soft-1",
      aprendizId: "ap-4", // Laura Castro
      contenidoTexto: "Adjunto el enlace y reporte de mi diagrama de clases y casos de uso de la app de delivery. Quedo atenta a comentarios.",
      adjuntoNombre: "Delivery_UML_Castro.pdf",
      adjuntoBase64: "",
      enlaceExterno: "https://www.figma.com/file/delivery-uml",
      estado: "pendiente",
      calificacionRubrica: {},
      notaFinal: 0,
      retroalimentacion: "",
      instructorId: "",
      fechaEntrega: "2026-06-12T14:10:00Z",
      fechaCalificacion: "",
      entregaTardia: true
    },
    {
      id: "ev-5",
      actividadId: "act-multi-1",
      aprendizId: "ap-5", // Andres Silva
      contenidoTexto: "Adjunto el storyboard y el guion técnico del video promocional sobre turismo ecológico.",
      adjuntoNombre: "Storyboard_TurismoEco.pdf",
      adjuntoBase64: "",
      enlaceExterno: "",
      estado: "pendiente",
      calificacionRubrica: {},
      notaFinal: 0,
      retroalimentacion: "",
      instructorId: "",
      fechaEntrega: "2026-06-03T10:00:00Z",
      fechaCalificacion: "",
      entregaTardia: false
    },
    {
      id: "ev-6",
      actividadId: "act-redes-1",
      aprendizId: "ap-8", // Esteban Henao
      contenidoTexto: "Adjunto el archivo .pkt de Cisco Packet Tracer con la topología de red configurada según la ficha técnica.",
      adjuntoNombre: "RedCorp_Vlsm.pkt",
      adjuntoBase64: "",
      enlaceExterno: "",
      estado: "pendiente",
      calificacionRubrica: {},
      notaFinal: 0,
      retroalimentacion: "",
      instructorId: "",
      fechaEntrega: "2026-06-07T21:00:00Z",
      fechaCalificacion: "",
      entregaTardia: false
    }
  ],
  notificaciones: [
    {
      id: "not-1",
      usuarioId: "ap-1",
      mensaje: "Tu evidencia 'Evidencia 1: Diagrama de Clases y Casos de Uso' ha sido Calificada (Aprobado: 92/100).",
      leida: false,
      tipo: "calificacion",
      createdAt: "2026-06-06T10:00:00Z"
    },
    {
      id: "not-2",
      usuarioId: "ap-2",
      mensaje: "Tu evidencia 'Evidencia 1: Diagrama de Clases y Casos de Uso' ha sido Calificada (Deficiente: 45/100). Revisa las correcciones.",
      leida: false,
      tipo: "calificacion",
      createdAt: "2026-06-07T11:20:00Z"
    },
    {
      id: "not-3",
      usuarioId: "inst-1",
      mensaje: "Diego Torres ha entregado la evidencia 'Evidencia 1: Diagrama de Clases y Casos de Uso'.",
      leida: false,
      tipo: "entrega",
      createdAt: "2026-06-11T18:15:00Z"
    }
  ]
};
