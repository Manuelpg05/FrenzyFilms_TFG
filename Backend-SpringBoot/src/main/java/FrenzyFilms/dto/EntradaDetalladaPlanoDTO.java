package FrenzyFilms.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import FrenzyFilms.entity.Formato;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntradaDetalladaPlanoDTO {
    private int idEntrada;
    private int numFila;
    private int numAsiento;

    private int idSesion;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private double precioEntrada;
    private Formato formato;

    private int numSala;

    private String tituloPelicula;
    private String cartelPelicula;
}
