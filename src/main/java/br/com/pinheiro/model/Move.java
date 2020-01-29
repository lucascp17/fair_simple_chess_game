package br.com.pinheiro.model;

public class Move {

	private int matchCode;
	private boolean playerColor;

	private int fromX;
	private int fromY;
	
	private int toX;
	private int toY;

	public boolean getPlayerColor() {
		return playerColor;
	}

	public void setPlayerColor(boolean playerColor) {
		this.playerColor = playerColor;
	}

	public int getMatchCode() {
		return matchCode;
	}

	public void setMatchCode(int matchCode) {
		this.matchCode = matchCode;
	}
	
	public int getFromX() {
		return fromX;
	}
	
	public void setFromX(int fromX) {
		this.fromX = fromX;
	}
	
	public int getFromY() {
		return fromY;
	}
	
	public void setFromY(int fromY) {
		this.fromY = fromY;
	}
	
	public int getToX() {
		return toX;
	}
	
	public void setToX(int toX) {
		this.toX = toX;
	}
	
	public int getToY() {
		return toY;
	}
	
	public void setToY(int toY) {
		this.toY = toY;
	}

}
