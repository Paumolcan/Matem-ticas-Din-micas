/**
 * Función auxiliar para calcular el punto medio.
 */
function calcularPuntoMedio(a, b) {
    return (a + b) / 2;
}

/**
 * Prototipo: Biseccion(f, a, b, n)
 * f: función, a: límite inf, b: límite sup, n: iteraciones.
 */
function Biseccion(f, a, b, n) {
    console.log("%c--- Ejecutando Algoritmo de Bisección ---", "color: #1a5276; font-weight: bold;");

    // Comprobación de existencia de solución: f(a)*f(b) < 0
    if (f(a) * f(b) >= 0) {
        console.error("Error: f(a)*f(b) >= 0. El intervalo no es válido.");
        return null;
    }

    let p = 0;
    for (let i = 1; i <= n; i++) {
        p = calcularPuntoMedio(a, b);
        let fp = f(p);

        // Registro detallado en consola para el usuario
        console.log(`Iteración ${i}: p = ${p.toFixed(6)} | f(p) = ${fp.toFixed(6)}`);

        if (fp === 0) break;

        if (f(a) * fp < 0) {
            b = p;
        } else {
            a = p;
        }
    }
    
    console.log("%cResultado final calculado: " + p, "color: #1abc9c; font-weight: bold;");
    return p;
}

/**
 * Función que conecta la interfaz web con el algoritmo
 */
function corregirBiseccion() {
    const userVal = parseFloat(document.getElementById('inputBiseccion').value);
    const feedback = document.getElementById('feedbackBiseccion');
    
    // Ecuación propuesta: f(x) = x^3 - x - 2
    const f = (x) => Math.pow(x, 3) - x - 2;
    
    // Calculamos el valor real con 15 iteraciones
    const realVal = Biseccion(f, 1, 2, 15);

    if (isNaN(userVal)) {
        feedback.style.color = "orange";
        feedback.innerHTML = "Por favor, introduce un número.";
        return;
    }

    // Comprobación con margen de error de 0.01
    if (Math.abs(userVal - realVal) < 0.01) {
        feedback.style.color = "#1abc9c";
        feedback.innerHTML = `<b>¡Excelente!</b> Has aproximado correctamente la raíz: ${realVal.toFixed(4)}`;
    } else {
        feedback.style.color = "#e74c3c";
        feedback.innerHTML = `<b>Casi...</b> El valor esperado era cercano a ${realVal.toFixed(4)}. Revisa la consola (F12).`;
    }
}