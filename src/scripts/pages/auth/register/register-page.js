// src/scripts/pages/auth/register/register-page.js
import RegisterPresenter from "./register-presenter";
import * as ceritakulinerAPI from "../../../data/api";

export default class RegisterPage {
  #presenter = null;

  // src/scripts/pages/auth/register/register-page.js
async render() {
  return `
    <section class="auth-container register-theme">
      <article class="auth-card">
        <h1 class="auth-title">Buat Akun Baru</h1>

        <form id="register-form" class="auth-form">
          <div class="form-group">
            <label for="name-input">Nama Lengkap</label>
            <input id="name-input" type="text" name="name" placeholder="nama lengkap" required>
          </div>

          <div class="form-group">
            <label for="email-input">Email</label>
            <input id="email-input" type="email" name="email" placeholder="contoh@email.com" required>
          </div>

          <div class="form-group">
            <label for="password-input">Password</label>
            <input id="password-input" type="password" name="password" placeholder="password baru" required>
          </div>

          <div id="submit-button-container">
            <button class="btn-auth" type="submit">Daftar</button>
          </div>
          <p class="auth-switch">Sudah punya akun? <a href="#/login">Masuk disini</a></p>
        </form>
      </article>
    </section>
  `;
}


  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: ceritakulinerAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          name: document.getElementById("name-input").value,
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };
        await this.#presenter.registerUser(data);
      });
  }

  registeredSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = "/login";
  }

  registeredFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Daftar
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Daftar</button>
    `;
  }
}
