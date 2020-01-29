package br.com.pinheiro.model;

public class MatchConfiguration {

    private Match match;
    private Boolean activeTurn;
    private Boolean colored;

    public Match getMatch() {
        return this.match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public Boolean getActiveTurn() {
    	return this.activeTurn;
    }
    
    public void setActiveTurn(Boolean activeTurn) {
    	this.activeTurn = activeTurn;
    }

    public Boolean getColored() {
    	return this.colored;
    }

    public void setColored(Boolean color) {
    	this.colored = color;
    }

}