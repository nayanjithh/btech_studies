# vector_data_manager.py
import os
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.base import Embeddings
from langchain_community.vectorstores import Chroma

import base64
import os
from google import genai
from google.genai import types

VECTORSTORE_DIR = "vectorstore"

def generate(query, content):
    client = genai.Client(
        api_key="AIzaSyB_S6bvUxuRIWo7fPloXh12IS6tw5lv89Q",
    )

    model = "gemini-flash-lite-latest"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=f"Answer the question '{query}' using only the following content from the PDF: '{content}'. Do not include any information not present in this content. Be clear and concise."),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        thinking_config = types.ThinkingConfig(
            thinking_budget=0,
        ),
        safety_settings=[
            types.SafetySetting(
                category="HARM_CATEGORY_HARASSMENT",
                threshold="BLOCK_NONE",  # Block none
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_HATE_SPEECH",
                threshold="BLOCK_NONE",  # Block none
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold="BLOCK_NONE",  # Block none
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold="BLOCK_NONE",  # Block none
            ),
        ],
        system_instruction=[
            types.Part.from_text(text="""Retrive"""),
        ],
    )
    response = ""

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        response += chunk.text
    return response

class LocalEmbedding(Embeddings):
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts):
        return [self.model.encode(t).tolist() for t in texts]

    def embed_query(self, text):
        return self.model.encode([text])[0].tolist()


def vector_storage(note_type, semester, branch, subject, module, file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
    except Exception as e:
        return {"error": f"Error reading PDF: {str(e)}"}

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks = splitter.create_documents([text])

    for chunk in chunks:
        chunk.metadata.update({
            "semester": semester,
            "branch": branch,
            "note_type": note_type,
            "subject": subject,
            "filename": module
        })

    embedding_function = LocalEmbedding()

    vector_path = os.path.join(VECTORSTORE_DIR, note_type, semester, branch, subject, module)
    os.makedirs(vector_path, exist_ok=True)

    db = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_function,
        persist_directory=vector_path
    )

    db.persist()
    return {"message": f"Stored {len(chunks)} chunks for {module}"}


def vector_query(note_type, semester, branch, module, subject, query, top_k=3):
    vector_path = os.path.join(VECTORSTORE_DIR, note_type, semester, branch, subject, module)
    if not os.path.exists(vector_path):
        return "No notes found for this subject."
    
    embedding_function = LocalEmbedding()
    
    db = Chroma(persist_directory=vector_path, embedding_function=embedding_function)
    
    results = db.similarity_search(query, k=top_k)
    if not results:
        return "No relevant notes found."
    
    answer = "\n\n".join([r.page_content for r in results])
    return generate(query, answer)
