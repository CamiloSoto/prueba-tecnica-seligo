# Prueba Técnica: Dashboard de Pronóstico de Demanda

Este proyecto es una implementación simplificada de un dashboard empresarial de pronóstico de demanda, desarrollado con un enfoque profesional para la evaluación técnica.

---

## 📄 Tecnologías Principales

### 📈 Frontend

- React.js (Vite)
- Bootstrap 5
- Formik + Yup (validación de formularios)
- Recharts (gráficos interactivos)
- SweetAlert2 (notificaciones)

### 🤖 Backend

- Node.js + Express.js
- JWT (autenticación segura con refresh token)
- Multer (carga de archivos)
- csv-parser + xlsx + papaparse (lectura de archivos)
- PostgreSQL (persistencia de datos)
- Prisma ORM (migraciones, seeds)

### 📁 DevOps

- Docker + Docker Compose
- Variables de entorno por ambiente
- Health checks y restart policies
- Railway / Render para despliegue con SSL

---

## 🏢 Estructura de Carpetas

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── prisma/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
├── docker-compose.yml
├── .env / .env.production
└── README.md
```

---

## 🚀 Setup Rápido

### 1. Clona el repositorio

```bash
git clone https://github.com/CamiloSoto/prueba-tecnica-seligo.git
cd prueba-tecnica-seligo
```

### 2. Configura variables de entorno

#### Backend `.env`

```
DATABASE_URL=postgresql://usuario:password@db:5432/pronostico
JWT_SECRET=supersecreto
REFRESH_SECRET=superrefresh
```

#### Frontend `.env`

```
VITE_API_URL=http://localhost:4000/api
```

### 3. Levanta el entorno con Docker

```bash
docker-compose up --build
```

### 4. Accede

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:4000/api](http://localhost:4000/api)

---

## 🔒 Credenciales de prueba

```
Usuario: admin@test.com
Contraseña: password123
```

---

## 🔍 Características Destacadas

### ✅ Autenticación Profesional

- JWT con refresh token
- Validación segura con bcrypt

### ✅ Carga de Datos Empresariales

- Upload de CSV o Excel (hasta 10MB)
- Validación progresiva con feedback claro
- Drag & drop con vista previa y wizard

### ✅ Pronóstico Automatizado

- Generación por SKU basada en datos
- Intervalos de confianza (80%, 90%, 95%)
- Datos enriquecidos con tendencia y estacionalidad

### ✅ Visualizaciones Ejecutivas

- Gráficos con bandas de confianza (Recharts)
- Filtros por SKU y fecha
- Exportación del gráfico como PNG o PDF

### ✅ Tablas de Datos Profesionales

- Ordenamiento, filtrado, búsqueda
- Paginación eficiente
- Acciones masivas por selección

---

## 💳 Base de Datos

Tablas principales:

- `users`
- `sales_data`
- `forecasts`
- `configurations`

Scripts:

```bash
npx prisma migrate dev
npx prisma db seed
```

---

## 🔧 Scripts Disponibles

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

---

## 📚 Documentación de la API

Swagger UI: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 📍 Mejoras Futuras

- Implementación real de modelos predictivos (ARIMA, Prophet)
- Multiusuario y roles (admin, viewer)
- Exportación de reportes en Excel o PDF
- Websockets para notificaciones en tiempo real

---

## 📺 Demo en Video (opcional)

---

## 📚 Licencia

Este proyecto fue desarrollado como parte de una prueba técnica y no tiene fines comerciales.
