# RTI Website Remake 🇮🇳

A modern, user-friendly remake of an **RTI (Right to Information) assistance website**, designed to make the process of understanding, preparing, filing, and tracking RTI applications simpler for citizens.

The project provides a clean web interface for navigating the RTI process, understanding filing requirements, preparing applications, and tracking RTI-related information.

> **Note:** This project is a website remake/prototype and should not be considered an official Government of India RTI portal.

---

## ✨ Features

* 🏠 **Modern Landing Page**
  Clean and responsive homepage explaining the RTI process.

* 📝 **RTI Preparation & Filing**
  Guided interface to help users understand and prepare an RTI application.

* 📋 **Filing Fields**
  Structured forms for collecting the information required during the RTI filing process.

* 🧭 **Citizen Filing Journey**
  Step-by-step visualization of the RTI filing journey.

* 🗺️ **RTI Process Map**
  Visual explanation of the different stages involved in the RTI process.

* 📊 **RTI Tracking**
  Interface for tracking the progress/status of an RTI application.

* 🤖 **Maya Assistant**
  Integrated conversational assistant UI to help users navigate the RTI process.

* ❓ **FAQ Section**
  Frequently asked questions related to RTI applications and procedures.

* 📖 **RTI Guidelines**
  Dedicated pages for understanding important RTI guidelines.

* 📱 **Responsive Design**
  Designed to work across desktop, tablet, and mobile screen sizes.

* 🧩 **Reusable Components**
  Modular React components for headers, footers, forms, filing journeys, widgets, and other UI elements.

---

## 🛠️ Tech Stack

### Frontend

* **React 19**
* **TypeScript**
* **TanStack Start**
* **TanStack Router**
* **Vite**
* **Tailwind CSS**
* **Radix UI**
* **Lucide React**

### Forms & Validation

* **React Hook Form**
* **Zod**
* **@hookform/resolvers**

### Additional Libraries

* **React Query**
* **Recharts**
* **Sonner**
* **date-fns**
* **Embla Carousel**

The project uses Vite for development/build tooling and TanStack's file-based routing structure.

---

## 📂 Project Structure

```text
RTI-Website-Remake/
│
├── public/
│   ├── favicon.png
│   └── robots.txt
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── citizen-filing-journey.tsx
│   │   ├── filing-fields.tsx
│   │   ├── four-step-process.tsx
│   │   ├── maya-chat.tsx
│   │   ├── maya-widget.tsx
│   │   ├── page-hero.tsx
│   │   ├── sample-complaints.tsx
│   │   ├── site-footer.tsx
│   │   ├── site-header.tsx
│   │   └── stats-banner.tsx
│   │
│   ├── content/
│   ├── hooks/
│   ├── lib/
│   │
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── contact.tsx
│   │   ├── faq.tsx
│   │   ├── file.tsx
│   │   ├── guide.tsx
│   │   ├── guidelines.tsx
│   │   ├── maya.tsx
│   │   ├── prepare.tsx
│   │   ├── process-map.tsx
│   │   └── track.tsx
│   │
│   ├── router.tsx
│   ├── server.ts
│   ├── start.ts
│   ├── styles.css
│   └── routeTree.gen.ts
│
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

The repository currently follows TanStack Start's file-based routing architecture, where route files inside `src/routes` correspond to application URLs.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js**
* **npm** or **Bun**
* **Git**

### 1. Clone the repository

```bash
git clone https://github.com/amrutejr/RTI-Website-Remake.git
```

### 2. Navigate into the project

```bash
cd RTI-Website-Remake
```

### 3. Install dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

### 4. Configure environment variables

Create a `.env` file using the provided example:

```bash
cp .env.example .env
```

Add any required environment variables to `.env`.

### 5. Start the development server

Using npm:

```bash
npm run dev
```

Or using Bun:

```bash
bun run dev
```

The development server will be available at the local URL shown in your terminal.

---

## 📜 Available Scripts

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start the development server     |
| `npm run build`     | Create a production build        |
| `npm run build:dev` | Create a development-mode build  |
| `npm run preview`   | Preview the production build     |
| `npm run lint`      | Run ESLint                       |
| `npm run format`    | Format the project with Prettier |

These scripts are defined in the project's `package.json`.

---

## 🧭 Application Routes

| Route          | Purpose                    |
| -------------- | -------------------------- |
| `/`            | Home page                  |
| `/prepare`     | Prepare an RTI             |
| `/file`        | RTI filing interface       |
| `/track`       | Track an RTI               |
| `/guide`       | RTI guide                  |
| `/guidelines`  | RTI guidelines             |
| `/process-map` | RTI process map            |
| `/faq`         | Frequently asked questions |
| `/contact`     | Contact page               |
| `/maya`        | Maya assistant             |

---

## 🎨 UI Architecture

The project uses reusable React components to keep the interface modular and maintainable.

Some of the major components include:

* `SiteHeader`
* `SiteFooter`
* `PageHero`
* `FilingFields`
* `CitizenFilingJourney`
* `FourStepProcess`
* `StatsBanner`
* `SampleComplaints`
* `MayaChat`
* `MayaWidget`

UI primitives are organized separately under `components/ui`, making it easier to reuse and extend the design system.

---

## 🔐 Environment Variables

Environment-specific configuration should be stored in `.env`.

A template is provided in:

```text
.env.example
```

**Do not commit sensitive API keys, tokens, passwords, or other secrets to GitHub.**

---

## 🧪 Development

Before submitting changes, it is recommended to run:

```bash
npm run lint
npm run build
```

For formatting:

```bash
npm run format
```

---

## 🤝 Contributing

Contributions and improvements are welcome.

### Workflow

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Test the application locally.
5. Run linting and build checks.

```bash
npm run lint
npm run build
```

6. Commit your changes.

```bash
git add .
git commit -m "feat: add your feature"
```

7. Push the branch.

```bash
git push origin feature/your-feature
```

8. Open a Pull Request.

---

## ⚠️ Disclaimer

This project is an independent website remake/prototype.

It is **not affiliated with, endorsed by, or operated by the Government of India or any official RTI authority**.

Users should verify important legal, procedural, and filing information through official government sources before submitting an RTI application.

---

## 📌 Future Improvements

* [ ] Connect RTI filing forms to a backend
* [ ] Add persistent RTI application tracking
* [ ] Add authentication
* [ ] Integrate official RTI APIs where available
* [ ] Improve multilingual support
* [ ] Add document/PDF generation
* [ ] Add email/SMS notifications
* [ ] Improve accessibility (WCAG)
* [ ] Add automated testing
* [ ] Add production deployment workflow

---

## 👨‍💻 Project

**RTI Website Remake**

GitHub Repository:
https://github.com/amrutejr/RTI-Website-Remake

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**Made with ❤️ using React, TypeScript and TanStack.**
