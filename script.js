const luxMap = {
  dormitorio: 150,
  sala: 250,
  cocina: 400,
  oficina: 500,
  bano: 200,
  baño: 200,
  taller: 800
};

const tipoEl = document.getElementById('tipo');
const largoEl = document.getElementById('largo');
const anchoEl = document.getElementById('ancho');
const alturaEl = document.getElementById('altura');
const calcularBtn = document.getElementById('calcular');
const limpiarBtn = document.getElementById('limpiar');
const salida = document.getElementById('salida');
const areaTxt = document.getElementById('area_txt');
const luxTxt = document.getElementById('lux_txt');
const lumenesTxt = document.getElementById('lumenes_txt');
const numLamparasEl = document.getElementById('num_lamparas');
const lmPorLamparaEl = document.getElementById('lm_por_lampara');
const instaladoRow = document.getElementById('instalado_row');
const comparacionRow = document.getElementById('comparacion_row');
const instaladoTxt = document.getElementById('instalado_txt');
const comparacionTxt = document.getElementById('comparacion_txt');
const copiarBtn = document.getElementById('copiar');
const autoFill = document.getElementById('auto_fill');

autoFill.addEventListener('click', (e) => {
  e.preventDefault();
  numLamparasEl.value = 8;
  lmPorLamparaEl.value = 800;
});

function obtenerLuxSeleccionado() {
  const val = tipoEl.value;
  return luxMap[val] ?? 250;
}

function formatearNumero(n) {
  return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-';
}

calcularBtn.addEventListener('click', () => {
  const largo = parseFloat(largoEl.value);
  const ancho = parseFloat(anchoEl.value);
  const altura = parseFloat(alturaEl.value);

  if (!Number.isFinite(largo) || !Number.isFinite(ancho) || largo <= 0 || ancho <= 0) {
    alert('Por favor ingresa largo y ancho válidos (mayores que 0).');
    return;
  }

  const area = largo * ancho;
  const lux = obtenerLuxSeleccionado();
  const lumenesNecesarios = area * lux;

  areaTxt.textContent = `${formatearNumero(area)} m²`;
  luxTxt.textContent = `${formatearNumero(lux)} lux`;
  lumenesTxt.textContent = `${Math.round(lumenesNecesarios).toLocaleString()} lm`;

  // Comparación con lámparas instaladas
  const numLamparas = parseInt(numLamparasEl.value);
  const lmPorLampara = parseFloat(lmPorLamparaEl.value);

  if (Number.isFinite(numLamparas) && numLamparas > 0 && Number.isFinite(lmPorLampara) && lmPorLampara > 0) {
    const instalado = numLamparas * lmPorLampara;
    instaladoTxt.textContent = `${Math.round(instalado).toLocaleString()} lm`;
    instaladoRow.style.display = 'flex';
    comparacionRow.style.display = 'flex';

    if (instalado >= lumenesNecesarios) {
      comparacionTxt.textContent = 'Suficiente ✅';
      comparacionTxt.style.color = '#7bed9f';
    } else {
      const falta = Math.round(lumenesNecesarios - instalado);
      comparacionTxt.textContent = `Insuficiente — faltan ${falta.toLocaleString()} lm ⚠️`;
      comparacionTxt.style.color = '#ffb4a2';
    }
  } else {
    instaladoRow.style.display = 'none';
    comparacionRow.style.display = 'none';
  }

  salida.hidden = false;
});

limpiarBtn.addEventListener('click', () => {
  largoEl.value = '';
  anchoEl.value = '';
  alturaEl.value = '';
  numLamparasEl.value = '';
  lmPorLamparaEl.value = '';
  salida.hidden = true;
});

copiarBtn.addEventListener('click', () => {
  if (salida.hidden) {
    alert('Primero calculá el resultado.');
    return;
  }

  const texto = 
`Área: ${areaTxt.textContent}
Nivel: ${luxTxt.textContent}
Lúmenes necesarios: ${lumenesTxt.textContent}` +
  (instaladoRow.style.display !== 'none'
    ? `\nLúmenes instalados: ${instaladoTxt.textContent}\nResultado: ${comparacionTxt.textContent}`
    : '');

  navigator.clipboard?.writeText(texto)
    .then(() => alert('Resultado copiado al portapapeles.'))
    .catch(() => prompt('Copia manualmente:', texto));
});

// Presionar Enter para calcular
[largoEl, anchoEl, alturaEl, numLamparasEl, lmPorLamparaEl].forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') calcularBtn.click();
  });
});