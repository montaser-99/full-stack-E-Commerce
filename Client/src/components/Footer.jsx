import React from "react";

function Footer() {
  return (
    <footer
      className="bg-dark text-light py-3"
      style={{
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div className="container text-center small">
        <p className="mb-1">
          © {new Date().getFullYear()} <strong>E-commerce</strong> — All Rights Reserved
        </p>
        <p className="mb-0">
          Developed by{" "}
          <a
            href="https://github.com/montaser-99"
            target="_blank"
            rel="noopener noreferrer"
            className="text-info text-decoration-none fw-semibold"
          >
            Mahmoud Sheref Montaser
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
