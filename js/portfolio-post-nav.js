class PortfolioPostNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
          <nav class="ux-post-nav d-flex align-items-center justify-content-between flex-wrap" aria-label="Article">
            <a class="navbar-brand ux-post-nav-brand" href="../index.html#portfolio">
              <span class="ux-post-nav-brand-arrow" aria-hidden="true">←</span>
              <span class="ux-post-nav-brand-name">Portfolio</span>
            </a>
            <a class="ux-post-nav-link ux-post-nav-link--home" href="../index.html">Dan Thoreson</a>
          </nav>
        `;
  }
}

if (!customElements.get("portfolio-post-nav")) {
  customElements.define("portfolio-post-nav", PortfolioPostNav);
}

