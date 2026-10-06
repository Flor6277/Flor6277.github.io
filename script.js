window.addEventListener("scroll", function () {
    let btn = document.getElementById("arriba");

    if (window.scrollY > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
});

document.getElementById("up").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

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

function ver_mas() {
    let boton = this;
    let referencia = boton.closest("figure");
    let detalle = referencia.querySelector(".detalle-referencia");
    detalle.classList.toggle("oculto");
    if (detalle.classList.contains("oculto")) {
        boton.textContent = "Ver más";
    } else {
        boton.textContent = "Ver menos";
    }
}

document.querySelectorAll(".boton-ver-mas").forEach(function (boton) {
    boton.addEventListener("click", ver_mas);
});

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
        mensaje.remove();
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

    if (nombre.value.trim().length < 2 || !isNaN(nombre.value.trim())) {
        mostrarError(nombre, "Ingresa un nombre válido");
        correcto = false;
    }

    if (apellido.value.trim().length < 2 || !isNaN(apellido.value.trim())) {
        mostrarError(apellido, "Ingresa un apellido válido");
        correcto = false;
    }

    if (
        email.value.trim() === "" ||
        !email.value.includes("@") ||
        !email.value.includes(".")
    ) {
        mostrarError(email, "Ingresa un correo electrónico válido");
        correcto = false;
    }

    if (telefono.value.trim().length !== 10 || isNaN(telefono.value)) {
        mostrarError(telefono, "Ingresa un teléfono válido de 10 números");
        correcto = false;
    }

    if (asunto.value.trim().length < 2) {
        mostrarError(asunto, "Ingresa un asunto");
        correcto = false;
    }

    if (mensaje.value.trim().length < 10) {
        mostrarError(mensaje, "El mensaje debe tener al menos 10 caracteres");
        correcto = false;
    }

    if (correcto) {
        document.getElementById("modal-envio").style.display = "block";
    }
    document
        .getElementById("cerrar-modal")
        .addEventListener("click", function () {
            document.getElementById("modal-envio").style.display = "none";
        });
});

let fechaActual = new Date();
document.getElementById("anio").textContent = fechaActual.getFullYear();
