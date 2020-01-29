package br.com.pinheiro.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import br.com.pinheiro.model.Match;
import br.com.pinheiro.model.Move;

import static br.com.pinheiro.Constants.BLACK_BISHOP;
import static br.com.pinheiro.Constants.BLACK_KING;
import static br.com.pinheiro.Constants.BLACK_KNIGHT;
import static br.com.pinheiro.Constants.BLACK_PAWN;
import static br.com.pinheiro.Constants.BLACK_QUEEN;
import static br.com.pinheiro.Constants.BLACK_ROOK;
import static br.com.pinheiro.Constants.NONE;
import static br.com.pinheiro.Constants.WHITE_BISHOP;
import static br.com.pinheiro.Constants.WHITE_KING;
import static br.com.pinheiro.Constants.WHITE_KNIGHT;
import static br.com.pinheiro.Constants.WHITE_PAWN;
import static br.com.pinheiro.Constants.WHITE_QUEEN;
import static br.com.pinheiro.Constants.WHITE_ROOK;

@Service
public class ChessService {
	
	private static final int INITIAL_MATCH_CODE = 10000; 
	
	private int matchesCount;
	private Map<Integer, Match> matchesMap;
	
	public ChessService() {
		matchesCount = INITIAL_MATCH_CODE;
		matchesMap = new HashMap<>();
	}
	
	public Match createNewMatch() {
		int matchCode = matchesCount++;
		int[][] matchBoard = buildVirginBoardBlueprint();
		//
		Match match = new Match();
		match.setCode(matchCode);
		match.setBlueprint(matchBoard);
		match.setStartingTime(currentTime());
		//
		matchesMap.put(matchCode, match);
		//
		return match;
	}
	
	public Match getMatch(int matchCode) {
		return matchesMap.get(matchCode);
	}
	
	public void move(int matchCode, Move move) {
		int[][] blueprint = matchesMap.get(matchCode).getBlueprint();
		int piece = blueprint[move.getFromX()][move.getFromY()];
		blueprint[move.getToX()][move.getToY()] = piece;
		blueprint[move.getFromX()][move.getFromY()] = NONE;
	}
	
	private static int[][] buildVirginBoardBlueprint() {
		int[][] matrix = buildEmptyBoardBlueprint();
		//
		matrix[0][0] = BLACK_ROOK;
		matrix[0][1] = BLACK_KNIGHT;
		matrix[0][2] = BLACK_BISHOP;
		matrix[0][3] = BLACK_QUEEN;
		matrix[0][4] = BLACK_KING;
		matrix[0][5] = BLACK_BISHOP;
		matrix[0][6] = BLACK_KNIGHT;
		matrix[0][7] = BLACK_ROOK;
		//
		for (int i = 0; i < 8; ++i)
			matrix[1][i] = BLACK_PAWN;
		//
		for (int i = 0; i < 8; ++i)
			matrix[6][i] = WHITE_PAWN;
		//
		matrix[7][0] = WHITE_ROOK;
		matrix[7][1] = WHITE_KNIGHT;
		matrix[7][2] = WHITE_BISHOP;
		matrix[7][3] = WHITE_QUEEN;
		matrix[7][4] = WHITE_KING;
		matrix[7][5] = WHITE_BISHOP;
		matrix[7][6] = WHITE_KNIGHT;
		matrix[7][7] = WHITE_ROOK;
		//
		return matrix;
	}
	
	private static int[][] buildEmptyBoardBlueprint() {
		int[][] matrix = new int[8][];
		for (int i = 0; i < matrix.length; ++i) {
			matrix[i] = new int[8];
			for (int j = 0; j < matrix[i].length; ++j)
				matrix[i][j] = NONE;
		}
		return matrix;
	}
	
	private long currentTime() {
		return System.currentTimeMillis();
	}

}
