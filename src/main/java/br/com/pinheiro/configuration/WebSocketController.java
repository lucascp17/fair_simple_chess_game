package br.com.pinheiro.configuration;

import br.com.pinheiro.event.NewPlayerEvent;
import br.com.pinheiro.model.Move;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController implements ApplicationListener<NewPlayerEvent> {

    @Autowired
    private SimpMessagingTemplate template;

    @MessageMapping("/move/{matchCode}")
    @SendTo("/topic/moves/{matchCode}")
    public Move move(@DestinationVariable int matchCode, Move move) {
        return move;
    }

    @Override
    public void onApplicationEvent(NewPlayerEvent event) {
        String destination = String.format("/topic/player_joined/%s", event.getMacthCode());
        String color = Boolean.toString(event.getColor());
        template.convertAndSend(destination, color);
    }

}
