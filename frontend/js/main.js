document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la vista por defecto
    switchView('books');
});

function switchView(viewName) {
    // 1. Ocultar todas las secciones principales
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.add('hidden');
    });

    // 2. Mostrar la sección seleccionada
    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // 3. Resetear los estilos de todos los botones de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        // Quitar estado activo
        btn.classList.remove('bg-white/10', 'text-white');
        btn.classList.add('text-gray-400', 'hover:bg-white/5');
        
        // Esconder el indicador naranja (punto lateral)
        const indicator = btn.querySelector('span');
        if (indicator) {
            indicator.classList.remove('bg-[#E87A5D]');
            indicator.classList.add('bg-transparent');
        }
    });

    // 4. Aplicar estilos activos al botón de navegación clickeado
    const activeBtn = document.getElementById(`nav-${viewName}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-400', 'hover:bg-white/5');
        activeBtn.classList.add('bg-white/10', 'text-white');
        
        // Mostrar el indicador naranja
        const activeIndicator = activeBtn.querySelector('span');
        if (activeIndicator) {
            activeIndicator.classList.remove('bg-transparent');
            activeIndicator.classList.add('bg-[#E87A5D]');
        }
    }
}

// La URL donde tu servidor FastAPI está escuchando
const API_URL = "http://127.0.0.1:8000/libros/";
const gridLibros = document.querySelector('.books-grid');

// Función asíncrona para traer los datos
async function cargarLibros() {
    try {
        const respuesta = await fetch(API_URL);
        const libros = await respuesta.json();

        // Limpiar la cuadrícula para borrar los libros de prueba
        gridLibros.innerHTML = '';

        // Recorrer cada libro de la base de datos y dibujarlo
        libros.forEach(libro => {
            // Estrellas doradas y grises según la calificación
            const estrellas = '★'.repeat(libro.calificacion) + '☆'.repeat(5 - libro.calificacion);
            // Cambiar color del corazón si es favorito
            const colorCorazon = libro.es_favorito ? 'text-red-500 fill-red-500' : 'text-gray-400';

            // Crear el molde HTML con tus clases de Tailwind
            const tarjeta = `
                <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                    <button class="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full ${colorCorazon} hover:text-red-500 z-10 shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </button>
                    <div class="h-64 bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500">
                        <span class="text-sm font-medium">Sin Portada</span>
                    </div>
                    <div class="p-4">
                        <p class="text-[10px] uppercase tracking-wider text-[#E87A5D] font-semibold mb-1">Libro</p>
                        <h3 class="font-semibold text-gray-800 text-sm mb-1 truncate">${libro.titulo}</h3>
                        <p class="text-xs text-gray-500 mb-2">${libro.autor}</p>
                        <div class="flex text-[#F2C94C] text-xs">
                            ${estrellas}
                        </div>
                    </div>
                </div>
            `;
            
            // Insertar la tarjeta en la página
            gridLibros.innerHTML += tarjeta;
        });
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

// Seleccionar el formulario
const formNuevoLibro = document.getElementById('form-nuevo-libro');

// Escuchar el evento de envío (submit)
formNuevoLibro.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // Evita que la página se recargue y parpadee

    // Recolectar la información de las cajas de texto
    const nuevoLibro = {
        titulo: document.getElementById('input-titulo').value,
        autor: document.getElementById('input-autor').value,
        calificacion: parseInt(document.getElementById('input-calificacion').value),
        es_favorito: document.getElementById('input-favorito').checked
    };

    try {
        // Enviar la petición POST al servidor
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoLibro)
        });

        // Si el servidor responde que todo salió bien (Código 200)
        if (respuesta.ok) {
            formNuevoLibro.reset(); // Limpiar el formulario
            cargarLibros(); // Recargar la cuadrícula automáticamente para ver el libro nuevo
        }
    } catch (error) {
        console.error("Error al guardar el libro:", error);
    }
});

// Ejecutar la función apenas la página termine de cargar
document.addEventListener('DOMContentLoaded', cargarLibros);