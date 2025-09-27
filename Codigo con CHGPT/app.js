document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnConvertir");
    btn.addEventListener("click", convertir);
});

function convertir() {
    let cantidad = parseFloat(document.getElementById("cantidad").value);
    let origen = document.getElementById("origen").value;
    let destino = document.getElementById("destino").value;
    let resultado = document.getElementById("resultado");

    if (isNaN(cantidad)) {
        resultado.innerHTML = "⚠️ Ingrese un número válido";
        return;
    }

    let factores = {
        m: 1,
        km: 0.001,
        mi: 0.000621371,
        ft: 3.28084
    };

    let enMetros = cantidad / factores[origen];
    let convertido = enMetros * factores[destino];

    resultado.innerHTML = `${cantidad} ${origen} = ${convertido.toFixed(4)} ${destino}`;
}
