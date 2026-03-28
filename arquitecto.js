
let puntos = [];
const lienzo = document.getElementById('lienzoParque');
const contexto = lienzo.getContext('2d');
const visorLado = document.getElementById('medidaLado');


function calcularMetros(p1, p2) {
    let pixels = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    return pixels / 10; // 10 píxeles = 1 metro
}


function dibujarParcela() {
    contexto.clearRect(0, 0, lienzo.width, lienzo.height);
    
    if (puntos.length === 0) return;

    contexto.beginPath();
    contexto.strokeStyle = "#1a5276";
    contexto.lineWidth = 4;
    contexto.setLineDash([5, 5]); 

    for (let i = 0; i < puntos.length; i++) {
        const p = puntos[i];
        if (i === 0) {
            contexto.moveTo(p.x, p.y);
        } else {
            contexto.lineTo(p.x, p.y);
                       if (i === 1) {
                let lado = calcularMetros(puntos[0], puntos[1]);
                visorLado.innerText = lado.toFixed(2) + " m";
                console.log("%c[Sistema] Lado detectado: " + lado.toFixed(2) + " metros", "color: blue");
            }
        }
    }
    contexto.stroke();
    
     puntos.forEach(p => {
        contexto.fillStyle = "#1abc9c";
        contexto.fillRect(p.x - 5, p.y - 5, 10, 10);
    });
}


lienzo.addEventListener('mousedown', function(e) {
    if (puntos.length < 4) {         const rect = lienzo.getBoundingClientRect();
        puntos.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        dibujarParcela();
    }
});


function comprobarArea() {
    const respuestaAlumno = parseFloat(document.getElementById('respuestaArea').value);
    const feedback = document.getElementById('resultadoFeedback');
    
    if (puntos.length < 2) {
        feedback.innerHTML = "¡Primero debes dibujar al menos un lado en el plano!";
        return;
    }

    let lado = calcularMetros(puntos[0], puntos[1]);
    let areaReal = Math.pow(lado, 2);

    console.log("%c[Corrección] Área calculada por sistema: " + areaReal.toFixed(2), "font-weight: bold");

    if (Math.abs(respuestaAlumno - areaReal) < 1) {
        feedback.style.color = "#1abc9c";
        feedback.innerHTML = "<b>¡Excelente Arquitecto!</b> El área es correcta. Has diseñado la parcela perfectamente.";
    } else {
        feedback.style.color = "#e74c3c";
        feedback.innerHTML = `Hay un error en el cálculo. Según el plano, el área debería ser de unos ${areaReal.toFixed(2)} m².`;
    }
}

function reiniciarPlano() {
    puntos = [];
    visorLado.innerText = "0 m";
    document.getElementById('respuestaArea').value = "";
    document.getElementById('resultadoFeedback').innerHTML = "";
    contexto.clearRect(0, 0, lienzo.width, lienzo.height);
    console.clear();
}