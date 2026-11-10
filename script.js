let botonArriba = document.getElementById("arriba");

window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
        botonArriba.style.display = "block";
    } else {
        botonArriba.style.display = "none";
    }
});

botonArriba.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

let foto = document.getElementById("foto-secreta");
let mensajeSecreto = document.getElementById("mensaje-secreto");
let clicsFoto = 0;

foto.addEventListener("click", function () {
    clicsFoto++;

    if (clicsFoto === 5) {
        foto.style.transition = "transform 2s";
        foto.style.transform = "rotate(720deg)";
    }

    if (clicsFoto === 10) {
        mensajeSecreto.style.display = "block";
    }
});

let detalles = document.querySelectorAll(".detalle-referencia");
let botones = document.querySelectorAll(".ver-mas");

botones.forEach(function (boton, i) {
    boton.addEventListener("click", function () {
        if (detalles[i].style.display === "none") {
            detalles[i].style.display = "inline";
            boton.textContent = "Ver menos";
        } else {
            detalles[i].style.display = "none";
            boton.textContent = "Ver más";
        }
    });
});

function mostrarError(campo, texto) {
    campo.classList.add("campo-error");

    let aviso = document.createElement("p");
    aviso.className = "mensaje-error";
    aviso.textContent = texto;
    campo.parentElement.appendChild(aviso);
}

function limpiarErrores() {
    document.querySelectorAll(".campo-error").forEach(function (campo) {
        campo.classList.remove("campo-error");
    });

    document.querySelectorAll(".mensaje-error").forEach(function (aviso) {
        aviso.parentNode.removeChild(aviso);
    });
}

let formulario = document.getElementById("form");
let modal = document.getElementById("modal-envio");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    limpiarErrores();

    let correcto = true;
    let nombre = document.getElementById("name");
    let apellido = document.getElementById("last-name");
    let email = document.getElementById("email");
    let telefono = document.getElementById("phone");
    let asunto = document.getElementById("subject");
    let mensaje = document.getElementById("message");
    let contacto = document.querySelector(
        'input[name="contact-preference"]:checked',
    );

    let letras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]{2,40}$/;
    let numeros = /^[0-9]{10}$/;

    if (!letras.test(nombre.value)) {
        mostrarError(nombre, "Ingresa un nombre válido");
        correcto = false;
    }

    if (!letras.test(apellido.value)) {
        mostrarError(apellido, "Ingresa un apellido válido");
        correcto = false;
    }

    if (!email.value.includes("@")) {
        mostrarError(email, "Ingresa un correo válido");
        correcto = false;
    }

    if (!numeros.test(telefono.value)) {
        mostrarError(telefono, "El teléfono debe tener 10 números");
        correcto = false;
    }

    if (asunto.value.length < 2) {
        mostrarError(asunto, "Ingresa un asunto");
        correcto = false;
    }

    if (mensaje.value.length < 10) {
        mostrarError(mensaje, "El mensaje debe tener al menos 10 caracteres");
        correcto = false;
    }

    if (contacto === null) {
        let opciones = document.querySelector(".opciones-contact");
        let aviso = document.createElement("p");
        aviso.className = "mensaje-error";
        aviso.textContent = "Selecciona una opción de contacto";
        opciones.appendChild(aviso);
        correcto = false;
    }

    if (correcto) {
        modal.style.display = "block";
    }
});

let cerrarModal = document.getElementById("cerrar-modal");

cerrarModal.addEventListener("click", function () {
    modal.style.display = "none";
});

formulario.addEventListener("reset", function () {
    limpiarErrores();
});

document.getElementById("anio").textContent = new Date().getFullYear();

let listaRepos = document.getElementById("repos-recientes");
let controlador = new AbortController();

let tiempoEspera = setTimeout(function () {
    controlador.abort();
}, 5000);

function mostrarRepositorios(repositorios) {
    listaRepos.textContent = "";

    repositorios.forEach(function (repositorio) {
        let tarjeta = document.createElement("article");
        tarjeta.className = "card repo-card";

        let nombre = document.createElement("h4");
        nombre.textContent = repositorio.name;

        let descripcion = document.createElement("p");
        if (repositorio.description) {
            descripcion.textContent = repositorio.description;
        } else {
            descripcion.textContent = "Sin descripción";
        }

        let ultimoPush = document.createElement("p");
        if (repositorio.pushed_at) {
            let fecha = new Date(repositorio.pushed_at);
            ultimoPush.textContent =
                "Último push: " +
                fecha.getDate() +
                "/" +
                (fecha.getMonth() + 1) +
                "/" +
                fecha.getFullYear();
        } else {
            ultimoPush.textContent = "Fecha no disponible";
        }

        let enlace = document.createElement("a");
        enlace.href = repositorio.html_url;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.textContent = "Ver repositorio";

        tarjeta.appendChild(nombre);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(ultimoPush);
        tarjeta.appendChild(enlace);
        listaRepos.appendChild(tarjeta);
    });
}

fetch(
    "https://api.github.com/users/Flor6277/repos?sort=pushed&direction=desc&per_page=3",
    {
        method: "GET",
        signal: controlador.signal,
    },
)
    .then(function (respuesta) {
        if (!respuesta.ok) {
            let mensajeError = "";

            if (respuesta.status === 400) {
                mensajeError = "400 - Solicitud incorrecta";
            } else if (respuesta.status === 401) {
                mensajeError = "401 - No autorizado";
            } else if (respuesta.status === 403) {
                mensajeError = "403 - Acceso prohibido";
            } else if (respuesta.status === 404) {
                mensajeError = "404 - Recurso no encontrado";
            } else if (respuesta.status === 405) {
                mensajeError = "405 - Método no permitido";
            } else if (respuesta.status === 408) {
                mensajeError = "408 - Tiempo de espera agotado";
            } else if (respuesta.status === 409) {
                mensajeError = "409 - Conflicto con el recurso";
            } else if (respuesta.status === 429) {
                mensajeError = "429 - Demasiadas solicitudes";
            } else if (respuesta.status === 500) {
                mensajeError = "500 - Error interno del servidor";
            } else if (respuesta.status === 502) {
                mensajeError = "502 - Error del servidor intermedio";
            } else if (respuesta.status === 503) {
                mensajeError = "503 - Servicio no disponible";
            } else {
                mensajeError =
                    respuesta.status + " - Error HTTP no especificado";
            }

            throw new Error(mensajeError);
        }

        if (respuesta.status === 204) {
            return [];
        }

        return respuesta.json();
    })
    .then(function (repositorios) {
        mostrarRepositorios(repositorios);

        if (repositorios.length === 0) {
            listaRepos.textContent = "La API no devolvió repositorios.";
        }
    })
    .catch(function (error) {
        console.error("No se pudieron consultar los repositorios:", error);

        listaRepos.textContent = "";
        let aviso = document.createElement("p");
        aviso.className = "mensaje-repos";

        if (error.name === "AbortError") {
            aviso.textContent = "GitHub tardó demasiado en responder.";
        } else if (error.message.includes("Failed to fetch")) {
            aviso.textContent = "No se pudo conectar con GitHub.";
        } else {
            aviso.textContent = "GitHub: " + error.message + ".";
        }

        listaRepos.appendChild(aviso);
    })
    .finally(function () {
        clearTimeout(tiempoEspera);
    });
