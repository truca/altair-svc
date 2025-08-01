# Sistema Alumbra - Pantallas y Flujos de Usuario

## 1. Clientes y Roles

### **Alumno**

- Responde check-ins diarios a través del chat
- Solicita ayuda cuando la necesita (botón siempre accesible)
- Ve su historial emocional personal

### **Padre/Madre**

- Monitorea el bienestar de su hijo/a
- Accede a chat para consultas sobre el estado de sus hijos
- Gestiona consentimientos y permisos

### **Profesor/a de curso**

- Observa el estado de su clase
- Recibe alertas y escala casos
- Accede a chat para consultas sobre alumnos específicos

### **Orientador(a)/Psicólogo(a)**

- Gestiona casos escalados
- Registra intervenciones y da seguimiento
- Analiza tendencias y patrones

### **Administrativo del colegio**

- Administra consentimientos, usuarios y reportes
- Gestiona planes contratados
- Sin acceso al chat (solo gestión administrativa)

### **Administrador de la empresa (Symbiosis)**

- Configura parámetros globales, escuelas y roles
- Gestiona formularios y encuestas
- Supervisa métricas agregadas del sistema

### **Usuario Público (Sin Login)**

- Accede a alertas anónimas para casos de emergencia
- Reporta situaciones urgentes sin identificación

## 2. Pantallas por Cliente

### **Página Pública (Sin Login)**

| Pantalla           | Prioridad | Objetivo                                | Features | Componentes                                         | Flujos                                           | Datos                           |
| ------------------ | --------- | --------------------------------------- | -------- | --------------------------------------------------- | ------------------------------------------------ | ------------------------------- |
| **Alerta Anónima** | Crítica   | Reportar emergencias sin identificación | F13      | Formulario simple, tipos de emergencia, descripción | URL pública → selecciona tipo → describe → envía | Alerta inmediata a orientadores |

### **Alumno**

| Pantalla           | Prioridad | Objetivo                                 | Features   | Componentes                                                 | Flujos                                       | Datos                                   |
| ------------------ | --------- | ---------------------------------------- | ---------- | ----------------------------------------------------------- | -------------------------------------------- | --------------------------------------- |
| **Chat Principal** | Alta      | Check-ins diarios y solicitudes de ayuda | F1, F2     | Selector emoji (5), pregunta Likert, botón "Necesito ayuda" | App abre → chat → responde check-in          | Nueva entrada → puntuación de bienestar |
| **Mi Estado**      | Media     | Ver historial emocional personal         | F3, F4, F5 | Gráfico línea 7 días, indicadores de tendencia              | Chat → "Ver mi estado"                       | Serie diaria, puntuación de bienestar   |
| **Botón de Ayuda** | Crítica   | Acceso permanente a ayuda                | F2         | Botón flotante siempre visible                              | Cualquier pantalla → botón → ayuda inmediata | Conecta con orientador/bot              |

### **Padre/Madre**

| Pantalla                 | Prioridad | Objetivo                                      | Features | Componentes                                             | Flujos                         | Datos                           |
| ------------------------ | --------- | --------------------------------------------- | -------- | ------------------------------------------------------- | ------------------------------ | ------------------------------- |
| **Estado de mi Hijo/a**  | Alta      | Ver riesgo actual y últimas alertas           | F6, F8   | Semáforo prominente, lista alertas, botón detalles      | Landing → ve estado → detalles | Puntuación, último check-in     |
| **Chat de Consultas**    | Alta      | Preguntas sobre bienestar de hijos            | F6, F8   | Chat con bot, consultas específicas                     | Estado → chat → pregunta       | Respuestas contextuales         |
| **Historial & Permisos** | Media     | Revisar evolución y gestionar consentimientos | F10, F12 | Gráfico histórico, toggle consent, tabla intervenciones | Estado → "Ver historial"       | Ventanas 3/7 días, log acciones |

### **Profesor/a de curso**

| Pantalla               | Prioridad | Objetivo                                   | Features   | Componentes                                   | Flujos                    | Datos                                         |
| ---------------------- | --------- | ------------------------------------------ | ---------- | --------------------------------------------- | ------------------------- | --------------------------------------------- |
| **Dashboard de Clase** | Alta      | Panorama de estado por alumno              | F3–F6, F10 | Lista con indicadores, filtros, search        | Home → select clase       | Puntuaciones de bienestar, días sin responder |
| **Estado de Alumnos**  | Alta      | Lista detallada de alumnos con indicadores | F4, F6     | Tabla con semáforos, tendencias, alertas      | Dashboard → lista alumnos | Indicadores por alumno                        |
| **Ficha Alumno**       | Media     | Detalle individual y escalamiento          | F4, F6, F9 | Timeline, botón "Escalar a Orientador"        | Lista → ficha alumno      | Score, historial, log notas                   |
| **Chat de Consultas**  | Media     | Preguntas sobre alumnos específicos        | F6, F8     | Chat con bot, consultas contextuales          | Ficha → chat → pregunta   | Respuestas sobre alumno                       |
| **Bandeja de Alertas** | Alta      | Gestionar alertas diarias                  | F7, F8     | Lista collapsible, badge color, CTA "Escalar" | Dashboard → "Alertas"     | Alerta consolidada/día                        |

### **Orientador(a)/Psicólogo(a)**

| Pantalla                  | Prioridad | Objetivo                               | Features    | Componentes                                 | Flujos                   | Datos                       |
| ------------------------- | --------- | -------------------------------------- | ----------- | ------------------------------------------- | ------------------------ | --------------------------- |
| **Cola de Alertas**       | Alta      | Ver casos escalados                    | F7, F8, F9  | Tabla, filtros riesgo, CTA "Abrir caso"     | Login orientador → cola  | Lista consolidada           |
| **Detalle Alumno & Log**  | Alta      | Registrar intervención y cerrar alerta | F4, F6, F11 | Form "Acción tomada", timeline, cerrar caso | Cola → detalle → guardar | Score, log previo, acciones |
| **Reporte de Tendencias** | Media     | Analizar patrones por curso/escuela    | F3–F6       | Gráficos línea/heatmap, export CSV          | Menú → "Tendencias"      | Agregados, ventanas móviles |

### **Administrativo del colegio**

| Pantalla                       | Prioridad | Objetivo                              | Features   | Componentes                               | Flujos                      | Datos                   |
| ------------------------------ | --------- | ------------------------------------- | ---------- | ----------------------------------------- | --------------------------- | ----------------------- |
| **Dashboard General**          | Alta      | Vista administrativa del colegio      | F3–F6, F10 | KPIs, métricas agregadas, alertas         | Login → dashboard           | Indicadores generales   |
| **Gestión de Consentimientos** | Alta      | Mantener consentimientos actualizados | F12        | Tabla alumnos, estado, bulk actions       | Dashboard → consentimientos | Consent logs            |
| **Reportes de Cumplimiento**   | Media     | Ver métricas de respuesta y ausencias | F5, F10    | KPIs cards, indicadores por clase, export | Menú → reportes             | % respuesta, históricos |
| **Gestión de Planes**          | Media     | Configurar servicios contratados      | F12        | Lista planes, configuración, activación   | Dashboard → planes          | Datos de planes         |

### **Administrador de la empresa (Symbiosis)**

| Pantalla                        | Prioridad | Objetivo                      | Features   | Componentes                          | Flujos                   | Datos                   |
| ------------------------------- | --------- | ----------------------------- | ---------- | ------------------------------------ | ------------------------ | ----------------------- |
| **Dashboard de Organizaciones** | Alta      | Estado general del sistema    | F3–F6, F10 | KPIs globales, métricas agregadas    | Login → dashboard global | Indicadores del sistema |
| **Gestión de Escuelas**         | Alta      | Alta/baja colegios y roles    | F12        | Wizard creación, tabla RBAC          | Sidebar → "Escuelas"     | Datos org, permisos     |
| **Gestión de Formularios**      | Alta      | CRUD de encuestas y preguntas | F12        | Formularios, preguntas, alternativas | Sidebar → "Formularios"  | Encuestas, preguntas    |
| **Asignación de Planes**        | Alta      | Configurar encuestas por plan | F12        | Matriz plan-encuesta, activación     | Formularios → asignación | Plan-encuesta mapping   |
| **Auditoría del Sistema**       | Media     | Trazabilidad y logs globales  | F11        | Tabla eventos, filtro fecha          | Sidebar → "Auditoría"    | Eventos backend         |

## 3. Componentes de Chat y Ayuda

### **Chat para Alumnos**

- **Check-in diario**: Pregunta con emojis ( 🙂 😐 😟 😭)
- **Solicitud de ayuda**: Botón "Necesito hablar"
- **Historial**: Gráfico simple de últimos 7 días

### **Chat para Padres**

- **Consultas**: "¿Cómo está mi hijo hoy?"
- **Alertas**: Notificaciones de cambios importantes
- **Consentimientos**: Gestión de permisos

### **Chat para Profesores**

- **Consultas**: "¿Cómo está [alumno]?"
- **Alertas**: Notificaciones de casos urgentes
- **Reportes**: Solicitud de información específica

### **Botón de Ayuda (Alumnos)**

- **Posición**: Flotante, esquina inferior derecha
- **Accesibilidad**: Siempre visible, sin restricciones
- **Funcionalidad**: Conecta con orientador o bot de emergencia
- **Diseño**: Círculo rojo con ícono de ayuda (🆘)

### **Alerta Anónima (Página Pública)**

- **Acceso**: URL pública sin autenticación
- **Tipos de emergencia**:
  - Bullying o acoso
  - Crisis emocional
  - Violencia o amenazas
  - Abuso o negligencia
  - Otros casos urgentes
- **Formulario simple**:
  - Tipo de emergencia (dropdown)
  - Descripción breve (textarea)
  - Ubicación aproximada (opcional)
  - Contacto de emergencia (opcional)
- **Notificación**: Alerta inmediata a orientadores del colegio

## 4. Indicadores Simplificados

### **En lugar de "Z-score"**

- **"Puntuación de bienestar"**: Verde (bien), Amarillo (atención), Rojo (urgente)
- **"Tendencia"**: Mejorando ↔ Estable ↔ Empeorando

### **En lugar de "Gap ratio"**

- **"Días sin responder"**: 0-2 días (verde), 3-5 días (amarillo), 6+ días (rojo)
- **"Frecuencia de respuesta"**: Alta ↔ Media ↔ Baja

### **En lugar de "Risk level"**

- **"Nivel de alerta"**: Sin alerta ↔ Atención ↔ Urgente
- **"Estado general"**: Bien ↔ Necesita apoyo ↔ Necesita intervención

## 5. Flujos de Usuario

### **Flujo Alumno**

1. Abre app → Chat principal
2. Responde check-in diario
3. Si necesita ayuda → Botón "Necesito ayuda" (siempre disponible)
4. Ve su historial personal

### **Flujo Emergencia Anónima**

1. Accede a URL pública
2. Selecciona tipo de emergencia
3. Describe situación
4. Envía reporte anónimo
5. Orientadores reciben alerta inmediata

### **Flujo Padre**

1. Abre app → Ve estado de hijo
2. Si hay alerta → Chat para consultar
3. Gestiona consentimientos
4. Ve historial de evolución

### **Flujo Profesor**

1. Abre app → Dashboard de clase
2. Ve alertas prioritarias
3. Selecciona alumno → Ve ficha detallada
4. Usa chat para consultas específicas

### **Flujo Administrativo (Colegio)**

1. Abre app → Dashboard general
2. Gestiona consentimientos
3. Revisa reportes de cumplimiento
4. Configura planes contratados

### **Flujo Administrativo (Symbiosis)**

1. Abre app → Dashboard de organizaciones
2. Gestiona formularios y preguntas
3. Asigna encuestas a planes
4. Monitorea métricas del sistema

## 6. Matriz de Cobertura F1–F13

| Pantalla                       | F1  | F2  | F3  | F4  | F5  | F6  | F7  | F8  | F9  | F10 | F11 | F12 | F13 |
| ------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Alerta Anónima                 | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  |
| Chat Principal (Alumno)        | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  |
| Mi Estado                      | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  |
| Botón de Ayuda                 | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  |
| Estado de mi Hijo/a            | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✔︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  |
| Chat de Consultas (Padres)     | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  |
| Historial & Permisos           | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✔︎  | ✖︎  |
| Dashboard de Clase             | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  |
| Estado de Alumnos              | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  |
| Ficha Alumno                   | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  |
| Chat de Consultas (Profesores) | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  |
| Bandeja de Alertas             | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  |
| Cola de Alertas                | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  |
| Detalle & Log                  | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  |
| Reporte de Tendencias          | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  |
| Dashboard General (Admin)      | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  |
| Gestión de Consentimientos     | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  |
| Reportes de Cumplimiento       | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  |
| Gestión de Planes              | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  |
| Dashboard de Organizaciones    | ✖︎  | ✖︎  | ✔︎  | ✔︎  | ✔︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  | ✖︎  |
| Gestión de Escuelas            | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  |
| Gestión de Formularios         | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  |
| Asignación de Planes           | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  |
| Auditoría del Sistema          | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✖︎  | ✔︎  | ✖︎  | ✖︎  |

## 7. Consideraciones de UX

### **Lenguaje Simple**

- "Métricas" → "Indicadores"
- "Análisis" → "Revisión"
- "Configuración" → "Ajustes"
- "Auditoría" → "Registro de actividades"

### **Colores Intuitivos**

- Verde: Todo bien
- Amarillo: Atención
- Rojo: Urgente
- Azul: Informativo

### **Iconografía Clara**

- 📊 Gráficos
- ⚠️ Alertas
- 💬 Chat
- 👥 Usuarios
- 📋 Reportes
- 🆘 Ayuda de emergencia

### **Accesibilidad de Emergencia**

- **Botón de ayuda**: Siempre visible, sin restricciones
- **Alerta anónima**: Acceso directo desde cualquier dispositivo
- **Respuesta inmediata**: Conecta con recursos de emergencia
- **Protección de identidad**: Reportes sin datos personales

### **Hallazgos / Riesgos UX**

- **Sobrecarga de información docente**: Usar filtros y badges para priorizar
- **Privacidad sensible**: Vista mínima para padres, no exponer métricas de otros alumnos
- **Accesibilidad móvil**: Emojis grandes y contrastados, descripciones ARIA
- **Flujo de escalamiento**: Debe ser un clic, evitar demoras
- **Sincronía 05 AM**: Mostrar estado "procesando" hasta que las alertas estén listas
- **Consentimiento granular**: Confirm dialogs para prevenir errores masivos
- **Emergencias anónimas**: Respuesta inmediata, protección de identidad
- **Botón de ayuda**: Siempre accesible, sin restricciones técnicas
