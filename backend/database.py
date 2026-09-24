from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Cambia "usuario", "contraseña" y "localhost" por los datos de tu PostgreSQL
URL_BASE_DATOS = "postgresql://postgres:admin123@localhost:5432/galeria_libros"

engine = create_engine(URL_BASE_DATOS)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Función para abrir y cerrar la conexión en cada petición
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()