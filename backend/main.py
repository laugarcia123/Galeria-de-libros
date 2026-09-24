from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, get_db

# Crea las tablas en PostgreSQL si no existen
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Galería de Libros")

# Configuración CORS para permitir que tu JS Vanilla hable con esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción se pone la URL exacta de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/libros/", response_model=schemas.LibroResponse)
def crear_libro(libro: schemas.LibroCreate, db: Session = Depends(get_db)):
    nuevo_libro = models.Libro(**libro.dict())
    db.add(nuevo_libro)
    db.commit()
    db.refresh(nuevo_libro)
    return nuevo_libro

@app.get("/libros/", response_model=list[schemas.LibroResponse])
def obtener_libros(db: Session = Depends(get_db)):
    return db.query(models.Libro).all()