import { AuthContext } from "../../../auth/AuthContext";
import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useState, useEffect} from "react";
import axios from "axios";
import './Viaje.css';
import API_URL from "../../config";

export default function Viaje() {

    const { token } = useContext(AuthContext);
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const userId = tokenPayload.sub;
    const { isPasajero } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [msg, setMsg] = useState();
    const [viajeEscogido, setViajeEscogido] = useState();
    const [fechaSalidaLegible, setFechaSalidaLegible] = useState("");
    const [fechaLlegadaLegible, setFechaLlegadaLegible] = useState("");
    const [ableInscribir, setAbleInscribir] = useState(true);


    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    useEffect(() => {
        axios.get(`${API_URL}/viajes/${id}`, config)
        .then( (response) => {
            if (response.data) {
                setViajeEscogido(response.data);
                const fecha_salida = new Date(response.data.horario_salida);
                const fecha_llegada = new Date(response.data.horario_llegada);
                const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
                setFechaSalidaLegible(fecha_salida.toLocaleDateString('es-ES', opciones));
                setFechaLlegadaLegible(fecha_llegada.toLocaleDateString('es-ES', opciones));
                if (response.data.vacantes_disponibles == 0) 
                {setAbleInscribir(false)}
            }
        } ).catch((error) => {
            console.log(error.data);
            setMsg("Debes ser pasajero para ver turnos")
            console.log(error);
        }
        )

    }, []);






    const handleClickVolver = () => {
        navigate(`/pagina-principal-pasajero`);
    }

    const handleSolicitudes = () => {
        navigate(`/viajes/${id}/solicitudes`);
    }

    const handleInscribir = () => {
        navigate(`/viajes/${id}/solicitudes/create`);
        
    }

    const handleactualizarestado = () => {
        navigate(`/viajes/${id}/update`);
        
    }

    return (
        <div>
            {viajeEscogido && (
            <div>
            <div class="container mt-5">
                <div class="row d-flex justify-content-center">
                    <div class="col-md-7">
                        <div class="card p-3 py-4">
                            <div class="text-center">
                                <div className="card-avatar mx-auto"></div>
                            </div>
                            <div class="text-center mt-3">
                                <h5 class="mt-2 mb-0">Viaje a {viajeEscogido.destino}</h5>
                                <div class="px-4 mt-1">
                                    <p class="fonts">Desde {viajeEscogido.origen} </p>
                                    <p class="fonts">Cupos disponibles: {viajeEscogido.vacantes_disponibles} </p>
                                    <p class="fonts">Hora de salida: {fechaSalidaLegible} </p>
                                    <p class="fonts">Hora de llegada: {fechaLlegadaLegible} </p>
                                    <p class="fonts">Estado: {viajeEscogido.estado} </p>
                                </div>
                                <div class="buttons" >
                                {!isPasajero && 
                                    <button  class="btn btn-outline-primary px-4" disabled= {!ableInscribir} onClick={ handleInscribir} >Inscribirme</button>
                                }

                                {isPasajero && (
                                            <>
                                                <button
                                                    className="btn btn-outline-primary px-4 mx-2" // Agrega la clase mx-2
                                                    onClick={handleSolicitudes}
                                                >
                                                    Manejar solicitudes
                                                </button>

                                                <button
                                                    className="btn btn-outline-primary px-4 mx-2" // Agrega la clase mx-2
                                                    onClick={handleactualizarestado}
                                                >
                                                    Actualizar
                                                </button>
                                            </>
                                        )}
                                
                                </div>
                                {msg &&  <h5 className="errormsj">{msg}</h5>}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={ handleClickVolver } className="btn btn-dark" style={{ marginTop: '10px' , marginLeft: '10px'}}>
                Volver
            </button> 
            </div>
            )}
        </div>
    )

}