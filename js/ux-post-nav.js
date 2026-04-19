class UxPostNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
          <nav class="ux-post-nav d-flex align-items-center justify-content-between flex-wrap" aria-label="Article">
            <a class="navbar-brand ux-post-nav-brand" href="../index.html#ux-thinking">
              <span class="ux-post-nav-brand-arrow" aria-hidden="true">←</span>
              <span class="ux-post-nav-brand-name">UX Thinking</span>
            </a>
            <a class="ux-post-nav-link ux-post-nav-link--home" href="../index.html">Dan Thoreson</a>
          </nav>
        `;
  }
}

if (!customElements.get("ux-post-nav")) {
  customElements.define("ux-post-nav", UxPostNav);
}
