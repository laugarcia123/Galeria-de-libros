from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Libro(Base):
    __tablename__ = "libros"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    autor = Column(String)
    calificacion = Column(Integer)
    es_favorito = Column(Boolean, default=False)