
const lienzo = document.getElementById('canvasInterseccion');
const ctx = lienzo.getContext('2d');
const { Equation, Expression } = algebra;

let puntos = [];
let expresiones = [];
let xSolucion = null;


const sonidoVictoria = new Audio("data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWQAAAAAAAAAAAAAWf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+Wf5Z/ln+");
const sonidoFallo = new Audio("data:audio/wav;base64,UklGRiIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWwAAAAAAAAAAAAAef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+ef55/nn+");

function dibujarLinea(p1, p2, color) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(p1.x - dx * 20, p1.y - dy * 20);
    ctx.lineTo(p2.x + dx * 20, p2.y + dy * 20);
    ctx.stroke();
}

lienzo.addEventListener('mousedown', function(e) {
    if (expresiones.length >= 2) return;

    const rect = lienzo.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    puntos.push({ x, y });

    ctx.fillStyle = "#1a5276";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    if (puntos.length === 2 && expresiones.length === 0) {
        let m = (puntos[1].y - puntos[0].y) / (puntos[1].x - puntos[0].x);
        let n = puntos[0].y - (m * puntos[0].x);
        expresiones.push(algebra.parse(`${m.toFixed(2)}*x + ${n.toFixed(2)}`));
        
        dibujarLinea(puntos[0], puntos[1], "#1abc9c");
        document.getElementById('display1').innerHTML = `Recta 1 (Verde): \\( y = ${expresiones[0].toString()} \\)`;
        console.log("%cRecta 1 definida: " + expresiones[0].toString(), "color: green; font-weight: bold;");
    } 
    else if (puntos.length === 4) {
        let m = (puntos[3].y - puntos[2].y) / (puntos[3].x - puntos[2].x);
        let n = puntos[2].y - (m * puntos[2].x);
        expresiones.push(algebra.parse(`${m.toFixed(2)}*x + ${n.toFixed(2)}`));

        dibujarLinea(puntos[2], puntos[3], "#e74c3c");
        document.getElementById('display2').innerHTML = `Recta 2 (Roja): \\( y = ${expresiones[1].toString()} \\)`;
        console.log("%cRecta 2 definida: " + expresiones[1].toString(), "color: red; font-weight: bold;");
        
        resolverSistema();
    }
    if (window.MathJax) MathJax.typeset();
});

function resolverSistema() {
    try {
        var eq = new Equation(expresiones[0], expresiones[1]);
        var resX = eq.solveFor("x");
        var resY = expresiones[0].eval({x: resX});

        xSolucion = parseFloat(resX.valueOf());
        let yFinal = parseFloat(resY.constants[0].valueOf());


        ctx.save();
        ctx.fillStyle = "#f1c40f";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "black";
        ctx.beginPath();
        ctx.arc(xSolucion, yFinal, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        console.log("%cSISTEMA RESUELTO", "background: #1a5276; color: white; padding: 2px 5px;");
        console.log("Coordenada X: " + xSolucion.toFixed(2));

        document.getElementById('teorema-demo').innerHTML = `
            <p><strong>Demostración:</strong> Al igualar las funciones para hallar el punto común:</p>
            <div class='formula'>\\( ${expresiones[0].toString()} = ${expresiones[1].toString()} \\)</div>
        `;
        document.getElementById('zona-ejercicio').style.display = "block";
        MathJax.typeset();
    } catch(e) {
        console.warn("Error: Rectas paralelas.");
    }
}

function comprobarEjercicio() {
    let valUser = parseFloat(document.getElementById('inputAlumno').value);
    let feedback = document.getElementById('feedback');
    
    if (Math.abs(valUser - xSolucion) < 5) {
        feedback.innerHTML = "🏆 ¡EXCELENTE! Has hallado el punto de intersección.";
        feedback.className = "mensaje-exito";
        sonidoVictoria.play();
    } else {
        feedback.innerHTML = `❌ INCORRECTO. El valor exacto era ${xSolucion.toFixed(2)}.`;
        feedback.className = "mensaje-error";
        sonidoFallo.play();
    }
}

function reiniciarTodo() {
    puntos = []; expresiones = []; xSolucion = null;
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    document.getElementById('display1').innerHTML = "";
    document.getElementById('display2').innerHTML = "";
    document.getElementById('teorema-demo').innerHTML = "Dibuja 4 puntos para ver la demostración...";
    document.getElementById('zona-ejercicio').style.display = "none";
    document.getElementById('feedback').innerHTML = "";
    document.getElementById('feedback').className = "";
    document.getElementById('inputAlumno').value = "";
    console.clear();
    console.log("Sistema reiniciado.");
}