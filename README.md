# BTechStudies – AI-Powered Notes ChatBot

**BTechStudies** is a web application that allows students to **upload, store, and query academic notes** efficiently. The system uses **PDF vector embeddings** to answer queries from uploaded notes, making studying and reference easier.

---

## Features

- **Upload Notes:** Students can upload PDFs categorized by **semester, branch, note type, and subject**.
- **PDF Vector Storage:** Notes are converted into **vector embeddings** for quick semantic search.
- **Ask Questions:** Ask questions and get answers directly from uploaded PDFs.
- **Branch & Semester Wise Organization:** Supports multiple engineering branches and semesters.
- **User-Friendly Interface:** Clean UI with selection options for semesters, branches, note types, and subjects.

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** FastAPI
- **PDF Processing:** PyPDF2
- **Embeddings:** SentenceTransformers (`all-MiniLM-L6-v2`)
- **Vector Storage:** Chroma
