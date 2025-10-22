import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from vector_data_manager import vector_storage , vector_query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR = "pdfstore"

class ChatRequest(BaseModel):
    semester: str
    branch: str
    noteType: str
    module: str
    subject: str
    query: str

@app.post("/upload/")
async def UploadFile(
    semester: str = Form(...),
    branch: str = Form(...),
    note_type: str = Form(...),
    module: str = Form(...),
    subject: str = Form(...),
    file: UploadFile = File(...)
):
    upload_path = f"{UPLOADS_DIR}/{note_type}/{semester}/{branch}/{subject}"
    os.makedirs(upload_path, exist_ok=True)
    file_path = f"{upload_path}/{module}.pdf"
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    response = vector_storage(note_type, semester, branch, subject, module, file_path)
    print(response)
    
    return {"message": "Upload Successful"}

@app.post("/chatbot/")
async def chatbot_endpoint(request: ChatRequest):
    answer = vector_query(
        note_type=request.noteType,
        semester=request.semester,
        branch=request.branch,
        module=request.module,
        subject=request.subject,
        query=request.query
    )
    if not answer:
        answer = "Sorry, no answer found."
    return {"answer": answer}