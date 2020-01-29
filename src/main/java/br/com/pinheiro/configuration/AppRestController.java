package br.com.pinheiro.configuration;

import br.com.pinheiro.event.NewPlayerEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.pinheiro.model.Match;
import br.com.pinheiro.model.MatchConfiguration;
import br.com.pinheiro.service.ChessService;

@RestController
public class AppRestController {
	
	@Autowired
	private ChessService chessService;

	@Autowired
	private ApplicationEventPublisher applicationEventPublisher;
	
	@PostMapping("/new_match")
	public MatchConfiguration newMatch() {
		Match newMatch;
		newMatch = chessService.createNewMatch();
		
		MatchConfiguration matchConfiguration;
		matchConfiguration = new MatchConfiguration();
		matchConfiguration.setActiveTurn(true);
		matchConfiguration.setColored(false);
		matchConfiguration.setMatch(newMatch);

		NewPlayerEvent event = new NewPlayerEvent(this, newMatch.getCode(), false);
		applicationEventPublisher.publishEvent(event);

		return matchConfiguration;
	}

	@PostMapping("/join_match")
	public MatchConfiguration joinMatch(@RequestParam(name = "code", required = true) Integer matchCode) {
		Match theMatch = chessService.getMatch(matchCode);
		
		if (theMatch == null)
			return null;
		
		MatchConfiguration matchConfiguration = new MatchConfiguration();
		matchConfiguration.setActiveTurn(false);
		matchConfiguration.setColored(true);
		matchConfiguration.setMatch(theMatch);

		NewPlayerEvent event = new NewPlayerEvent(this, theMatch.getCode(), true);
		applicationEventPublisher.publishEvent(event);
		
		return matchConfiguration;
	}

}
