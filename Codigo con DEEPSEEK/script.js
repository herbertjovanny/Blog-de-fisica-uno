// Definición de las unidades por categoría
const units = {
    longitud: {
        metros: { factor: 1, symbol: 'm' },
        kilometros: { factor: 1000, symbol: 'km' },
        centimetros: { factor: 0.01, symbol: 'cm' },
        milimetros: { factor: 0.001, symbol: 'mm' },
        millas: { factor: 1609.34, symbol: 'mi' },
        pies: { factor: 0.3048, symbol: 'ft' },
        pulgadas: { factor: 0.0254, symbol: 'in' },
        yardas: { factor: 0.9144, symbol: 'yd' }
    },
    peso: {
        kilogramos: { factor: 1, symbol: 'kg' },
        gramos: { factor: 0.001, symbol: 'g' },
        libras: { factor: 0.453592, symbol: 'lb' },
        onzas: { factor: 0.0283495, symbol: 'oz' },
        toneladas: { factor: 1000, symbol: 't' }
    },
    temperatura: {
        celsius: { factor: 1, symbol: '°C', isTemperature: true },
        fahrenheit: { factor: 1, symbol: '°F', isTemperature: true },
        kelvin: { factor: 1, symbol: 'K', isTemperature: true }
    },
    volumen: {
        litros: { factor: 1, symbol: 'L' },
        mililitros: { factor: 0.001, symbol: 'mL' },
        galones: { factor: 3.78541, symbol: 'gal' },
        metrosCubicos: { factor: 1000, symbol: 'm³' },
        piesCubicos: { factor: 28.3168, symbol: 'ft³' },
        onzasLiquidas: { factor: 0.0295735, symbol: 'fl oz' }
    },
    velocidad: {
        metrosSegundo: { factor: 1, symbol: 'm/s' },
        kilometrosHora: { factor: 0.277778, symbol: 'km/h' },
        millasHora: { factor: 0.44704, symbol: 'mph' },
        nudos: { factor: 0.514444, symbol: 'kn' },
        piesSegundo: { factor: 0.3048, symbol: 'ft/s' }
    }
};

// Elementos del DOM
const categorySelect = document.getElementById('category');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const inputValue = document.getElementById('inputValue');
const outputValue = document.getElementById('outputValue');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

// Historial de conversiones
let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

// Inicialización
function init() {
    loadCategories();
    setupEventListeners();
    loadHistory();
}

// Cargar categorías y unidades
function loadCategories() {
    categorySelect.innerHTML = '';
    Object.keys(units).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });

    updateUnitSelects();
}

// Actualizar los selects de unidades
function updateUnitSelects() {
    const category = categorySelect.value;
    const unitList = units[category];

    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    Object.keys(unitList).forEach(unit => {
        const fromOption = document.createElement('option');
        const toOption = document.createElement('option');

        fromOption.value = unit;
        toOption.value = unit;

        fromOption.textContent = `${unitList[unit].symbol} (${unit})`;
        toOption.textContent = `${unitList[unit].symbol} (${unit})`;

        fromUnitSelect.appendChild(fromOption);
        toUnitSelect.appendChild(toOption);
    });

    // Establecer valores por defecto diferentes
    if (Object.keys(unitList).length > 1) {
        toUnitSelect.selectedIndex = 1;
    }
}

// Configurar event listeners
function setupEventListeners() {
    categorySelect.addEventListener('change', updateUnitSelects);
    convertBtn.addEventListener('click', convertUnits);
    swapBtn.addEventListener('click', swapUnits);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Convertir al presionar Enter
    inputValue.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertUnits();
        }
    });
}

// Función principal de conversión
function convertUnits() {
    const input = parseFloat(inputValue.value);
    const category = categorySelect.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    if (isNaN(input)) {
        outputValue.value = 'Ingresa un número válido';
        return;
    }

    let result;

    if (units[category][fromUnit].isTemperature) {
        result = convertTemperature(input, fromUnit, toUnit);
    } else {
        result = convertStandardUnits(input, fromUnit, toUnit, category);
    }

    outputValue.value = formatResult(result);

    // Guardar en historial
    saveToHistory(input, fromUnit, toUnit, result, category);
}

// Conversión de unidades estándar (con factores)
function convertStandardUnits(value, fromUnit, toUnit, category) {
    const fromFactor = units[category][fromUnit].factor;
    const toFactor = units[category][toUnit].factor;

    // Convertir a unidad base primero
    const baseValue = value * fromFactor;
    // Convertir de unidad base a unidad destino
    return baseValue / toFactor;
}

// Conversión de temperatura (fórmulas específicas)
function convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;

    // Convertir a Celsius primero
    let celsius;
    switch (fromUnit) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5 / 9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
    }

    // Convertir de Celsius a la unidad destino
    switch (toUnit) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return (celsius * 9 / 5) + 32;
        case 'kelvin':
            return celsius + 273.15;
    }
}

// Intercambiar unidades
function swapUnits() {
    const tempUnit = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempUnit;

    // Si hay un valor de entrada, convertir automáticamente
    if (inputValue.value && !isNaN(parseFloat(inputValue.value))) {
        convertUnits();
    }
}

// Formatear resultado
function formatResult(value) {
    if (value === 0) return '0';

    // Usar notación científica para números muy grandes o muy pequeños
    if (Math.abs(value) >= 1e6 || (Math.abs(value) < 1e-6 && value !== 0)) {
        return value.toExponential(6);
    }

    // Redondear a 6 decimales máximo
    const rounded = Math.round(value * 1e6) / 1e6;

    // Eliminar ceros innecesarios después del decimal
    return parseFloat(rounded.toFixed(6)).toString();
}

// Guardar en historial
function saveToHistory(input, fromUnit, toUnit, result, category) {
    const conversion = {
        timestamp: new Date().toLocaleString(),
        input: input,
        fromUnit: units[category][fromUnit].symbol,
        toUnit: units[category][toUnit].symbol,
        result: result,
        category: category
    };

    conversionHistory.unshift(conversion);
    if (conversionHistory.length > 10) {
        conversionHistory = conversionHistory.slice(0, 10);
    }

    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    loadHistory();
}

// Cargar historial
function loadHistory() {
    historyList.innerHTML = '';

    if (conversionHistory.length === 0) {
        historyList.innerHTML = '<div class="history-item">No hay conversiones recientes</div>';
        return;
    }

    conversionHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <strong>${item.input} ${item.fromUnit}</strong> 
            → ${item.result} ${item.toUnit}
            <br><small>${item.timestamp}</small>
        `;
        historyList.appendChild(historyItem);
    });
}

// Limpiar historial
function clearHistory() {
    conversionHistory = [];
    localStorage.removeItem('conversionHistory');
    loadHistory();
}

// Inicializar la aplicación cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', init);