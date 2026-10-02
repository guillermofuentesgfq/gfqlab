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

## Pendiente: crear el API token

El deploy **no funciona hasta que exista `CLOUDFLARE_API_TOKEN`**. Pasos:

1. Cloudflare → **My Profile → API Tokens → Create Token → Custom token**
2. Añadir los permisos de la tabla de abajo
3. **Account Resources** → *Include* → *la cuenta concreta*
   **Zone Resources** → *Include* → *Zone* → *gfqlab.com*
4. Copy token, y en local:

   ```bash
   gh secret set CLOUDFLARE_API_TOKEN
   ```

| Ámbito | Permiso | Por qué |
| --- | --- | --- |
| Account | Workers Scripts: **Edit** | Sube el Worker y sus assets |
| Account | Account Settings: **Read** | Lo requiere wrangler |
| Zone | Workers Routes: **Edit** | Crea los custom domains |
| Zone | DNS: **Edit** | Crea el registro CNAME |
| User | User Details: **Read** | Lo requiere wrangler |

Acotar Account y Zone a la cuenta y la zona concretas —en lugar de "todas"—
hace que el token no pueda tocar nada más. Con `workers_dev` desactivado,
aunque se filtrara no podría publicar nada fuera de gfqlab.com.

No hay que tocar el DNS a mano: con `custom_domain: true`, wrangler crea los
registros del apex y de `www` en el primer despliegue. Solo tarda 30–120
segundos en propagar.

## Dependencias transitivas con avisos

`pnpm-workspace.yaml` fija `overrides` para siete paquetes transitivos de Astro
con avisos de seguridad altos conocidos: `devalue`, `fast-uri`, `js-yaml`,
`nanoid`, `postcss`, `smol-toml` y `yaml`. Astro no los actualiza hasta su
propio release.

Todas son dependencias de **build**: ninguna llega al bundle que se sirve en el
navegador, y varias solo se usan en `astro check`, que no corre en el sitio
publicado. Aun así, sin los overrides `pnpm audit --audit-level=high` falla y
bloquea el merge por algo que no es explotable aquí.

Cuando Astro actualice su árbol de dependencias, se pueden borrar los overrides
que ya no apliquen.

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

| Secret | Estado |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Ya configurado |
| `CLOUDFLARE_API_TOKEN` | **Pendiente** — hay que crearlo (ver abajo) |

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