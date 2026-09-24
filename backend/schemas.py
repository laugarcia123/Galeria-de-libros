from pydantic import BaseModel

# Esquema para crear un libro (lo que envía el usuario)
class LibroCreate(BaseModel):
    titulo: str
    autor: str
    calificacion: int
    es_favorito: bool = False

# Esquema para devolver un libro (lo que responde la API)
class LibroResponse(LibroCreate):
    id: int

    class Config:
        from_attributes = True