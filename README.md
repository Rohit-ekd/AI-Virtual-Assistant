🤖 AI Virtual Assistant

An interactive AI-powered Virtual Assistant built with modern web technologies.
It supports speech-to-text recognition, text-to-speech responses, authentication & authorization, database connectivity, and external image storage via Cloudinary.

The assistant is personalized — users can choose an avatar image and name their assistant (e.g., "Riya"). The assistant only activates when the name is mentioned in a query, making interactions natural and secure.

🚀 Features

🎤 Speech-to-Text Recognition (convert voice into text)

🔊 Text-to-Speech Responses (assistant speaks back)

🔐 User Authentication & Authorization (Signup / Signin)

🗄 Database Connectivity (store user profiles, history, and preferences)

🌩 Cloudinary Integration (store assistant avatars & user images externally)

📜 User Interaction History (track previous chats/questions)

🖼 Customizable AI Avatar (user selects or uploads image for their assistant)

✨ Personalized Naming System (assistant responds only if its chosen name is mentioned, e.g. “Who created you, Riya?”)

🎨 Interactive & Modern UI (smooth animations, responsive design, real-time updates)

🛠 Tech Stack

Frontend: React.js, Tailwind CSS, Framer Motion

Backend: Node.js, Express.js

Database: MongoDB / PostgreSQL (configurable)

Cloud Storage: Cloudinary

Authentication: JWT + bcrypt

Speech APIs:

Web Speech API / SpeechRecognition (STT)

SpeechSynthesis API (TTS)

Deployment: Vercel / Render / Railway

⚡ How It Works

User Signup / Signin → Account created & stored in DB.

Choose Avatar & Name → Select AI assistant image & name (e.g., Riya).

Activation System → Assistant only responds if its name is mentioned in the query.

Example:
✅ “Who created you, Riya?” → Assistant responds.
❌ “Who created you?” → No response.

Voice Interaction →

User speaks → Speech-to-Text converts it → Assistant processes it.

Assistant replies with Text + Voice (Text-to-Speech).

User History → Every interaction is saved in DB for personalized experience.

Cloudinary → Stores images & media files externally for scalability.

📂 Project Structure
AI-Virtual-Assistant/
│── backend/        # Node.js + Express API
│   ├── models/     # Database models
│   ├── routes/     # API routes (auth, chat, storage, etc.)
│   ├── utils/      # Cloudinary, JWT, helpers
│── frontend/       # React.js UI
│   ├── components/ # UI components (chatbox, mic, avatar, etc.)
│   ├── context/    # Global state (User, Auth, Assistant)
│   ├── assets/     # Images, icons
│── README.md       # Project documentation

Developed by Rohit Varshney 🚀
(Open for collaboration and contributions)
