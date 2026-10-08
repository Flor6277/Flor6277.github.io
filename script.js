// botón para volver arriba
window.addEventListener("scroll", function () {
    let btn = document.getElementById("arriba");

    if (window.scrollY > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
});

document.getElementById("arriba").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// clics en la foto
let clics_foto = 0;
let grados_foto = 0;

document.getElementById("foto-secreta").addEventListener("click", function () {
    clics_foto++;

    let foto = document.getElementById("foto-secreta");

    if (clics_foto === 5) {
        grados_foto = grados_foto + 360;
        foto.style.transition = "transform 1s";
        foto.style.transform = "rotate(" + grados_foto + "deg)";
    }

    if (clics_foto === 10) {
        document.getElementById("mensaje-secreto").style.display = "block";
    }
});

// ver más en referencias
function ver_mas(id_detalle, id_boton) {
    let detalle = document.getElementById(id_detalle);
    let boton = document.getElementById(id_boton);

    if (detalle.style.display === "none") {
        detalle.style.display = "inline";
        boton.textContent = "Ver menos";
    } else {
        detalle.style.display = "none";
        boton.textContent = "Ver más";
    }
}

document.getElementById("ver-maru").addEventListener("click", function () {
    ver_mas("detalle-maru", "ver-maru");
});

document.getElementById("ver-mateo").addEventListener("click", function () {
    ver_mas("detalle-mateo", "ver-mateo");
});

document.getElementById("ver-yani").addEventListener("click", function () {
    ver_mas("detalle-yani", "ver-yani");
});

// formulario
function mostrarError(campo, texto) {
    campo.classList.add("campo-error");

    let mensaje = document.createElement("p");
    mensaje.className = "mensaje-error";
    mensaje.textContent = texto;

    campo.parentElement.appendChild(mensaje);
}

function limpiarErrores() {
    document.querySelectorAll(".campo-error").forEach(function (campo) {
        campo.classList.remove("campo-error");
    });

    document.querySelectorAll(".mensaje-error").forEach(function (mensaje) {
        mensaje.parentNode.removeChild(mensaje);
    });
}

document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();

    limpiarErrores();

    let correcto = true;
    let asunto = document.getElementById("subject");
    let mensaje = document.getElementById("message");

    if (asunto.value.length < 2) {
        mostrarError(asunto, "Ingresa un asunto");
        correcto = false;
    }

    if (mensaje.value.length < 10) {
        mostrarError(mensaje, "El mensaje debe tener al menos 10 caracteres");
        correcto = false;
    }

    if (correcto) {
        document.getElementById("modal-envio").style.display = "block";
    }
});

document.getElementById("cerrar-modal").addEventListener("click", function () {
    document.getElementById("modal-envio").style.display = "none";
});

document.getElementById("form").addEventListener("reset", function () {
    limpiarErrores();
});

// año actual
let fechaActual = new Date();
document.getElementById("anio").textContent = fechaActual.getFullYear();

// últimos repositorios de GitHub
const listaRepos = document.querySelector("#repos-recientes");
const controlador = new AbortController();

setTimeout(function () {
    controlador.abort();
}, 5000);

fetch(
    "https://api.github.com/users/Flor6277/repos?sort=pushed&direction=desc&per_page=3",
    { signal: controlador.signal }
)
    .then(function (respuesta) {
        if (!respuesta.ok) {
            throw new Error("Error HTTP: " + respuesta.status);
        }

        return respuesta.json();
    })
    .then(function (repositorios) {
        repositorios.forEach(function (repositorio) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta repo-card";

            const nombre = document.createElement("h4");
            nombre.textContent = repositorio.name;

            const descripcion = document.createElement("p");

            if (repositorio.description) {
                descripcion.textContent = repositorio.description;
            } else {
                descripcion.textContent = "Sin descripción";
            }

            const fecha = new Date(repositorio.pushed_at);
            const ultimoPush = document.createElement("p");

            ultimoPush.textContent =
                "Último push: " +
                fecha.getDate() +
                "/" +
                (fecha.getMonth() + 1) +
                "/" +
                fecha.getFullYear();

            const enlace = document.createElement("a");
            enlace.href = repositorio.html_url;
            enlace.target = "_blank";
            enlace.textContent = "Ver repositorio";

            tarjeta.appendChild(nombre);
            tarjeta.appendChild(descripcion);
            tarjeta.appendChild(ultimoPush);
            tarjeta.appendChild(enlace);
            listaRepos.appendChild(tarjeta);
        });
    })
    .catch(function (error) {
        console.error("Ocurrió un error:", error);

        const mensaje = document.createElement("p");
        mensaje.textContent = "No se pudieron cargar los repositorios.";
        mensaje.style.color = "#ff6b6b";
        listaRepos.appendChild(mensaje);
    });
