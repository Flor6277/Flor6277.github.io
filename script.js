// -------------------------------------------
// EFECTO 01 - Scroll to top
// -------------------------------------------

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


// -------------------------------------------
// EFECTO 02 - Clics en la foto
// -------------------------------------------

let cliks_foto = 0;
let grados_foto = 0;

document.getElementById("foto-secreta").addEventListener("click", function () {
    cliks_foto++;

    let foto = document.getElementById("foto-secreta");

    if (cliks_foto === 5) {
        grados_foto = grados_foto + 360;
        foto.style.transition = "transform 1s";
        foto.style.transform = "rotate(" + grados_foto + "deg)";
    }

    if (cliks_foto === 10) {
        document.getElementById("mensaje-secreto").style.display = "block";
    }
});


// -------------------------------------------
// EFECTO 03 - Ver más / Ver menos
// -------------------------------------------

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


// -------------------------------------------
// FORMULARIO DE CONTACTO
// -------------------------------------------

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


// -------------------------------------------
// EFECTO 04 - Año actual
// -------------------------------------------

let fechaActual = new Date();
document.getElementById("anio").textContent = fechaActual.getFullYear();

// -------------------------------------------
// ETAPA 4 - SERVICIOS WEB
// Repositorio público del portfolio
// -------------------------------------------

const controlador = new AbortController();

setTimeout(function () {
    controlador.abort();
}, 5000);

fetch("https://api.github.com/repos/Flor6277/Flor6277.github.io", {
    signal: controlador.signal
})
    .then(function (respuesta) {
        if (!respuesta.ok) {
            throw new Error("Error HTTP: " + respuesta.status);
        }

        return respuesta.json();
    })
    .then(function (datos) {
        document.getElementById("repo-nombre").textContent =
            "Repositorio: " + datos.name;

        document.getElementById("repo-propietario").textContent =
            "Propietario: " + datos.owner.login;
    })
    .catch(function (error) {
        console.error("Ocurrió un error:", error);
    });

document
    .getElementById("ver-repositorio")
    .addEventListener("click", function () {
        document.getElementById("modal-repositorio").style.display = "block";
    });

document
    .getElementById("cerrar-repositorio")
    .addEventListener("click", function () {
        document.getElementById("modal-repositorio").style.display = "none";
    });


// -------------------------------------------
// ETAPA 4 - SERVICIOS WEB
// Últimos repositorios actualizados
// -------------------------------------------

const controladorRepos = new AbortController();

setTimeout(function () {
    controladorRepos.abort();
}, 5000);

fetch(
    "https://api.github.com/users/Flor6277/repos?sort=pushed&direction=desc&per_page=3",
    {
        signal: controladorRepos.signal
    }
)
    .then(function (respuesta) {
        if (!respuesta.ok) {
            throw new Error("Error HTTP: " + respuesta.status);
        }

        return respuesta.json();
    })
    .then(function (repositorios) {
        repositorios.forEach(function (repositorio) {
            let tarjeta = document.createElement("article");
            tarjeta.className = "repo-card";

            let nombre = document.createElement("h3");
            nombre.textContent = repositorio.name;

            let descripcion = document.createElement("p");

            if (repositorio.description) {
                descripcion.textContent = repositorio.description;
            } else {
                descripcion.textContent = "Sin descripción";
            }

            let fecha = new Date(repositorio.pushed_at);
            let fechaTexto = document.createElement("p");

            fechaTexto.textContent =
                "Última modificación: " +
                fecha.getDate() +
                "/" +
                (fecha.getMonth() + 1) +
                "/" +
                fecha.getFullYear();

            let enlace = document.createElement("a");
            enlace.href = repositorio.html_url;
            enlace.target = "_blank";
            enlace.textContent = "Ver repositorio";

            tarjeta.appendChild(nombre);
            tarjeta.appendChild(descripcion);
            tarjeta.appendChild(fechaTexto);
            tarjeta.appendChild(enlace);

            document.getElementById("repos-recientes").appendChild(tarjeta);
        });
    })
    .catch(function (error) {
        let mensaje = document.createElement("p");
        mensaje.textContent = "No se pudieron cargar los repositorios.";

        document.getElementById("repos-recientes").appendChild(mensaje);

        console.error("Ocurrió un error:", error);
    });
