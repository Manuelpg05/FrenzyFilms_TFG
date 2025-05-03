package FrenzyFilms.entity;

public enum ClasificacionEdad {
    APTA_TODOS_LOS_PUBLICOS("Apta para todos los públicos", "TP"),
    MAYORES_7("No recomendada para menores de 7 años", "+7"),
    MAYORES_12("No recomendada para menores de 12 años", "+12"),
    MAYORES_16("No recomendada para menores de 16 años", "+16"),
    MAYORES_18("No recomendada para menores de 18 años", "+18"),
    PENDIENTE_CALIFICACION("Pendiente de calificación", "Pte."),;

    private final String descripcion;
    private final String abreviatura;

    ClasificacionEdad(String descripcion, String abreviatura) {
        this.descripcion = descripcion;
        this.abreviatura = abreviatura;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getAbreviatura() {
        return abreviatura;
    }
}
