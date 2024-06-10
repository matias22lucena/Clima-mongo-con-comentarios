const { useState, useEffect } = React; // Importación de hooks de React

const API_CLAVE = "24aab2eb8aec803263f83e8daefaa6f4"; // Clave de la API de OpenWeatherMap

const AppClima = () => {    
    const [clima, setClima] = useState(null); // Estado para almacenar los datos del clima
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState("Madrid"); // Estado para la ciudad seleccionada
    const [entradaBuscar, setEntradaBuscar] = useState(""); // Estado para la entrada de búsqueda
    const urlIcono = clima ? `./openweathermap/${clima.weather[0].icon}.svg` : ""; // URL del icono del clima, se construye si hay datos de clima

    const obtenerClima = async (ciudad) => {
        try {
            const respuesta = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_CLAVE}&units=metric`
            ); // Llamada a la API para obtener los datos del clima para la ciudad especificada
            const datos = await respuesta.json(); // Convertir la respuesta de la API a formato JSON
            setClima(datos); // Actualizar el estado con los datos obtenidos del clima

            // Enviar una solicitud para guardar los datos del clima en el servidor local
            await fetch('http://localhost:3000/clima', {
                method: 'POST', // Método de la solicitud HTTP
                headers: {
                    'Content-Type': 'application/json',
                }, // Encabezados de la solicitud HTTP
                body: JSON.stringify({
                    ciudad: datos.name,
                    clima: `Temperatura: ${datos.main.temp}C°, Mínima: ${datos.main.temp_min}C°, Máxima: ${datos.main.temp_max}C°, Humedad: ${datos.main.humidity}%`
                }) // Cuerpo de la solicitud HTTP en formato JSON
            }); 
        } catch (error) {
            console.error('Error al obtener el clima o guardar en el servidor', error); // Manejo de errores en caso de que falle la obtención de datos o el guardado en el servidor
        }
    };

    useEffect(() => {
        obtenerClima(ciudadSeleccionada); // Llamar a obtenerClima cada vez que ciudadSeleccionada cambia
    }, [ciudadSeleccionada]); // Arreglo de dependencias: se ejecuta cuando ciudadSeleccionada cambia

    const cambioEntradaBuscar = (evento) => {
        setEntradaBuscar(evento.target.value); // Actualizar el estado entradaBuscar cuando el usuario escribe en el campo de búsqueda
    };

    const manejarBuscar = () => {
        if (entradaBuscar.trim() !== "") {
            setCiudadSeleccionada(entradaBuscar); // Actualizar ciudadSeleccionada con el valor del estado entradaBuscar
            setEntradaBuscar(""); // Limpiar el campo de entrada de búsqueda
        }
    };

    const manejarTeclaPresionada = (evento) => {
        if (evento.key === "Enter") {
            manejarBuscar(); // Llamar a manejarBuscar cuando se presiona la tecla Enter
        }
    };

    return (
        <>
            <nav>
                <ul>
                    <li>
                        <h1 className="title">Weather App</h1>
                    </li>
                </ul>
            </nav>

            <div className="search-container">
                <input
                    className="search"
                    type="search"
                    name="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={entradaBuscar}
                    onChange={cambioEntradaBuscar} // Manejar el cambio de entrada de búsqueda
                    onKeyDown={manejarTeclaPresionada} // Manejar la presión de teclas en el campo de búsqueda
                />
            </div>

            <div className="Ciudad_Clima">
                {ciudadSeleccionada && clima && ( // Mostrar los datos del clima solo si ciudadSeleccionada y clima están definidos
                    <>
                        <article className="datos">
                            <header>
                                <h2>{ciudadSeleccionada}</h2>
                            </header>
                            <div className="iconos">
                                <img src={urlIcono} alt="Icono del Clima" /> 
                            </div>
                            <footer>
                                <h2>Temperatura: {clima.main.temp}C°</h2>
                                <p>
                                    Mínima: {clima.main.temp_min}C° / Máxima: {clima.main.temp_max}C°
                                </p>
                                <p>Humedad: {clima.main.humidity}%</p>
                            </footer>
                        </article>
                    </>
                )}
            </div>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')); // Crear la raíz de React en el elemento con id 'root'
root.render(<AppClima />); // Renderizar el componente AppClima
