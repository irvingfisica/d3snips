# D3Snips

Pequeño módulo de utilidades para proyectos con [D3.js](https://d3js.org/).  
Incluye clases y funciones que abstraen tareas repetitivas al armar visualizaciones.

## Instalación / Importación

No necesitas instalar nada, basta con importar el módulo desde [jsDelivr](https://www.jsdelivr.com/) (o tu propio repo en GitHub):

```html
<script type="module">
  import * from "https://cdn.jsdelivr.net/gh/irvingfisica/d3snips/d3snips.js";
</script>
```

## Utilidades incluidas

### 1. Lienzo

Clase para crear y manejar un `<svg>` responsivo de manera sencilla.

```html
<script>

const chart = new Lienzo("mi_contenedor", 0.56, true);

// cambiar márgenes
chart.set_margin({ left: 50, bottom: 40 });

// cambiar aspect ratio
chart.set_aspect(0.75);

// exportar
chart.exportPNG("grafico.png");
chart.exportSVG("grafico.svg");

</script>
```
### Constructor

- **id** → id del div contenedor
- **aspect** → relación de aspecto (ej. 0.56 ≈ 16:9)
- **useViewBox** → 
  - `true`: usa `viewBox` + `preserveAspectRatio` (responsivo automático)  
  - `false`: ajusta `width/height` reales al hacer `resize`

### Propiedades útiles

- **effective_width / effective_height** → tamaño del área interna sin márgenes
- **svg** → selección D3 del elemento `<svg>`
- **gsvg** → `<g>` principal ya trasladado según márgenes

### Métodos

- **set_margin(marginObj)** → redefine márgenes y recalcula área interna
- **set_aspect(ratio)** → cambia aspect ratio y recalcula
- **exportPNG(filename, width?, height?)** → exporta la visualización como PNG. Si no pasas width/height: usa el width del contenedor (o 800) y calcula el alto con aspect.

- **exportSVG(filename, width?, height?)** → exporta como SVG plano

### 2. fflproces(buffer)

Función auxiliar para descomprimir y parsear datos JSON comprimidos con [fflate](https://github.com/101arrowz/fflate)

```html
<script>
    let data_promises = [
            d3.buffer("datos.json.gz"),
            d3.csv("datos.csv")
        ];

    Promise.all(data_promises)
        .then(function(datos) {
            let datos_buffer = fflprocess(datos[0]);
            let datos_csv = datos[1];
        })
</script>
```

## Ejemplo de uso

```html
<div id="grafico" style="width:100%; max-width:600px;"></div>
<button id="btnExport">Exportar a PNG</button>

<script type="module">
import { Lienzo } from "https://cdn.jsdelivr.net/gh/irvingfisica/d3snips/d3snips.js";

const grafo = new Lienzo("grafico");
grafo.set_aspect(1.0);
grafo.set_margin({bottom: 10, left: 10});

// usar D3 con grafo.gsvg
grafo.gsvg.append("circle")
  .attr("cx", grafo.effective_width/2)
  .attr("cy", grafo.effective_height/2)
  .attr("r", 50)
  .attr("fill", "steelblue");

// exportar
document.getElementById("btnExport").onclick = () => {
  grafo.exportPNG("demo.png");
};
</script>
```