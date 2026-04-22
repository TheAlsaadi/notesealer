# Notesealer

> A clean, minimalist note-taking application built as a comprehensive full-stack learning project.

Notesealer is a simple note app with a clean and minimalist design, built for practice and learning purposes. The goal was to create an application that covers the fundamentals and core concepts of a production-grade full-stack REST API application — from database modeling all the way through to deployment.
---
## Core Concepts Covered

### Architecture & Conventions
- **Project Structure** — Following industry-standard file and folder naming conventions and structuring principles for maintainable, scalable codebases.
- **Exception Handling** — Centralized, consistent error handling across the API layer with meaningful responses.

### Backend
- **REST API** — Complete CRUD operations implemented following RESTful design principles.
- **Authentication** — Stateless authentication using JWT tokens for secure session management.
- **Database Layer** — JPA/Hibernate mappings for ORM-based persistence, alongside raw JDBC for understanding the layer beneath.
- **Search & Sorting** — Server-side search and sorting capabilities integrated into the API.

### Frontend
- **Optimistic UI Updates** — Settings system that updates the UI immediately, then syncs with the backend. On failure, the state gracefully rolls back to its previous value.
- **Theming System** — Multiple theme support with seamless switching.
- **Rich Text Editing** — Integration with [TipTap](https://tiptap.dev/) for a modern note editing experience.

### Design & Delivery
- **UI/UX Design** — Interface designed from scratch in Figma before implementation.
- **Deployment** — Full deployment pipeline to take the application from local development to production.
