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
        grados_foto += 720;
        foto.style.transition = "transform 2s";
        foto.style.transform = "rotate(" + grados_foto + "deg)";
    }

    if (clics_foto === 10) {
        document.getElementById("mensaje-secreto").style.display = "block";
    }
});

// botón ver más en referencias
let detalles = document.querySelectorAll(".detalle-referencia");
let botones = document.querySelectorAll(".ver-mas");

botones.forEach(function (boton, i) {
    boton.addEventListener("click", function () {
        // si no está desplegado:
        if (detalles[i].style.display === "none") {
            detalles[i].style.display = "inline";
            boton.textContent = "Ver menos";
        } else {
            detalles[i].style.display = "none";
            boton.textContent = "Ver más";
        }
    });
});

// validaciones en el formulario
function mostrarError(campo, texto) {
    campo.classList.add("campo-error");
    let mensaje = document.createElement("p");
    mensaje.className = "mensaje-error";
    mensaje.textContent = texto;
    // si un campo tiene un error, lo marca y agrega debajo un mensaje explicando qué está mal
    campo.parentElement.appendChild(mensaje);
}

// quita las marcas y mensajes de error que se produjeron en el formulario
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

const tiempoEspera = setTimeout(function () {
    controlador.abort();
}, 5000);

// Crea las tarjetas HTML con los datos que recibe
function mostrarRepositorios(repositorios) {
    listaRepos.textContent = "";

    repositorios.forEach(function (repositorio) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "card repo-card";

        const nombre = document.createElement("h4");
        nombre.textContent = repositorio.name;

        const descripcion = document.createElement("p");
        if (repositorio.description) {
            descripcion.textContent = repositorio.description;
        } else {
            descripcion.textContent = "Sin descripción";
        }

        const ultimoPush = document.createElement("p");
        if (repositorio.pushed_at) {
            const fecha = new Date(repositorio.pushed_at);
            ultimoPush.textContent =
                "Último push: " +
                fecha.getDate() +
                "/" +
                (fecha.getMonth() + 1) +
                "/" +
                fecha.getFullYear();
        } else {
            ultimoPush.textContent = "Fecha no disponible en copia local";
        }

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
}

// Primero consulta la API real para mostrar los repositorios actualizados
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
                mensajeError = "408 - Tiempo de espera de la solicitud agotado";
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

        // 204 es una respuesta exitosa, pero no contiene JSON para interpretar.
        if (respuesta.status === 204) {
            return [];
        }

        return respuesta.json();
    })
    .then(function (repositorios) {
        if (repositorios.length > 0) {
            mostrarRepositorios(repositorios);
        } else {
            mostrarRepositorios();
            const aviso = document.createElement("p");
            aviso.textContent =
                "La API no devolvió repositorios. Se muestran ejemplos guardados.";
            listaRepos.appendChild(aviso);
        }
    })
    .catch(function (error) {
        console.error("No se pudieron consultar los repositorios:", error);

        // Si falla la API, igualmente se muestran tarjetas del portfolio.
        mostrarRepositorios();

        const aviso = document.createElement("p");
        aviso.className = "mensaje-repos";
        if (error.name === "AbortError") {
            aviso.textContent =
                "GitHub tardó demasiado. Se muestran repositorios guardados.";
        } else if (error.message.includes("Failed to fetch")) {
            aviso.textContent =
                "No se pudo conectar con GitHub. Se muestran repositorios guardados.";
        } else {
            aviso.textContent =
                "GitHub: " +
                error.message +
                ". Se muestran repositorios guardados.";
        }

        listaRepos.appendChild(aviso);
    })
    .finally(function () {
        clearTimeout(tiempoEspera);
    });
