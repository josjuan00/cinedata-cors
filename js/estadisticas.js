import { estadisticasPorGenero } from "./api.js";

const form = document.getElementById("form-estadisticas");
const inputMinimo = document.getElementById("minimo");
const estado = document.getElementById("estado");
const contenedor = document.getElementById("contenedor-tabla");
const cuerpo = document.getElementById("cuerpo-tabla");

function mostrarEstado(texto, esError = false, detalles = []) {
    estado.replaceChildren();
    estado.className = esError ? "estado error" : "estado";
    estado.hidden = !texto;
    if (!texto) return;
    estado.append(document.createTextNode(texto));
    if (detalles.length) {
        const ul = document.createElement("ul");
        for (const d of detalles) {
            const li = document.createElement("li");
            li.textContent = String(d);
            ul.append(li);
        }
        estado.append(ul);
    }
}

function celda(texto, clase) {
    const td = document.createElement("td");
    td.textContent = texto;
    if (clase) td.className = clase;
    return td;
}

function pintar(filas) {
    cuerpo.replaceChildren();
    for (const f of filas) {
        const tr = document.createElement("tr");
        const nota = typeof f.notaMedia === "number" ? f.notaMedia.toFixed(2) : "—";
        tr.append(celda(f.genero), celda(String(f.total), "num"), celda(nota, "num"));
        cuerpo.append(tr);
    }
}

async function cargar() {
    const minimo = inputMinimo.value.trim();
    contenedor.hidden = true;
    mostrarEstado("Cargando estadísticas...");
    try {
        const filas = await estadisticasPorGenero(minimo);
        if (!filas.length) {
            mostrarEstado("No hay géneros que cumplan el mínimo");
            return;
        }
        pintar(filas);
        mostrarEstado("");
        contenedor.hidden = false;
    } catch (error) {
        mostrarEstado(error.message || "No se pudo cargar", true, error.detalles || []);
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    cargar();
});

cargar();
