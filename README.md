# Prueba Técnica: Dashboard de Pronóstico de Demanda

Este proyecto es una implementación simplificada de un dashboard empresarial de pronóstico de demanda, desarrollado con un enfoque profesional para la evaluación técnica.

---

## 📄 Tecnologías Principales

### 📈 Frontend

- [React.js (Vite)](https://vitejs.dev/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup)
- [Recharts](https://recharts.org/)
- [SweetAlert2](https://sweetalert2.github.io/)

### 🤖 Backend

- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [JWT](https://jwt.io/) con refresh tokens
- [Multer](https://github.com/expressjs/multer)
- [csv-parser](https://www.npmjs.com/package/csv-parser), [xlsx](https://www.npmjs.com/package/xlsx), [PapaParse](https://www.papaparse.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Swagger](https://swagger.io/tools/swagger-ui/)

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
│   │   ├── prisma/
│   │   └── swagger.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
├── scripts/
│   ├── backup.sh
│   └── restore.sh
├── docker-compose.yml
├── .env.example
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
- Logout y expiración de sesión

### ✅ Carga de Datos Empresariales

- Upload de CSV o Excel (hasta 10MB)
- Validación progresiva con feedback claro
- Drag & drop con vista previa y wizard

### ✅ Pronóstico Automatizado

- Generación por SKU basada en datos
- Intervalos de confianza (80%, 90%, 95%)
- Datos enriquecidos con tendencia y estacionalidad
- Versión del modelo incluida

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
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backup y Restore (PostgreSQL con Docker)

```bash
chmod +x scripts/backup.sh scripts/restore.sh

# Crear backup
./scripts/backup.sh

# Restaurar backup
./scripts/restore.sh backup_2025-07-23_14-00-00.sql
```

---

## 📚 Documentación de la API

Swagger UI:

- Local: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- Producción: [https://prueba-tecnica-seligo.onrender.com/api/docs/](https://prueba-tecnica-seligo.onrender.com/api/docs)

---

## 🌐 Despliegue en Producción

- 🔗 Frontend (Vercel): [https://prueba-tecnica-seligo.vercel.app](https://prueba-tecnica-seligo.vercel.app)
- 🔗 Backend (Render): [https://prueba-tecnica-seligo.onrender.com](https://prueba-tecnica-seligo.onrender.com/api/docs)
- DB: Railway

---

## 📺 Demo en Video (opcional)

---

## 📍 Mejoras Futuras

- Integración con herramientas BI (Power BI / Tableau)
- Dashboard responsivo para móviles
- Validación de datos por IA para detección de outliers
- Uploads asíncronos con seguimiento en tiempo real

---

## 📚 Licencia

Este proyecto fue desarrollado como parte de una prueba técnica y no tiene fines comerciales.
