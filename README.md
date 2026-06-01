# Colombia en Datos

**Indicadores oficiales, fuentes verificadas.**

Colombia en Datos es una plataforma de transparencia cívica de código abierto que consolida estadísticas oficiales del gobierno colombiano en 8 sectores — Seguridad, Economía, Educación, Salud, Medio Ambiente, Social, Tecnología y Relaciones Internacionales — y las presenta en un tablero limpio y accesible para cualquier ciudadano.

Cada cifra enlaza directamente a su fuente primaria. Cada gráfica puede ser verificada por cualquier persona.

---

## Por qué existe esto

Las estadísticas del gobierno colombiano son públicas — pero están dispersas en decenas de portales desactualizados que casi nadie visita. Cuando una estadística sobre secuestros o desempleo circula en redes sociales, la mayoría de personas no tiene forma de verificarla, entender su contexto, o saber si la situación está mejorando o empeorando con el tiempo.

Este proyecto resuelve eso:

- Consultando datos directamente de fuentes autoritativas (datos.gov.co, DANE, Policía Nacional, MinSalud, Banco Mundial)
- Mostrando la fuente de cada cifra de forma visible y verificable
- Anotando las gráficas con eventos de política pública para que los ciudadanos puedan ver si las leyes y acciones del gobierno tienen correlación con resultados reales
- Manteniendo todo el código abierto para que la metodología misma sea auditable

---

## Sectores

| Sector | Indicadores principales |
|---|---|
| 🔒 Seguridad | Secuestros, homicidios, extorsión, desplazamiento |
| 💰 Economía | PIB, desempleo, inflación (IPC), pobreza |
| 🎓 Educación | Cobertura, deserción, resultados Saber 11, PISA |
| 🏥 Salud | Mortalidad infantil, cobertura SGSSS, enfermedades de notificación |
| 🌿 Medio Ambiente | Deforestación, emisiones CO₂, calidad del aire |
| 👥 Social | GINI, índice de pobreza multidimensional, migración |
| 💻 Tecnología | Penetración de internet, adopción fintech, innovación |
| 🌐 Relaciones Internacionales | Comercio exterior, migración, tratados |

---

## Arquitectura

La aplicación completa corre del lado del cliente. Sin backend, sin base de datos, sin servidor que mantener o que pueda ser atacado.

```
Cloudflare Pages (sitio estático)
    └── Next.js static export
        └── El navegador consulta APIs públicas bajo demanda
            ├── datos.gov.co  (API Socrata)
            ├── API Banco Mundial
            └── Descargas CSV del DANE
                └── Cloudflare Worker (proxy CORS, ~10 líneas, se configura una vez)
```

Los datos se almacenan en caché en `localStorage` con TTL por dataset (1 día para estadísticas de seguridad, 7 días para indicadores económicos, 30 días para datos anuales del Banco Mundial). Un usuario que visita el sitio consulta cada endpoint de API como máximo una vez por período de TTL.

**Costo en producción: $0.** Los niveles gratuitos de Cloudflare Pages y Workers cubren todo esto con margen.

---

## Fuentes de datos

| Fuente | Qué provee | Tipo de API |
|---|---|---|
| [datos.gov.co](https://www.datos.gov.co) | Seguridad, social, medio ambiente | Socrata REST |
| [DANE](https://www.dane.gov.co) | Economía, educación, población | Descarga CSV |
| [Banco Mundial](https://data.worldbank.org) | Indicadores comparativos, series históricas largas | REST JSON |
| [MinSalud / SIVIGILA](https://www.minsalud.gov.co) | Salud y vigilancia epidemiológica | CSV / Socrata |
| [IDEAM](http://www.ideam.gov.co) | Medio ambiente, clima, deforestación | CSV |

Todos los datos se consultan directamente desde estas fuentes primarias. Este proyecto no almacena ni modifica ningún dato.

---

## Primeros pasos

### Requisitos

- Node.js 20+
- pnpm 9+

### Instalación

```bash
git clone https://github.com/colombia-en-datos/ced.git
cd ced
pnpm install
```

### Desarrollo

```bash
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Variables de entorno

Crear `.env.local` en la raíz del proyecto:

```bash
# Opcional — aumenta el límite de datos.gov.co de 1k a 10k solicitudes/hora
# Obtener un token gratis en https://data.socrata.com/profile/edit/developer_settings
NEXT_PUBLIC_SOCRATA_TOKEN=

# Solo necesario si hay problemas de CORS con endpoints del DANE
# Desplegar el worker en /workers/cors-proxy en Cloudflare y pegar la URL aquí
NEXT_PUBLIC_PROXY_URL=
```

Ambos valores son opcionales para desarrollo local. La aplicación funciona sin ellos.

### Build

```bash
pnpm build
```

Genera un sitio estático en `out/`. El contenido de `out/` se puede desplegar en cualquier host estático.

---

## Agregar un nuevo indicador

Todas las fuentes de datos se declaran en `src/config/manifest.ts`. Agregar un nuevo indicador es una sola entrada en el manifest — no se requiere lógica de API nueva.

```typescript
{
  id: "seguridad_extorsion",
  sector: "seguridad",
  label: "Extorsión por año",
  description: "Casos de extorsión reportados ante la Fiscalía General de la Nación",
  source: "Fiscalía General de la Nación",
  sourceUrl: "https://www.datos.gov.co/...",
  endpoint: "https://www.datos.gov.co/resource/XXXX.json",
  query: "$select=anio,count(*)%20as%20total&$group=anio&$order=anio%20ASC",
  fields: { year: "anio", value: "total" },
  unit: "casos",
  cacheTTL: 86400,
  positiveDirection: "down",
  policyEvents: [
    { year: 2016, label: "Acuerdo de paz FARC" }
  ]
}
```

---

## Contribuir

Las contribuciones son bienvenidas — especialmente:

- Nuevas entradas en `src/config/manifest.ts` con URLs de fuentes verificadas
- Correcciones a mapeos de campos en datasets existentes
- Desgloses por departamento o municipio
- Mejoras de accesibilidad

Por favor abrir un issue antes de un PR grande para alinear el alcance.

Al agregar o modificar fuentes de datos, incluir en el PR:
1. La URL del dataset en su portal oficial
2. La fecha en que verificaste los nombres de los campos
3. Por qué elegiste este dataset específico sobre alternativas

La integridad de los datos es el objetivo central de este proyecto. Cada PR que toca el manifest recibe revisión especial.

---

## Licencia

MIT — ver [LICENSE](./LICENSE).

Los datos mostrados por esta aplicación provienen de portales de datos abiertos del gobierno colombiano y organizaciones internacionales. Son de dominio público. Este proyecto no reclama propiedad sobre ninguno de los datos subyacentes.

---

## Aviso legal

Colombia en Datos es un proyecto independiente y no partidista. No tiene afiliación con el gobierno colombiano, ningún partido político ni ninguna ONG. La plataforma muestra estadísticas oficiales tal como las publican sus fuentes primarias. Las anotaciones en las gráficas (marcadores de eventos de política pública) indican fechas de anuncios de políticas — no implican causalidad.

Si crees que una fuente de datos es incorrecta o que un mapeo de campos está equivocado, por favor [abre un issue](https://github.com/colombia-en-datos/ced/issues).