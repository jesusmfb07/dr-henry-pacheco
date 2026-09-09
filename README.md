# Dr. Henry Pacheco - Sitio Web y Blog

Sitio web profesional y blog del **Dr. Henry Pacheco Fernández Baca**, neurocirujano especialista en **neurointervencionismo** de Lima, Perú.

## Estructura del proyecto

```
dr-henry-pacheco/
├── index.html              # Página principal (inicio, sobre mí, sedes, agenda)
├── blog.html               # Página del blog (lista de artículos)
├── 404.html                # Página de error 404
├── css/
│   └── style.css           # Estilos del sitio
├── js/
│   └── main.js             # Funcionalidad (menú móvil, formularios)
├── assets/
│   └── images/             # Imágenes (placeholders incluidos)
├── blog/
│   ├── aneurisma-cerebral-que-es.html
│   ├── acv-reconocer-sintomas.html
│   ├── que-es-neurointervencionismo.html
│   ├── como-prevenir-accidente-cerebrovascular.html
│   ├── hernia-discal-columna.html
│   └── avances-neurointervencionismo-2026.html
└── generar-imagenes.ps1    # Script para generar imágenes placeholder
```

## Cómo publicar en GitHub Pages (gratuito, sin dominio)

1. **Crea una cuenta de GitHub** (si no la tienes) con el correo `jesusmfb@gmail.com` en https://github.com.

2. **Crea un repositorio nuevo:**
   - Ve a https://github.com/new
   - Nombre: `dr-henry-pacheco` (o el que prefieras)
   - Selecciona **Public** (público)
   - Click en **Create repository**

3. **Sube los archivos:**
   - Opción A (recomendada, con Git):
     ```
     git init
     git add .
     git commit -m "Sitio web Dr. Henry Pacheco"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/dr-henry-pacheco.git
     git push -u origin main
     ```
   - Opción B (sin Git): en GitHub, ve a tu repositorio, click en **Add file → Upload files**, y arrastra todos los archivos de la carpeta `dr-henry-pacheco`.

4. **Activa GitHub Pages:**
   - En tu repositorio, ve a **Settings → Pages**
   - En **Source** selecciona `Deploy from a branch`
   - Branch: `main`, carpeta: `/ (root)`
   - Click en **Save**

5. **¡Listo!** Tu sitio estará disponible en:
   `https://TU_USUARIO.github.io/dr-henry-pacheco/`

## Reemplazar las imágenes placeholder

Las imágenes actuales son placeholders generados. Para poner las fotos reales del doctor:

1. Coloca las fotos reales en `assets/images/` con los mismos nombres:
   - `dr-henry-pacheco.jpg` → foto del doctor (800x1000 recomendado)
   - `hero-neurocirugia.jpg` → imagen del fondo del hero (1600x900)
   - `aneurisma-cerebral.jpg`, `acv-accidente-cerebrovascular.jpg`, etc. → portadas de los artículos
2. Si la foto del doctor ya no es placeholder, elimina el atributo `onerror="mostrarFotoReemplazo(this)"` del `img` en `index.html`.

Para regenerar los placeholders: `powershell -File regenerar-imagenes.ps1` (fondo limpio, sin texto) o `generar-imagenes.ps1` (versión con texto).

La foto real del doctor (`dr-henry-pacheco.jpg`, 564x564) ya está incluida en `assets/images/`.

## Créditos y datos

- CMP: 34879
- RNE: 19819
- Especialidad: Neurocirugía (Universidad Nacional Mayor de San Marcos)
- Campo de interés: Neurointervencionismo
- Sedes: Clínica Delgado AUNA, Clínica San Borja, Hospital Nacional Daniel Alcides Carrión del Callao

## Fuentes de información

Contenido basado en fuentes públicas:
- gob.pe (Hospital Nacional Daniel Alcides Carrión)
- Agencia Andina
- AUNA / Clínica Delgado
- Doctoralia Perú (opiniones de pacientes)