// Define las unidades y las bases de conversión.
// Todas las unidades se convierten primero a una base común (ej. metro, kilogramo).
const UNITS = {
    length: {
        'm': 1,               // Base: Metro
        'km': 1000,
        'mi': 1609.34,
        'ft': 0.3048
    },
    mass: {
        'kg': 1,              // Base: Kilogramo
        'g': 0.001,
        'lb': 0.453592,
        'oz': 0.0283495
    },
    // La temperatura es especial y necesita una función de conversión.
    temperature: {
        '°C': 'Celsius',
        '°F': 'Fahrenheit',
        'K': 'Kelvin'
    }
};

const conversionTypeSelect = document.getElementById('conversionType');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const inputValue = document.getElementById('inputValue');
const resultValue = document.getElementById('resultValue');

/**
 * Rellena las listas desplegables (select) con las unidades del tipo seleccionado.
 */
function populateUnits() {
    const type = conversionTypeSelect.value;
    const units = UNITS[type];

    // Limpia las opciones anteriores
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    for (const unit in units) {
        const optionFrom = document.createElement('option');
        optionFrom.value = unit;
        optionFrom.textContent = unit;
        fromUnitSelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = unit;
        optionTo.textContent = unit;
        toUnitSelect.appendChild(optionTo);
    }

    // Establece un valor por defecto distinto para 'De' y 'A' si es posible
    if (Object.keys(units).length > 1) {
        toUnitSelect.value = Object.keys(units)[1];
    }
}

/**
 * Realiza la conversión de la unidad.
 */
function convert() {
    const type = conversionTypeSelect.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    const value = parseFloat(inputValue.value);

    // Valida la entrada
    if (isNaN(value) || value < 0) {
        resultValue.textContent = "Entrada inválida";
        return;
    }

    if (fromUnit === toUnit) {
        resultValue.textContent = value.toFixed(4) + ' ' + toUnit;
        return;
    }

    let result;

    if (type === 'temperature') {
        result = convertTemperature(value, fromUnit, toUnit);
    } else {
        // Conversión para Longitud y Masa:
        // 1. Convertir valor 'De' a la base (ej. metros o kilogramos)
        const baseValue = value * UNITS[type][fromUnit];
        // 2. Convertir el valor base a la unidad 'A'
        result = baseValue / UNITS[type][toUnit];
    }

    resultValue.textContent = result.toFixed(4) + ' ' + toUnit;
}

/**
 * Funciones específicas para la conversión de temperatura (no lineal).
 */
function convertTemperature(value, fromUnit, toUnit) {
    let kelvinValue; // Convertir primero a Kelvin como base

    // 1. Convertir a Kelvin
    switch (fromUnit) {
        case '°C': // Celsius a Kelvin
            kelvinValue = value + 273.15;
            break;
        case '°F': // Fahrenheit a Kelvin
            kelvinValue = (value - 32) * (5 / 9) + 273.15;
            break;
        case 'K': // Kelvin
            kelvinValue = value;
            break;
        default:
            return NaN;
    }

    // 2. Convertir de Kelvin a la unidad destino
    switch (toUnit) {
        case '°C': // Kelvin a Celsius
            return kelvinValue - 273.15;
        case '°F': // Kelvin a Fahrenheit
            return (kelvinValue - 273.15) * (9 / 5) + 32;
        case 'K': // Kelvin
            return kelvinValue;
        default:
            return NaN;
    }
}

/**
 * Resetea y actualiza los campos cuando cambia el tipo de conversión.
 */
function resetFields() {
    // Si cambia el tipo, se rellena con las nuevas unidades.
    populateUnits();
    // Luego se ejecuta la conversión con los nuevos valores.
    convert();
}

// Inicialización: Rellena las unidades al cargar la página.
populateUnits();
// Realiza la primera conversión (con valores por defecto).
convert();