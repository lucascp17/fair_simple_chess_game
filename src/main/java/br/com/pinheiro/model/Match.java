package br.com.pinheiro.model;

public class Match {
	
	private int code;
	
	private int[][] blueprint;
	
	private long startingTime;

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public int[][] getBlueprint() {
		return blueprint;
	}

	public void setBlueprint(int[][] blueprint) {
		this.blueprint = blueprint;
	}

	public long getStartingTime() {
		return startingTime;
	}

	public void setStartingTime(long startingTime) {
		this.startingTime = startingTime;
	}

}
