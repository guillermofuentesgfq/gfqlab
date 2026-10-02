# gfqlab

Sitio personal de [Guillermo Fuentes Quijada](https://gfqlab.com), publicado en
**gfqlab.com** sobre un Cloudflare Worker de assets estáticos.

- **Astro 7** + **Tailwind CSS v4** + TypeScript estricto
- Salida estática pura: cero JavaScript de cliente, salvo el scriptinline del
  tema en `BaseLayout.astro`
- Deploy desde GitHub Actions al publicar una release

## Comandos

| Comando | Qué hace |
| --- | --- |
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Servidor de desarrollo en `http://localhost:4321` |
| `pnpm build` | `astro check` + `astro build` a `dist/` |
| `pnpm preview` | Sirve `dist/` en local |
| `pnpm deploy` | `wrangler deploy` (sube a producción) |
| `pnpm rollback` | `wrangler rollback` (vuelve a la versión anterior) |

En local se usa `pnpm dev`, **no** `wrangler dev`: hay un bug conocido de
wrangler >= 4.99 por el que, con `routes` y `assets` a la vez, las rutas que
casan con el glob de la ruta se enrutan al Worker antes de probar los assets y
todos los ficheros estáticos dan 404. El comentario de `wrangler.jsonc` explica
el detalle.

## Estructura

```
src/
  content/
    work/          proyectos, uno por .md → /work/<id>
    publications/  artículos, uno por .md → /publications/<id>
  data/profile.ts  experiencia, skills, educación y certificados
  pages/
    index.astro        home
    about.astro        CV completo
    publications/      listado y detalle de artículos
    work/              listado y detalle de proyectos
  site.config.ts   nombre, tagline, email y enlaces sociales
```

### Dónde se cambia qué

| Para cambiar… | Edita |
| --- | --- |
| Nombre, tagline, email, redes sociales | `src/site.config.ts` |
| Colores, tipografías | los tokens de `src/styles/global.css` |
| Fuentes (Google Fonts) | el array `fonts` de `astro.config.mjs` |
| Un proyecto | un `.md` nuevo en `src/content/work/` |
| Un artículo | un `.md` nuevo en `src/content/publications/` |
| Experiencia, skills, educación, certificados | `src/data/profile.ts` |
| Cabeceras de caché y de seguridad | `public/_headers` |
| Redirecciones | `public/_redirects` |

El contenido de `src/data/profile.ts` y de las colecciones sale del CV en
LaTeX, que vive en otro repositorio. **Nada los sincroniza automáticamente**:
cuando cambie el CV, hay que cambiarlo también aquí.

## Deploy

No se despliega al hacer push a `main`, sino al **publicar una release**:

```bash
git tag v0.1.0 && git push --tags
gh release create v0.1.0 --generate-notes
```

Ese evento dispara `.github/workflows/deploy.yml`, que vuelve a compilar y
sube `dist/` con `wrangler deploy`. Publicar una release sin ejecutar el
comando de `gh` también vale: crear la release desde la web o desde la
interfaz de GitHub dispara el mismo workflow.

Rollback, si una versión sale mal:

```bash
pnpm rollback
```

Cloudflare conserva las versiones anteriores del Worker, así que esto es
inmediato y no requiere redesplegar nada.

### Secrets del repositorio

| Secret | Valor |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | API token de Cloudflare (ver abajo) |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID, visible en `pnpm exec wrangler whoami` |

El token se crea en Cloudflare → **My Profile → API Tokens → Create Token →
Custom token** con exactamente estos permisos:

| Ámbito | Permiso | Nota |
| --- | --- | --- |
| Account | Workers Scripts: **Edit** | Sube el Worker y sus assets |
| Account | Account Settings: **Read** | Lo requiere wrangler |
| Zone (gfqlab.com) | Workers Routes: **Edit** | Crea los custom domains |
| Zone (gfqlab.com) | DNS: **Edit** | Crea el registro CNAME del apex |
| User | User Details: **Read** | Lo requiere wrangler |

Acotando Account a la cuenta concreta y Zone a la zona `gfqlab.com` —en lugar
de "todas las cuentas" y "todas las zonas"— el token no puede tocar nada más de
esa cuenta. `workers_dev` está desactivado en `wrangler.jsonc`, así que este
token no puede publicar nada fuera de gfqlab.com aunque se filtrara.

El DNS no hay que tocarlo a mano: con `custom_domain: true` en las rutas,
wrangler crea los registros del apex y de `www` en el primer despliegue. Solo
tarda 30–120 segundos en propagar.

## Dominio

- `gfqlab.com` — canónico. Es el que aparece en el sitemap y en las etiquetas
  `rel="canonical"`.
- `www.gfqlab.com` — redirige con 301 al apex, vía `public/_redirects`.

Tener dos hostnames sirviendo el mismo contenido reparte la señal canónica
entre dos URLs, que es justo lo que `canonical` y `sitemap` existen para evitar.

## Licencia

MIT, ver [LICENSE](LICENSE). Basado en
[astro-starter-portfolio](https://github.com/BracoZS/astro-starter-portfolio)
de Bracozs, también MIT.