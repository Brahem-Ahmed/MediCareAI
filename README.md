# MediCare AI – Frontend

This is the Angular frontend for the **MediCare AI** platform – a comprehensive healthcare ecosystem that connects patients, doctors, and healthcare professionals through AI‑assisted tools, teleconsultation, medical records, and more.

## Tech Stack
- **Angular 21** 
- **RxJS** for reactive state management
- **NgRx** (optional, for complex state – used for authentication and core data)
- **Angular Material** / Tailwind CSS for UI components
- **Angular Router** with role‑based guards
- **JWT** authentication 

## Modules
The frontend is organized by feature modules, each corresponding to a backend domain:

- **User & Auth** – login, signup, profile management, role‑based routing
- **Medical Record** – view and manage health records, prescriptions, images
- **Appointments & Scheduling** – book, reschedule, cancel appointments; video call integration
- **Symptom AI** – interactive symptom checker, risk assessment, triage advice
- **E‑Pharmacy** – medicine catalog, cart, orders, prescriptions (upload/create), inventory, refills
- **Health Tracker** – sync wearables, set goals, view insights and trends
- **Collaboration** – doctor‑doctor consultations, shared case discussions, virtual meetings
- **Community & Events** – forums, feedback, subscriptions, health webinars
