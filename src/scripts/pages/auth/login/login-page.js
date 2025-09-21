// src/scripts/pages/auth/login/login-page.js
import LoginPresenter from "./login-presenter";
import * as ceritakulinerAPI from "../../../data/api";
import * as AuthModel from "../../../utils/auth";

export default class LoginPage {
  #presenter = null;

  // src/scripts/pages/auth/login/login-page.js
async render() {
  return `
    <section class="auth-container login-theme">
      <article class="auth-card">
        <h1 class="auth-title">Masuk ke Akun</h1>

        <form id="login-form" class="auth-form">
          <div class="form-group">
            <label for="email-input">Email</label>
            <input id="email-input" type="email" name="email" placeholder="contoh@email.com" required>
          </div>

          <div class="form-group">
            <label for="password-input">Password</label>
            <input id="password-input" type="password" name="password" placeholder="••••••" required>
          </div>

          <div id="submit-button-container">
            <button class="btn-auth" type="submit">Masuk</button>
          </div>
          <p class="auth-switch">Belum punya akun? <a href="#/register">Daftar disini</a></p>
        </form>
      </article>
    </section>
  `;
}


  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: ceritakulinerAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };
        await this.#presenter.loginUser(data);
      });
  }

  loginSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = "/";
  }

  loginFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Masuk
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Masuk</button>
    `;
  }
}
