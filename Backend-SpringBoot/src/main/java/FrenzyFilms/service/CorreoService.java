package FrenzyFilms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import FrenzyFilms.entity.Sesion;

@Service
public class CorreoService {

    @Autowired
    private JavaMailSender mailSender;

    private final String remitente = "noreply.frenzyfilms@gmail.com";

    public void enviarAvisoCancelacion(String destinatario, Sesion sesion) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(remitente);
            mensaje.setTo(destinatario);
            mensaje.setSubject("Cancelación de sesión - FrenzyFilms");

            String cuerpo = "Hola,\n\n"
                    + "Lamentamos informarte que la sesión programada para el día "
                    + sesion.getFecha() + " a las " + sesion.getHoraInicio()
                    + " ha sido cancelada.\n\n"
                    + "Disculpa las molestias y gracias por confiar en FrenzyFilms.\n\n"
                    + "Atentamente,\n"
                    + "El equipo de FrenzyFilms";

            mensaje.setText(cuerpo);
            mailSender.send(mensaje);
            
        } catch (Exception ex) {
            throw new RuntimeException("Error al enviar el correo de cancelación: " + ex.getMessage());
        }
    }

}
