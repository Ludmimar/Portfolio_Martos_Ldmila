const container = document.querySelector(".petal-container");
const flowerCount = 40; // más flores
const svgFlower = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="#ff6f91" stroke-width="1.5">
    <path d="M32 32 C36 20, 50 20, 44 32 C50 44, 36 44, 32 32 Z" fill="#ffb3c1"/>
    <circle cx="32" cy="32" r="2" fill="#ff4f70"/>
    <path d="M32 32 L36 28 M32 32 L28 28 M32 32 L36 36 M32 32 L28 36" stroke="#ff4f70" stroke-width="1"/>
  </g>
</svg>
`;

for (let i = 0; i < flowerCount; i++) {
  const flower = document.createElement("div");
  flower.classList.add("flower");
  flower.innerHTML = svgFlower;

  // Posición horizontal aleatoria
  flower.style.left = Math.random() * window.innerWidth + "px";

  // Tamaño aleatorio
  const size = 20 + Math.random() * 25;
  flower.style.width = size + "px";
  flower.style.height = size + "px";

  // Duración de caída aleatoria
  const duration = 6 + Math.random() * 6; // entre 6s y 12s
  flower.style.animationDuration = duration + "s";

  // Delay aleatorio
  flower.style.animationDelay = Math.random() * 10 + "s";

  // Rotación inicial aleatoria
  flower.style.transform = `rotate(${Math.random() * 360}deg)`;

  container.appendChild(flower);
}

document.addEventListener("DOMContentLoaded", () => {
  // Menu hamburguesa
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");

  hamburgerBtn?.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburgerBtn.classList.toggle("open");
  });

  // Cierra el menú si se hace click en un link
  document.querySelectorAll("#navLinks a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburgerBtn.classList.remove("open");
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Modal logic (projects)
  const modal = document.getElementById("modal");
  const mTitle = document.getElementById("m-title");
  const mImg = document.getElementById("m-img");
  const mDesc = document.getElementById("m-desc");
  const mStack = document.getElementById("m-stack");
  const mLink = document.getElementById("m-link");
  const mDemo = document.getElementById("m-demo"); // botón de Demo
  const mClose = document.getElementById("m-close");

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // Si se clickea un link dentro de la card → no abrir modal
      if (e.target.tagName.toLowerCase() === "a") return;

      // Asignar datos del proyecto
      mTitle.textContent =
        card.dataset.title ||
        card.querySelector("h3")?.textContent ||
        "Proyecto";
      const img = card.querySelector("img");
      mImg.src = img?.src || "";
      mImg.alt = img?.alt || "";
      mDesc.textContent = card.dataset.desc || "";
      mStack.textContent = card.dataset.stack || "";
      mLink.href = card.dataset.link || "#";

      // Configurar botón de Demo
      if (card.dataset.demo) {
        mDemo.style.display = "inline-block";
        mDemo.href = card.dataset.demo;
      } else {
        mDemo.style.display = "none";
        mDemo.href = "#";
      }

      // Mostrar modal
      modal.style.display = "flex";
    });
  });

  // Cerrar modal
  mClose.addEventListener("click", () => (modal.style.display = "none"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  //FORM
  const form = document.getElementById("contact-form");

  // Crear contenedores de mensaje si no existen
  let errorDiv = document.getElementById("form-error");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.id = "form-error";
    errorDiv.style.color = "red";
    errorDiv.style.marginBottom = "0.5rem";
    form.prepend(errorDiv);
  }

  let successDiv = document.getElementById("form-success");
  if (!successDiv) {
    successDiv = document.createElement("div");
    successDiv.id = "form-success";
    successDiv.style.color = "green";
    successDiv.style.marginBottom = "0.5rem";
    form.prepend(successDiv);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = "Enviando...";

    const data = new FormData(form);
    const name = (data.get("name") || "").trim();
    const email = (data.get("email") || "").trim();
    const message = (data.get("message") || "").trim();

    // Validaciones
    let errors = [];
    if (!name) errors.push("El nombre es obligatorio.");
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      errors.push("El email es inválido.");
    if (!message || message.length < 10)
      errors.push("El mensaje debe tener al menos 10 caracteres.");

    // Limpia mensajes previos
    errorDiv.classList.remove("show");
    successDiv.classList.remove("show");

    if (errors.length) {
      errorDiv.innerHTML = errors.join("<br>");
      errorDiv.classList.add("show");
      btn.disabled = false;
      btn.textContent = originalText;
      return;
    }

    errorDiv.textContent = "";

    // Envío real con EmailJS
    try {
      await emailjs.send("service_71n6aof", "template_fbyizub", {
        from_name: name,
        from_email: email,
        message: message,
      });

      successDiv.textContent =
        "¡Gracias! Tu mensaje fue enviado correctamente.";
      successDiv.classList.add("show");
      form.reset();
    } catch (err) {
      console.error(err);
      errorDiv.textContent =
        "Ocurrió un error al enviar el mensaje. Intenta nuevamente.";
      errorDiv.classList.add("show");
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });

  // Botón Volver arriba
  const scrollBtn = document.getElementById("scrollTopBtn");

  // Mostrar u ocultar el botón según scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  // Al hacer click, volver arriba suavemente
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // DESCARG CV
  const downloadBtn = document.getElementById("downloadBtn");

  downloadBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Previene acción inmediata
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = "Descargando...";

    const link = document.createElement("a");
    link.href = downloadBtn.href;
    link.download = "cv-Martos.Ludmila.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      downloadBtn.textContent = originalText;
    }, 1500); // Vuelve al texto original después de 1.5s
  });
});
