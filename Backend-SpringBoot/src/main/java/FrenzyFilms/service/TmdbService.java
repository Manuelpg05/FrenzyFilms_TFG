package FrenzyFilms.service;

import FrenzyFilms.dto.TmdbSearchResponse;
import FrenzyFilms.dto.TmdbMovieDetail;
import FrenzyFilms.dto.TmdbReleaseDatesResponse;
import FrenzyFilms.dto.TmdbCreditsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TmdbService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    private final String baseUrl = "https://api.themoviedb.org/3";
    private final RestTemplate restTemplate = new RestTemplate();

    public TmdbSearchResponse buscarPorTitulo(String titulo, int pagina) {
        String url = baseUrl + "/search/movie"
                + "?query=" + titulo
                + "&language=es-ES"
                + "&page=" + pagina
                + "&api_key=" + apiKey;

        return restTemplate.getForObject(url, TmdbSearchResponse.class);
    }

    public TmdbMovieDetail obtenerDetallesPorId(int idTmdb) {
        String url = baseUrl + "/movie/" + idTmdb
                + "?language=es-ES"
                + "&api_key=" + apiKey;

        return restTemplate.getForObject(url, TmdbMovieDetail.class);
    }

    public TmdbCreditsResponse obtenerCreditosPorId(int idTmdb) {
        String url = baseUrl + "/movie/" + idTmdb + "/credits"
                + "?language=es-ES"
                + "&api_key=" + apiKey;

        return restTemplate.getForObject(url, TmdbCreditsResponse.class);
    }

    public String obtenerClasificacionEdad(int idTmdb) {
        String url = baseUrl + "/movie/" + idTmdb + "/release_dates?api_key=" + apiKey;
        TmdbReleaseDatesResponse response = restTemplate.getForObject(url, TmdbReleaseDatesResponse.class);

        if (response != null && response.getResults() != null) {
            for (TmdbReleaseDatesResponse.CountryRelease country : response.getResults()) {
                if ("ES".equalsIgnoreCase(country.getIso_3166_1())) {
                    for (TmdbReleaseDatesResponse.Release r : country.getRelease_dates()) {
                        if (r.getCertification() != null && !r.getCertification().isBlank()) {
                            return r.getCertification();
                        }
                    }
                }
            }
        }
        return "N/C";
    }

}
