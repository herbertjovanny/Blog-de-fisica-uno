// Utilidad: convierte entrada a número; si está vacío o es inválido -> 0
function toNumber(value) {
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
}

const $ = (sel) => document.querySelector(sel);

const n1 = $("#n1");
const n2 = $("#n2");
const out = $("#out");
const form = $("#sum-form");
const clearBtn = $("#clear");

// Calcula y muestra la suma
function updateSum() {
  const a = toNumber(n1.value);
  const b = toNumber(n2.value);
  const sum = a + b;

  // Muestra entero si corresponde, o hasta 6 decimales sin ceros innecesarios
  out.textContent = Number.isInteger(sum) ? String(sum) : Number(sum.toFixed(6)).toString();
}

// Sumar al enviar (clic en "Sumar" o Enter)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateSum();
});

// Recalcular en tiempo real
n1.addEventListener("input", updateSum);
n2.addEventListener("input", updateSum);

// Limpiar
clearBtn.addEventListener("click", () => {
  n1.value = "";
  n2.value = "";
  out.textContent = "—";
  n1.focus();
});

// Accesibilidad: Enter en cualquier input ya funciona por el submit del form.
// Cálculo inicial
updateSum();
