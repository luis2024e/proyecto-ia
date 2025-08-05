// script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- EFECTO DE BRILLO LÍQUIDO EN LAS TARJETAS ---
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- FUNCIONES DE LÓGICA DE LOS EJERCICIOS ---
    // (Separadas para mayor claridad y seguridad, en lugar de usar eval())

    function esPrimo(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        for (let i = 5; i * i <= num; i = i + 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
    }

    function calcularPrimos(desde, hasta) {
        const primos = [];
        for (let i = desde; i <= hasta; i++) {
            if (esPrimo(i)) {
                primos.push(i);
            }
        }
        return primos.join(', ');
    }

    function calcularFibonacci(limite) {
        let a = 0, b = 1, resultado = [];
        if (limite >= 0) resultado.push(a);
        while (b <= limite) {
            resultado.push(b);
            let temp = a + b;
            a = b;
            b = temp;
        }
        return resultado.join(', ');
    }

    function calcularIMC(pesoLibras, alturaMetros) {
        const pesoKg = pesoLibras * 0.453592;
        const imc = pesoKg / (alturaMetros * alturaMetros);
        const resultado = imc.toFixed(2);
        
        let categoria = '';
        if (imc < 18.5) categoria = "Bajo peso";
        else if (imc <= 24.9) categoria = "Peso normal";
        else if (imc <= 29.9) categoria = "Sobrepeso";
        else categoria = "Obesidad";
        
        return `Tu IMC es ${resultado} (${categoria})`;
    }

    function esPalindromo(texto) {
        const textoOriginal = texto; // Guardamos el original para mostrarlo
        const textoNormalizado = texto.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!textoNormalizado) return 'Entrada no válida.'; // Evita error con strings vacíos o solo con símbolos.
        const textoInvertido = textoNormalizado.split('').reverse().join('');
        
        if (textoNormalizado === textoInvertido) {
            return `"${textoOriginal}" es un palíndromo.`;
        } else {
            return `"${textoOriginal}" no es un palíndromo.`;
        }
    }


    // --- MANEJO DE EVENTOS DE LOS EJERCICIOS ---
    const mainContainer = document.querySelector('.cards-container');
    mainContainer.addEventListener('click', (e) => {
        const target = e.target;
        
        // Si se pulsa un botón de acción
        if (target.classList.contains('action-btn')) {
            const card = target.closest('.card');
            if (!card) return;
            const exercise = card.id.replace('card-', '');
            handleExercise(exercise);
        }

        // Si se pulsa un botón de solución
        if (target.classList.contains('solution-btn')) {
            const card = target.closest('.card');
            if (!card) return;
            const exercise = card.id.replace('card-', '');
            openModal(exercise);
        }
    });

    function handleExercise(exercise) {
        const resultBox = document.getElementById(`${exercise}-resultado`);
        resultBox.style.color = 'var(--text-dark)';
        
        try {
            let output = '';
            switch (exercise) {
                case 'primos':
                    const desde = parseInt(document.getElementById('primos-desde').value);
                    const hasta = parseInt(document.getElementById('primos-hasta').value);
                    if (isNaN(desde) || isNaN(hasta) || desde >= hasta || desde < 0) throw new Error("Por favor, ingresa un rango válido.");
                    output = calcularPrimos(desde, hasta);
                    resultBox.textContent = output || 'No se encontraron primos en este rango.';
                    break;
                case 'fibonacci':
                    const limite = parseInt(document.getElementById('fibonacci-limite').value);
                    if (isNaN(limite) || limite < 0) throw new Error("Por favor, ingresa un número positivo.");
                    resultBox.textContent = calcularFibonacci(limite);
                    break;
                case 'imc':
                    const peso = parseFloat(document.getElementById('imc-peso').value);
                    const altura = parseFloat(document.getElementById('imc-altura').value);
                    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) throw new Error("Por favor, ingresa peso y altura válidos.");
                    resultBox.textContent = calcularIMC(peso, altura);
                    break;
                case 'palindromo':
                    const texto = document.getElementById('palindromo-texto').value;
                    if (!texto.trim()) throw new Error("Por favor, ingresa una palabra o frase.");
                    resultBox.textContent = esPalindromo(texto);
                    break;
            }
        } catch (error) {
            resultBox.textContent = error.message;
            resultBox.style.color = 'var(--error-color)';
        }
    }

    // --- DATOS PARA EL MODAL (Ahora solo metadatos) ---
    const modalData = {
        primos: {
            title: "Solución: Números Primos",
            code: `${esPrimo.toString()}\n\n${calcularPrimos.toString()}`,
            explanation: `<p>El código se divide en dos partes:</p><ol><li><strong>esPrimo(num):</strong> Esta función verifica si un número es primo usando una optimización que evita comprobar todos los divisores.</li><li><strong>calcularPrimos(desde, hasta):</strong> Recorre el rango y usa la función anterior para compilar una lista de resultados.</li></ol>`
        },
        fibonacci: {
            title: "Solución: Serie Fibonacci",
            code: calcularFibonacci.toString(),
            explanation: `<p>Este código genera la serie de Fibonacci de forma iterativa, que es más eficiente que la recursividad para este problema.</p><ol><li>Se inicializan dos variables <code>a</code> y <code>b</code> con los dos primeros números de la serie (0 y 1).</li><li>El bucle <code>while</code> se ejecuta mientras el siguiente número sea menor o igual al límite.</li></ol>`
        },
        imc: {
            title: "Solución: Cálculo de IMC",
            code: calcularIMC.toString(),
            explanation: `<p>El cálculo del IMC sigue estos pasos:</p><ol><li><strong>Conversión:</strong> Se convierten las libras a kilogramos.</li><li><strong>Fórmula:</strong> Se aplica la fórmula del IMC: <code>peso (kg) / (altura (m))^2</code>.</li><li><strong>Clasificación:</strong> Se usan condicionales para determinar la categoría de peso.</li></ol>`
        },
        palindromo: {
            title: "Solución: Palabra Palíndroma",
            code: esPalindromo.toString(),
            explanation: `<p>Para verificar si una palabra es palíndroma:</p><ol><li><strong>Normalización:</strong> Se convierte el texto a minúsculas y se eliminan los caracteres no alfanuméricos.</li><li><strong>Inversión:</strong> La cadena normalizada se invierte.</li><li><strong>Comparación:</strong> Se compara la cadena normalizada con su versión invertida.</li></ol>`
        }
    };

    // --- FUNCIONALIDAD DEL MODAL ---
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalCode = document.getElementById('modal-code');
    const modalExplanation = document.getElementById('modal-explanation');

    function openModal(exercise) {
        const data = modalData[exercise];
        if (data) {
            modalTitle.textContent = data.title;
            modalCode.textContent = data.code;
            modalExplanation.innerHTML = data.explanation;
            modalOverlay.classList.add('visible');
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('visible');
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
});