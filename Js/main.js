(function () {
  "use strict";

  function showToast(selector) {
    var el = document.querySelector(selector);
    if (!el) return;
    if (window.bootstrap && bootstrap.Toast) {
      bootstrap.Toast.getOrCreateInstance(el).show();
    } else {
      el.classList.add("show");
      el.style.display = "block";
      setTimeout(function () { el.classList.remove("show"); el.style.display = "none"; }, 3500);
    }
  }

  function openModal(modalElement) {
    if (!modalElement) return;
    if (window.bootstrap && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(modalElement).show();
      return;
    }
    modalElement.classList.add("show");
    modalElement.style.display = "block";
    modalElement.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open-custom");
  }

  function closeModal(modalElement) {
    if (!modalElement) return;
    if (window.bootstrap && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(modalElement).hide();
      return;
    }
    modalElement.classList.remove("show");
    modalElement.style.display = "none";
    modalElement.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open-custom");
  }

  function loadAjax(url, success, error) {
    // نستخدم jQuery Ajax إذا كانت المكتبة متاحة.
    if (window.jQuery && typeof window.jQuery.ajax === "function") {
      window.jQuery.ajax({
        url: url,
        method: "GET",
        dataType: "html",
        success: success,
        error: error
      });
      return;
    }

    // بديل Ajax حتى لا يتعطل الموقع إذا لم يتم تحميل jQuery من الإنترنت.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) success(xhr.responseText);
      else error();
    };
    xhr.onerror = error;
    xhr.send();
  }

  function validateLogin(form) {
    var email = document.getElementById("loginEmail");
    var password = document.getElementById("loginPassword");
    var emailError = document.getElementById("loginEmailError");
    var passwordError = document.getElementById("loginPasswordError");
    if (!email || !password) return;

    emailError.textContent = "";
    passwordError.textContent = "";

    if (!email.value.trim()) {
      emailError.textContent = "أدخل البريد الإلكتروني.";
      return;
    }
    if (!email.checkValidity()) {
      emailError.textContent = "أدخل بريدًا إلكترونيًا صحيحًا.";
      return;
    }
    if (password.value.length < 6) {
      passwordError.textContent = "كلمة المرور يجب أن تكون 6 أحرف على الأقل.";
      return;
    }
    showToast("#loginToast");
    form.reset();
  }

  function validateRegister(form) {
    var name = document.getElementById("registerName");
    var email = document.getElementById("registerEmail");
    var password = document.getElementById("registerPassword");
    var confirmPassword = document.getElementById("confirmPassword");
    var error = document.getElementById("registerPasswordError");
    if (!name || !email || !password || !confirmPassword) return;

    error.textContent = "";
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (password.value.length < 6) {
      error.textContent = "كلمة المرور يجب أن تكون 6 أحرف على الأقل.";
      return;
    }
    if (password.value !== confirmPassword.value) {
      error.textContent = "كلمتا المرور غير متطابقتين.";
      return;
    }
    showToast("#registerToast");
    form.reset();
  }

  function initCarouselFallback() {
    var carousel = document.getElementById("homeCarousel");
    if (!carousel) return;
    var items = carousel.querySelectorAll(".carousel-item");
    if (items.length < 2) return;

    var current = 0;
    function goTo(index) {
      items[current].classList.remove("active");
      current = (index + items.length) % items.length;
      items[current].classList.add("active");
    }

    var prev = carousel.querySelector(".carousel-control-prev");
    var next = carousel.querySelector(".carousel-control-next");
    if (prev) prev.addEventListener("click", function () { if (!(window.bootstrap && bootstrap.Carousel)) goTo(current - 1); });
    if (next) next.addEventListener("click", function () { if (!(window.bootstrap && bootstrap.Carousel)) goTo(current + 1); });

    if (!(window.bootstrap && bootstrap.Carousel)) {
      setInterval(function () { goTo(current + 1); }, 4000);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", function (e) { e.preventDefault(); validateLogin(loginForm); });

    var registerForm = document.getElementById("registerForm");
    if (registerForm) registerForm.addEventListener("submit", function (e) { e.preventDefault(); validateRegister(registerForm); });

    var contactForm = document.getElementById("contactForm");
    if (contactForm) contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      showToast("#contactToast");
      contactForm.reset();
    });

    document.querySelectorAll(".ajax-modal").forEach(function (button) {
      button.addEventListener("click", function () {
        var target = button.getAttribute("data-target");
        var file = button.getAttribute("data-file");
        var modal = document.querySelector(target);
        if (!modal) return;
        var body = modal.querySelector(".modal-body");
        if (body) body.innerHTML = "<p>جاري تحميل المعلومات...</p>";
        openModal(modal);
        loadAjax(file, function (data) {
          if (body) body.innerHTML = data;
        }, function () {
          if (body) body.innerHTML = "<p>تعذر تحميل المحتوى. تأكد من تشغيل الموقع بواسطة Live Server.</p>";
        });
      });
    });

    document.querySelectorAll(".modal .btn-close").forEach(function (button) {
      button.addEventListener("click", function () { closeModal(button.closest(".modal")); });
    });

    document.querySelectorAll(".modal").forEach(function (modal) {
      modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(modal); });
    });

    initCarouselFallback();
  });
})();
