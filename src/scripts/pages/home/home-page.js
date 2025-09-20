// src/scripts/pages/home/home-page.js
import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from "../../templates";
import HomePresenter from "./home-presenter";
import Map from "../../utils/map";
import * as ceritakulinerAPI from "../../data/api";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">🍽️ CeritaKuliner Nusantara</h1>
            <p class="hero-subtitle">Jelajahi kekayaan kuliner Indonesia dari berbagai daerah</p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">500+</span>
                <span class="stat-label">Cerita Kuliner</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">34</span>
                <span class="stat-label">Provinsi</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">1000+</span>
                <span class="stat-label">Pengguna Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Map Section -->
      <section>
        <div class="storys-list__map__container">
          <div id="map" class="storys-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <!-- Stories Section -->
      <section class="container">
        <h1 class="section-title">Cerita Kuliner Terbaru</h1>

        <div class="storys-list__container">
          <div id="storys-list"></div>
          <div id="storys-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({ view: this, model: ceritakulinerAPI });
    await this.#presenter.initialGalleryAndMap();
  }

  populateStoryList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }
    // console.log(stories);

    const html = stories.reduce((accumulator, story) => {
      if (!story.description) {
        console.warn("Data story tidak lengkap:", story);
        return accumulator;
      }

      if (this.#map) {
        // console.warn(story);
        if (story.location.latitude && story.location.longitude) {
          const coordinate = [
            story.location.latitude,
            story.location.longitude,
          ];
          const markerOptions = { alt: story.name };
          const popupOptions = { content: story.name };
          this.#map.addMarker(coordinate, markerOptions, popupOptions);
        }
      }

      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
          description: story.description,
        })
      );
    }, "");

    const storyListElement = document.getElementById("storys-list");
    if (storyListElement) {
      storyListElement.innerHTML = `<div class="storys-list">${html}</div>`;
    } else {
      console.error("Element with id 'storys-list' not found");
    }
  }

  populateStoriesListError(message) {
    const storyListElement = document.getElementById("storys-list");
    if (storyListElement) {
      storyListElement.innerHTML = generateStoriesListErrorTemplate(message);
    } else {
      console.error("Element with id 'storys-list' not found");
    }
  }

  populateStoryListError(message) {
    const storyListElement = document.getElementById("storys-list");
    if (storyListElement) {
      storyListElement.innerHTML = `<p>Gagal memuat cerita: ${message}</p>`;
    } else {
      console.error("Element with id 'storys-list' not found");
    }
  }

  async initialMap() {
    this.#map = await Map.build("#map", { zoom: 10, locate: true });
  }

  showMapLoading() {
    const mapLoadingContainer = document.getElementById("map-loading-container");
    if (mapLoadingContainer) {
      mapLoadingContainer.innerHTML = generateLoaderAbsoluteTemplate();
    } else {
      console.error("Element with id 'map-loading-container' not found");
    }
  }

  hideMapLoading() {
    const mapLoadingContainer = document.getElementById("map-loading-container");
    if (mapLoadingContainer) {
      mapLoadingContainer.innerHTML = "";
    } else {
      console.error("Element with id 'map-loading-container' not found");
    }
  }

  showLoading() {
    const loadingContainer = document.getElementById("storys-list-loading-container");
    if (loadingContainer) {
      loadingContainer.innerHTML = generateLoaderAbsoluteTemplate();
    } else {
      console.error("Element with id 'storys-list-loading-container' not found");
    }
  }

  hideLoading() {
    const loadingContainer = document.getElementById("storys-list-loading-container");
    if (loadingContainer) {
      loadingContainer.innerHTML = "";
    } else {
      console.error("Element with id 'storys-list-loading-container' not found");
    }
  }

  populateStoriesListEmpty() {
    const storyListElement = document.getElementById("storys-list");
    if (storyListElement) {
      storyListElement.innerHTML = generateStoriesListEmptyTemplate();
    } else {
      console.error("Element with id 'storys-list' not found");
    }
  }
}
