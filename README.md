# Cube Trainer

Generador de scrambles, cronómetro y entrenador de algoritmos para cubos 3x3 y 4x4.

Hecho con HTML, JavaScript, CSS Modules y GSAP, sobre Vite.

## Funciones

**Cronómetro**

- Scrambles aleatorios de 20 movimientos para 3x3 y 40 para 4x4.
- Vista previa del cubo mezclado (colores estándar: blanco arriba, verde al frente).
- Cronómetro estilo competencia con barra espaciadora o toque.
- Inspección opcional de 15 s con penalización +2 o DNF.
- Historial guardado en el navegador, separado por cubo.
- Estadísticas: mejor tiempo, ao5, ao12, mejor ao5 y media.

**Entrenador**

- F2L básico, OLL en dos pasos, PLL en dos pasos, PLL completo (21 casos) y paridades de 4x4.
- Muestra un caso al azar con amarillo arriba y la secuencia para armarlo.
- La solución se revela al pedirla.

**Manual**

- Guía del método Fridrich (CFOP) completo y reducido (2-look), etapa por etapa.
- Cada etapa muestra el objetivo en el cubo, consejos, sus algoritmos y un botón para practicarlos.
- Incluye cómo aplicar el método al 4x4 por reducción.

## Atajos de teclado

| Tecla | Acción |
| --- | --- |
| Espacio | Mantener y soltar para iniciar; presionar para parar |
| N | Nuevo scramble / siguiente caso |
| C | Copiar scramble |
| R | Mostrar solución en el entrenador |
| 1 / 2 | Cambiar a 3x3 / 4x4 |

## Desarrollo

```bash
npm install
npm run dev     # servidor local
npm test        # pruebas
npm run build   # compilación en dist/
```

## Estructura

```
src/
  components/   Componentes de interfaz, cada uno con su .module.css
  data/         Algoritmos PLL, OLL y paridades
  lib/          Notación, scrambles, simulación del cubo, estadísticas
```

Todos los algoritmos se validan en las pruebas con una simulación del cubo NxN
(`src/lib/cube.js`).

## Licencia

MIT
