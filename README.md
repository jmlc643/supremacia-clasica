# Supremacía Clásica: Universitario vs Alianza Lima

Un dashboard analítico e interactivo que rastrea y visualiza la historia completa del clásico del fútbol peruano (Universitario de Deportes vs Alianza Lima), extrayendo datos en tiempo real desde los registros históricos de [RSSSF](https://www.rsssf.org/tablesa/aliuni.html).

## Características Principales

* **Filtros por Competición:** Capacidad de analizar estadísticas separando partidos oficiales, amistosos, o filtrando por torneos específicos (Copa Libertadores, Torneo Apertura, etc.).
* **Manejo de W.O. (Walkover):** Detección inteligente de partidos ganados en mesa, reflejados correctamente en las tablas y estadísticas acumuladas.
* **Métricas Avanzadas Anuales:** Gráficos de distribución de victorias anuales que incluyen la diferencia de goles exacta por año y quién tuvo la mejor cuota goleadora.
* **Evolución Histórica:** Un gráfico de área que traza la diferencia neta acumulada de victorias a lo largo de la historia.
* **Explorador de Partidos:** Una tabla interactiva con paginación y búsqueda rápida para explorar cada clásico jugado desde 1928.
* **Consolidado por Torneo:** Una vista sumaria que agrupa los partidos y resultados según el torneo disputado.
* **Actualización en Tiempo Real:** Extracción y parseo de datos de RSSSF al vuelo usando funciones Serverless con caché inteligente para minimizar la carga.

## Stack Tecnológico

**Frontend:**
* **React 19** con **TypeScript**
* **Vite** como entorno de desarrollo ultrarrápido
* **Tailwind CSS v4** para el sistema de diseño visual (UI oscura y glassmorphism)
* **Recharts** para visualización de datos dinámica
* **Lucide React** para iconografía ligera

**Backend / API:**
* **Vercel Serverless Functions** (Node.js) para la ingesta y transformación de datos (`/api/matches`)
* Middlewares de Vite para simular el comportamiento del backend localmente.

## Arquitectura del Proyecto

```text
supremacia-clasica/
+-- api/
   +-- matches.ts              # Vercel Serverless Endpoint (Parseo de RSSSF)
+-- src/
   +-- assets/                 # Recursos gráficos (Logos de los equipos)
   +-- components/             # Componentes compartidos (Header, etc.)
   +-- features/classic/       # Feature-driven architecture para el dashboard
      +-- components/         # Tablas, Gráficos y KPIs
      +-- hooks/              # Lógica de negocio (useClassicStats)
      +-- services/           # Interacción con la API local/remota y Caché
      +-- types/              # Interfaces TypeScript
      +-- utils/              # Funciones puras de parseo (parser.ts)
   +-- App.tsx                 # Punto de entrada y ensamblaje de la UI
   +-- index.css               # Estilos globales y tokens
+-- vite.config.ts              # Configuración de Vite y middleware de desarrollo
+-- vercel.json                 # Configuración de despliegue
```

## Instalación y Uso Local

Sigue estos pasos para levantar el entorno de desarrollo localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jmlc643/supremacia-clasica.git
   ```

2. **Ingresar al directorio:**
   ```bash
   cd supremacia-clasica
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible en `http://localhost:5173` y el backend simulado en `http://localhost:5173/api/matches`.*

## Licencia

Este proyecto es de uso libre y educativo, basado en los datos públicos de [The Rec.Sport.Soccer Statistics Foundation (RSSSF)](https://www.rsssf.org).

