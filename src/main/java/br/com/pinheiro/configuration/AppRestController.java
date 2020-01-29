package br.com.pinheiro.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.pinheiro.model.Match;
import br.com.pinheiro.service.ChessService;

@RestController
public class AppRestController {
	
	@Autowired
	private ChessService chessService;
	
	@PostMapping("/new_match")
	public Match newMatch() {
		return chessService.createNewMatch();
	}

}
