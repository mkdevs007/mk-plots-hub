/* Brand palette — exact Pantone matches */
      --plum: #512561;
      /* Mid plum for gradients       */
      --purple: #7B2C91;
      --gold: #DFC160;
      --gallery: #F0EFEF;
      --white: #FFFFFF;
      --ink: #1C0A24;

      /* Typography */
      --font-display: 'Tanker', serif;
      --font-body: 'Poppins', sans-serif;
      --font-kannada: 'Anek Kannada', sans-serif;

      /* Type scale — fluid */
      --t-display: clamp(3rem, 7vw, 6.5rem);
      --t-h1: clamp(2rem, 4.5vw, 4rem);
      --t-h2: clamp(1.6rem, 3.2vw, 2.75rem);
      --t-h3: clamp(1.25rem, 2.2vw, 1.875rem);
      --t-h4: clamp(1rem, 1.6vw, 1.375rem);
      --t-lg: 1.125rem;
      --t-base: 1rem;
      --t-sm: 0.875rem;
      --t-xs: 0.75rem;
      --t-2xs: 0.6875rem;

      /* Spacing — 4px base grid */
      --s-1: 0.25rem;
      /* 4px  */
      --s-2: 0.5rem;
      /* 8px  */
      --s-3: 0.75rem;
      /* 12px */
      --s-4: 1rem;
      /* 16px */
      --s-5: 1.25rem;
      /* 20px */
      --s-6: 1.5rem;
      /* 24px */
      --s-8: 2rem;
      /* 32px */
      --s-10: 2.5rem;
      /* 40px */
      --s-12: 3rem;
      /* 48px */
      --s-16: 4rem;
      /* 64px */
      --s-20: 5rem;
      /* 80px */
      --s-24: 6rem;
      /* 96px */
      --s-32: 8rem;
      /* 128px */

      /* Border radius */
      --r-xs: 4px;
      --r-sm: 8px;
      --r-md: 14px;
      --r-lg: 22px;
      --r-xl: 36px;
      --r-2xl: 56px;
      --r-full: 9999px;

      /* Shadows */
      --shadow-sm: 0 1px 4px rgba(81, 37, 97, 0.10);
      --shadow-md: 0 4px 16px rgba(81, 37, 97, 0.13);
      --shadow-lg: 0 8px 36px rgba(81, 37, 97, 0.16);
      --shadow-gold: 0 4px 28px rgba(223, 193, 96, 0.28);
      --shadow-purple: 0 4px 24px rgba(123, 44, 145, 0.22);

      /* Transitions — GPU only (transform + opacity) */
      --ease: cubic-bezier(0.4, 0, 0.2, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --t-fast: 150ms var(--ease);
      --t-base: 260ms var(--ease);
      --t-slow: 420ms var(--ease);
      --t-spring: 520ms var(--ease-spring);

      /* Layout */
      --max-w: 1280px;
      --pad-x: clamp(1.25rem, 5vw, 2.5rem);
      --section: clamp(4rem, 9vw, 9rem);
    }

    /* ── 2. RESET ──────────────────────────────────────────────────── */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      font-size: 16px;
      scroll-behavior: smooth;
      -webkit-text-size-adjust: 100%;
    }

    body {
      font-family: var(--font-body);
      font-size: var(--t-base);
      color: var(--ink-mid);
      background: var(--gallery);
      line-height: 1.65;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
    }

    img {
      display: block;
      max-width: 100%;
    }

    button {
      font-family: inherit;
      cursor: pointer;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    @media (prefers-reduced-motion: reduce) {

      *,
      *::before,
      *::after {
        animation-duration: 1ms !important;
        transition-duration: 1ms !important;
      }
    }