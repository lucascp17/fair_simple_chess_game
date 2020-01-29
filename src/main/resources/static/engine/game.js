var blackPiecesMatrix;
var whitePiecesMatrix;
var firstPawnMove;
var turnMode;
var currentFocus;

var matchCode;
var colored;
var state = 0;

function startEngine(code, blueprint, colorIsBlack, activeTurn, mustStartTimer) {
	matchCode = code;
	colored = colorIsBlack;
	state = 0;
    buildGame(blueprint, colored);
    buildStats();
    if (mustStartTimer)
        startTimer();
    if (activeTurn)
        waitForAParner();
    else
        waitForPartnerMove();
}

function buildGame(blueprint, colored) {
    if (colored)
        blueprint = rotateBlueprint(blueprint);
    drawTable();
    if (blueprint)
    	buildMatrixFromServerBlueprint(blueprint);
    else
    	buildMatrix();
    buildPieces();
    buildFirstPawnMove();
    buildDecorations();
    currentFocus = null;
}

function buildStats() {
    const matchCodeBar = createMatchCodeBar();
    const matchTimeBar = createMatchTimeBar();
    const instructionBar = createInstructionBar();
    //
    const stats = document.getElementById('stats');
    stats.style.marginLeft = STATS_MARGIN + 'px';
    stats.style.width = STATS_WIDTH + 'px';
    stats.appendChild(matchCodeBar);
    stats.appendChild(matchTimeBar);
    stats.appendChild(instructionBar);
}

function startGame(colored) {
    startTimer();
    if (colored)
        startBlackTurn();
    else
        startWhiteTurn();
}

function waitForAParner() {
    state = 0;
    updateInstruction();
    connect(matchCode, moveCallback, playerJoinedCallback);
}

function waitForPartnerMove() {
    state = 3;
    updateInstruction();
    connect(matchCode, moveCallback, playerJoinedCallback);
}

function createMatchCodeBar() {
    const matchCodeBarHeader = createMatchCodeBarHeader();
    const matchCodeBarLabel = createMatchCodeBarLabel();
    //
    const matchCodeBar = document.createElement('div');
    matchCodeBar.appendChild(matchCodeBarHeader);
    matchCodeBar.appendChild(matchCodeBarLabel);
    //
    return matchCodeBar;
}

function createMatchCodeBarHeader() {
    const header = document.createElement('p');
    header.style.background = BG_COLOR_DARK;
    header.style.color = 'white';
    header.style.margin = MARGIN_TOP + 'px 0px 0px 0px';
    header.style.paddingTop = MARGIN_TOP + 'px';
    header.style.paddingBottom = MARGIN_TOP + 'px';
    header.style.textAlign = 'center';
    header.innerText = MATCHS_CODE_LABEL;
    //
    return header;
}

function createMatchCodeBarLabel() {
    const codeLabel = document.createElement('p');
    codeLabel.style.background = BG_COLOR_LIGHT;
    codeLabel.style.border = 'solid 2px ' + BG_COLOR_DARK;
    codeLabel.style.color = 'black';
    codeLabel.style.margin = '0px 0px ' + (2 * MARGIN_TOP) + 'px 0px';
    codeLabel.style.paddingTop = MARGIN_TOP + 'px';
    codeLabel.style.paddingBottom = MARGIN_TOP + 'px';
    codeLabel.style.textAlign = 'center';
    codeLabel.innerText = '' + matchCode;
    //
    return codeLabel;
}

function createMatchTimeBar() {
    const matchTimeBarHeader = createMatchTimeBarHeader();
    const matchTimeBarLabel = createMatchTimeBarLabel();
    //
    const matchTimeBar = document.createElement('div');
    matchTimeBar.appendChild(matchTimeBarHeader);
    matchTimeBar.appendChild(matchTimeBarLabel);
    //
    return matchTimeBar;
}

function createMatchTimeBarHeader() {
    const header = document.createElement('p');
    header.style.background = BG_COLOR_DARK;
    header.style.color = 'white';
    header.style.margin = MARGIN_TOP + 'px 0px 0px 0px';
    header.style.paddingTop = MARGIN_TOP + 'px';
    header.style.paddingBottom = MARGIN_TOP + 'px';
    header.style.textAlign = 'center';
    header.innerText = MATCHS_TIME_LABEL;
    //
    return header;
}

function createMatchTimeBarLabel() {
    const timeLabel = document.createElement('p');
    timeLabel.style.background = BG_COLOR_LIGHT;
    timeLabel.style.border = 'solid 2px ' + BG_COLOR_DARK;
    timeLabel.style.color = 'black';
    timeLabel.style.margin = '0px 0px ' + (2 * MARGIN_TOP) + 'px 0px';
    timeLabel.style.paddingTop = MARGIN_TOP + 'px';
    timeLabel.style.paddingBottom = MARGIN_TOP + 'px';
    timeLabel.style.textAlign = 'center';
    timeLabel.innerText = '00:00:00';
    timeLabel.className = 'timer';
    //
    return timeLabel;
}

function createInstructionBar() {
    const instructionBarHeader = createInstructionBarHeader();
    const instructionBarLabel = createInstructionBarLabel();
    //
    const instructionBar = document.createElement('div');
    instructionBar.appendChild(instructionBarHeader);
    instructionBar.appendChild(instructionBarLabel);
    //
    return instructionBar;
}

function createInstructionBarHeader() {
    const header = document.createElement('p');
    header.style.background = BG_COLOR_DARK;
    header.style.color = 'white';
    header.style.margin = MARGIN_TOP + 'px 0px 0px 0px';
    header.style.paddingTop = MARGIN_TOP + 'px';
    header.style.paddingBottom = MARGIN_TOP + 'px';
    header.style.textAlign = 'center';
    header.innerText = INSTRUCTION_LABEL;
    //
    return header;
}

function createInstructionBarLabel() {
    const instructLabel = document.createElement('p');
    instructLabel.style.background = BG_COLOR_LIGHT;
    instructLabel.style.border = 'solid 2px ' + BG_COLOR_DARK;
    instructLabel.style.color = 'black';
    instructLabel.style.margin = '0px 0px ' + MARGIN_TOP + 'px 0px';
    instructLabel.style.paddingTop = MARGIN_TOP + 'px';
    instructLabel.style.paddingBottom = MARGIN_TOP + 'px';
    instructLabel.style.textAlign = 'center';
    instructLabel.innerText = '00:00:00';
    instructLabel.className = 'instruction';
    //
    return instructLabel;
}

function drawTable() {
    function bkColor(i, j) {
        let iMod = i % 2;
        let jMod = j % 2;
        return iMod === jMod ? BG_COLOR_DARK : BG_COLOR_LIGHT;
    }
    let bgTBody = document.createElement('tbody');
    bgTBody.id = 'bg-tbody';
    for (let i = 0; i < ROWS_COUNT; ++i) {
        let row = document.createElement('tr');
        for (let j = 0; j < COLS_COUNT; ++j) {
            let cell = document.createElement('td');
            cell.style.background = bkColor(i, j);
            cell.style.width = '' + CELL_WIDTH + 'px';
            cell.style.height = '' + CELL_HEIGHT + 'px';
            cell.style.margin = '0px';
            cell.style.padding = '0px';
            row.appendChild(cell);
        }
        bgTBody.appendChild(row);
    }
    let bgTable = document.createElement('table');
    bgTable.id = 'bg-table';
    bgTable.style.border = 'solid ' + BORDER_WIDTH + 'px ' + BG_COLOR_DARK;
    bgTable.cellSpacing = '0';
    bgTable.appendChild(bgTBody);
    let layer0 = document.createElement('div');
    layer0.id = 'layer-0';
    layer0.style.position = 'absolute';
    layer0.style.left = '' + MARGIN_LEFT + 'px';
    layer0.style.top = '' + MARGIN_TOP + 'px';
    layer0.style.zIndex = 1;
    layer0.appendChild(bgTable);
    let layer1 = document.createElement('div');
    layer1.id = 'layer-1';
    layer1.style.position = 'absolute';
    layer1.style.left = '' + MARGIN_LEFT + 'px';
    layer1.style.top = '' + MARGIN_TOP + 'px';
    layer1.style.zIndex = 2;
    let layer2 = document.createElement('div');
    layer2.id = 'layer-2';
    layer2.style.position = 'absolute';
    layer2.style.left = '' + MARGIN_LEFT + 'px';
    layer2.style.top = '' + MARGIN_TOP + 'px';
    layer2.style.zIndex = 3;
    let layer3 = document.createElement('div');
    layer3.id = 'layer-3';
    layer3.style.position = 'absolute';
    layer3.style.left = '' + MARGIN_LEFT + 'px';
    layer3.style.top = '' + MARGIN_TOP + 'px';
    layer3.style.zIndex = 4;
    let layer4 = document.createElement('div');
    layer4.id = 'layer-4';
    layer4.style.position = 'absolute';
    layer4.style.left = '' + MARGIN_LEFT + 'px';
    layer4.style.top = '' + MARGIN_TOP + 'px';
    layer4.style.zIndex = 5;
    let layer5 = document.createElement('div');
    layer5.id = 'layer-5';
    layer5.style.position = 'absolute';
    layer5.style.left = '' + MARGIN_LEFT + 'px';
    layer5.style.top = '' + MARGIN_TOP + 'px';
    layer5.style.zIndex = 6;
    let layer6 = document.createElement('div');
    layer6.id = 'layer-6';
    layer6.style.position = 'absolute';
    layer6.style.left = '' + MARGIN_LEFT + 'px';
    layer6.style.top = '' + MARGIN_TOP + 'px';
    layer6.style.zIndex = 7;
    let layer7 = document.createElement('div');
    layer7.id = 'layer-black';
    layer7.style.position = 'absolute';
    layer7.style.left = '' + MARGIN_LEFT + 'px';
    layer7.style.top = '' + MARGIN_TOP + 'px';
    layer7.style.zIndex = LOWER_ZINDEX;
    let layer8 = document.createElement('div');
    layer8.id = 'layer-white';
    layer8.style.position = 'absolute';
    layer8.style.left = '' + MARGIN_LEFT + 'px';
    layer8.style.top = '' + MARGIN_TOP + 'px';
    layer8.style.zIndex = UPPER_ZINDEX;
    let layer9 = document.createElement('div');
    layer9.id = 'layer-links';
    layer9.style.position = 'absolute';
    layer9.style.left = '' + MARGIN_LEFT + 'px';
    layer9.style.top = '' + MARGIN_TOP + 'px';
    layer9.style.zIndex = 40;
    let layerA = document.createElement('div');
    layerA.id = 'layer-check-threat';
    layerA.style.position = 'absolute';
    layerA.style.left = '' + MARGIN_LEFT + 'px';
    layerA.style.top = '' + MARGIN_TOP + 'px';
    layerA.style.zIndex = 30;
    let layerB = document.createElement('div');
    layerB.id = 'layer-white-won';
    layerB.style.position = 'absolute';
    layerB.style.left = '' + MARGIN_LEFT + 'px';
    layerB.style.top = '' + MARGIN_TOP + 'px';
    layerB.style.zIndex = 31;
    let layerC = document.createElement('div');
    layerC.id = 'layer-black-won';
    layerC.style.position = 'absolute';
    layerC.style.left = '' + MARGIN_LEFT + 'px';
    layerC.style.top = '' + MARGIN_TOP + 'px';
    layerC.style.zIndex = 32;
    let board = document.getElementById('board');
    board.appendChild(layer0);
    board.appendChild(layer1);
    board.appendChild(layer2);
    board.appendChild(layer3);
    board.appendChild(layer4);
    board.appendChild(layer5);
    board.appendChild(layer6);
    board.appendChild(layer7);
    board.appendChild(layer8);
    board.appendChild(layer9);
    board.appendChild(layerA);
    board.appendChild(layerB);
    board.appendChild(layerC);
}

function clearPosition(value) {
    let index = value.indexOf("px");
    return parseInt(value.substring(0, index));
}

function calcLeft(column) {
    return column * CELL_WIDTH + BORDER_WIDTH;
}

function calcTop(row) {
    return row * CELL_HEIGHT + BORDER_WIDTH;
}

function calcCoord(elem) {
    let className = elem.className;
    let tokens = className.split(" ");
    let first = tokens[0];
    let second = tokens[1];
    let x = parseInt(first.substring(1));
    let y = parseInt(second.substring(1));
    return { x, y };
}

function buildBlackPiecesMatrix() {
    blackPiecesMatrix = [];
    blackPiecesMatrix.push([ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK]);
    blackPiecesMatrix.push([PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN]);
    for (let i = 2; i < ROWS_COUNT; ++i)
        blackPiecesMatrix.push([NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE]);
}

function buildWhitePiecesMatrix() {
    whitePiecesMatrix = [];
    for (let i = 0; i < ROWS_COUNT - 2; ++i)
        whitePiecesMatrix.push([NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE]);
    whitePiecesMatrix.push([PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN]);
    whitePiecesMatrix.push([ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK]);
}

function buildMatrix() {
    buildBlackPiecesMatrix();
    buildWhitePiecesMatrix();
}

function isServerBlackPiece(piece) {
	return piece >= SERVER_BLACK_PAWN && piece <= SERVER_BLACK_KING;
}

function isServerWhitePiece(piece) {
	return piece >= SERVER_WHITE_PAWN && piece <= SERVER_WHITE_KING;
}

function translateServerPiece(piece) {
	switch (piece) {
	case SERVER_NONE:
		return NONE;
	case SERVER_WHITE_PAWN:
	case SERVER_BLACK_PAWN:
		return PAWN;
	case SERVER_WHITE_ROOK:
	case SERVER_BLACK_ROOK:
		return ROOK;
	case SERVER_WHITE_KNIGHT:
	case SERVER_BLACK_KNIGHT:
		return KNIGHT;
	case SERVER_WHITE_BISHOP:
	case SERVER_BLACK_BISHOP:
		return BISHOP;
	case SERVER_WHITE_QUEEN:
	case SERVER_BLACK_QUEEN:
		return QUEEN;
	case SERVER_WHITE_KING:
	case SERVER_BLACK_KING:
		return KING;
	}
}

function buildBlackPiecesMatrixFromServerBlueprint(blueprint, colored) {
    blackPiecesMatrix = [];
    for (let i = 0; i < blueprint.length; ++i) {
    	let row = [];
    	for (let j = 0; j < blueprint[i].length; ++j) {
    		let piece = blueprint[i][j];
    		if (isServerBlackPiece(piece))
    			row.push(translateServerPiece(piece));
    		else
    			row.push(NONE);
    	}
    	blackPiecesMatrix.push(row);
    }
}

function buildWhitePiecesMatrixFromServerBlueprint(blueprint, colored) {
    whitePiecesMatrix = [];
    for (let i = 0; i < blueprint.length; ++i) {
    	let row = [];
    	for (let j = 0; j < blueprint[i].length; ++j) {
    		let piece = blueprint[i][j];
    		if (isServerWhitePiece(piece))
    			row.push(translateServerPiece(piece));
    		else
    			row.push(NONE);
    	}
    	whitePiecesMatrix.push(row);
    }
}

function buildMatrixFromServerBlueprint(blueprint) {
	buildBlackPiecesMatrixFromServerBlueprint(blueprint);
	buildWhitePiecesMatrixFromServerBlueprint(blueprint);
}

function buildDefaultPiece() {
    let image = document.createElement('img');
    image.style.position = 'absolute';
    image.style.width = '' + CELL_WIDTH + 'px';
    image.style.height = '' + CELL_HEIGHT + 'px';
    return image;
}

function buildBlackPiece(i, j) {
    let piece = blackPiecesMatrix[i][j];
    let source;
    let className;
    switch (piece) {
        case PAWN:		
            source = BLACK_PAWN;	
            className = 'piece black pawn';
            break;
        case ROOK: 		
            source = BLACK_ROOK; 	
            className = 'piece black rook';
            break;
        case KNIGHT: 	
            source = BLACK_KNIGHT; 	
            className = 'piece black knight';
            break;
        case BISHOP:	
            source = BLACK_BISHOP;	
            className = 'piece black bishop';
            break;
        case QUEEN:		
            source = BLACK_QUEEN;	
            className = 'piece black queen';
            break;
        case KING:		
            source = BLACK_KING;
            className = 'piece black king';	
            break;
        case NONE:
        default: return;
    }
    let image = buildDefaultPiece();
    image.src = source;
    image.className = 'v' + i + ' h' + j + ' ' + className;
    image.style.top = '' + calcTop(i) + 'px';
    image.style.left = '' + calcLeft(j) + 'px';
    document.getElementById('layer-black').appendChild(image);
}

function buildAllBlackPieces() {
    for (let i = 0; i < blackPiecesMatrix.length; ++i)
        for (let j = 0; j < blackPiecesMatrix[i].length; ++j)
            buildBlackPiece(i, j);
}

function buildWhitePiece(i, j) {
    let piece = whitePiecesMatrix[i][j];
    let source;
    let className;
    switch (piece) {
        case PAWN:		
            source = WHITE_PAWN;	
            className = 'piece white pawn';
            break;
        case ROOK: 		
            source = WHITE_ROOK; 	
            className = 'piece white rook';
            break;
        case KNIGHT: 	
            source = WHITE_KNIGHT; 	
            className = 'piece white knight';
            break;
        case BISHOP:	
            source = WHITE_BISHOP;	
            className = 'piece white bishop';
            break;
        case QUEEN:		
            source = WHITE_QUEEN;	
            className = 'piece white queen';
            break;
        case KING:		
            source = WHITE_KING;	
            className = 'piece white king';
            break;
        case NONE:
        default: return;
    }
    let image = buildDefaultPiece();
    image.src = source;
    image.className = 'v' + i + ' h' + j + ' ' + className;
    image.style.top = '' + calcTop(i) + 'px';
    image.style.left = '' + calcLeft(j) + 'px';
    document.getElementById('layer-white').appendChild(image);
}

function buildAllWhitePieces() {
    for (let i = 0; i < whitePiecesMatrix.length; ++i)
        for (let j = 0; j < whitePiecesMatrix[i].length; ++j)
            buildWhitePiece(i, j);
}

function buildPieces() {
    buildAllBlackPieces();
    buildAllWhitePieces();
}

function buildFirstPawnMove() {
    let result = [];
    for (let i = 0; i < ROWS_COUNT; ++i) {
        let row = [];
        let flag = i == 1 || i == (ROWS_COUNT - 2);
        for (let j = 0; j < COLS_COUNT; ++j)
            row.push(flag);
        result.push(row);
    }
    firstPawnMove = result;
}

function buildAvailablePiecesDecoration() {
    let avTBody = document.createElement('tbody');
    for (let i = 0; i < ROWS_COUNT; ++i) {
        let row = document.createElement('tr');
        for (let j = 0; j < COLS_COUNT; ++j) {
            let shadow = document.createElement('div');
            shadow.style.backgroundColor = AVAILABLE_COLOR;
            shadow.style.width = '100%';
            shadow.style.height = '100%';
            shadow.style.borderRadius = '50%';
            shadow.style.boxShadow = '0px 0px 20px ' + AVAILABLE_COLOR;
            let cell = document.createElement('td');
            cell.id = 'availability-' + i + '-' + j;
            cell.className = 'v' + i + ' h' + j;
            cell.style.padding = '' + DC_MARGIN + 'px';
            cell.style.width = '' + (CELL_WIDTH - 2 * DC_MARGIN) + 'px';
            cell.style.height = '' + (CELL_HEIGHT - 2 * DC_MARGIN) + 'px';
            cell.style.visibility = 'hidden';
            cell.appendChild(shadow);
            row.appendChild(cell);
        }
        avTBody.appendChild(row);
    }
    let avTable = document.createElement('table');
    avTable.id = 'av-table';
    avTable.style.border = 'solid ' + BORDER_WIDTH + 'px transparent';
    avTable.cellSpacing = '0';
    avTable.appendChild(avTBody);
    document.getElementById('layer-1').appendChild(avTable);
}

function buildcurrentFocusDecoration() {
    let slTBody = document.createElement('tbody');
    for (let i = 0; i < ROWS_COUNT; ++i) {
        let row = document.createElement('tr');
        for (let j = 0; j < COLS_COUNT; ++j) {
            let shadow = document.createElement('div');
            shadow.style.backgroundColor = SELECTED_COLOR;
            shadow.style.width = '100%';
            shadow.style.height = '100%';
            shadow.style.borderRadius = '50%';
            shadow.style.boxShadow = '0px 0px 20px ' + SELECTED_COLOR;
            let cell = document.createElement('td');
            cell.id = 'selected-' + i + '-' + j;
            cell.className = 'v' + i + ' h' + j;
            cell.style.padding = '' + DC_MARGIN + 'px';
            cell.style.width = '' + (CELL_WIDTH - 2 * DC_MARGIN) + 'px';
            cell.style.height = '' + (CELL_HEIGHT - 2 * DC_MARGIN) + 'px';
            cell.style.visibility = 'hidden';
            cell.appendChild(shadow);
            row.appendChild(cell);
        }
        slTBody.appendChild(row);
    }
    let slTable = document.createElement('table');
    slTable.id = 'av-table';
    slTable.style.border = 'solid ' + BORDER_WIDTH + 'px transparent';
    slTable.cellSpacing = '0';
    slTable.appendChild(slTBody);
    document.getElementById('layer-2').appendChild(slTable);
}

function buildPossibleMovesDecoration() {
    let pmTBody = document.createElement('tbody');
    for (let i = 0; i < ROWS_COUNT; ++i) {
        let row = document.createElement('tr');
        for (let j = 0; j < COLS_COUNT; ++j) {
            let shadow = document.createElement('div');
            shadow.style.backgroundColor = POSSIBLE_COLOR;
            shadow.style.width = '100%';
            shadow.style.height = '100%';
            shadow.style.borderRadius = '50%';
            shadow.style.boxShadow = '0px 0px 20px ' + POSSIBLE_COLOR;
            let cell = document.createElement('td');
            cell.id = 'possible-move-' + i + '-' + j;
            cell.className = 'v' + i + ' h' + j;
            cell.style.padding = '' + DC_MARGIN + 'px';
            cell.style.width = '' + (CELL_WIDTH - 2 * DC_MARGIN) + 'px';
            cell.style.height = '' + (CELL_HEIGHT - 2 * DC_MARGIN) + 'px';
            cell.style.visibility = 'hidden';
            cell.appendChild(shadow);
            row.appendChild(cell);
        }
        pmTBody.appendChild(row);
    }
    let pmTable = document.createElement('table');
    pmTable.id = 'pm-table';
    pmTable.style.border = 'solid ' + BORDER_WIDTH + 'px transparent';
    pmTable.cellSpacing = '0';
    pmTable.appendChild(pmTBody);
    document.getElementById('layer-3').appendChild(pmTable);
}

function buildKillerMovesDecoration() {
    let kmTBody = document.createElement('tbody');
    for (let i = 0; i < ROWS_COUNT; ++i) {
        let row = document.createElement('tr');
        for (let j = 0; j < COLS_COUNT; ++j) {
            let shadow = document.createElement('div');
            shadow.style.backgroundColor = KILLER_COLOR;
            shadow.style.width = '100%';
            shadow.style.height = '100%';
            shadow.style.borderRadius = '50%';
            shadow.style.boxShadow = '0px 0px 20px ' + KILLER_COLOR;
            let cell = document.createElement('td');
            cell.id = 'killer-move-' + i + '-' + j;
            cell.className = 'v' + i + ' h' + j;
            cell.style.padding = '' + DC_MARGIN + 'px';
            cell.style.width = '' + (CELL_WIDTH - 2 * DC_MARGIN) + 'px';
            cell.style.height = '' + (CELL_HEIGHT - 2 * DC_MARGIN) + 'px';
            cell.style.visibility = 'hidden';
            cell.appendChild(shadow);
            row.appendChild(cell);
        }
        kmTBody.appendChild(row);
    }
    let kmTable = document.createElement('table');
    kmTable.id = 'pm-table';
    kmTable.style.border = 'solid ' + BORDER_WIDTH + 'px transparent';
    kmTable.cellSpacing = '0';
    kmTable.appendChild(kmTBody);
    document.getElementById('layer-4').appendChild(kmTable);
}

function buildThreatDecoration() {
    let tbody = document.createElement('tbody');
    for (let i = 0; i < ROWS_COUNT; ++i) {
        let row = document.createElement('tr');
        for (let j = 0; j < COLS_COUNT; ++j) {
            let shadow = document.createElement('div');
            shadow.style.backgroundColor = THREAT_COLOR;
            shadow.style.width = '100%';
            shadow.style.height = '100%';
            shadow.style.borderRadius = '50%';
            shadow.style.boxShadow = '0px 0px 20px ' + THREAT_COLOR;
            let cell = document.createElement('td');
            cell.id = 'threat-' + i + '-' + j;
            cell.className = 'v' + i + ' h' + j;
            cell.style.padding = '' + DC_MARGIN + 'px';
            cell.style.width = '' + (CELL_WIDTH - 2 * DC_MARGIN) + 'px';
            cell.style.height = '' + (CELL_HEIGHT - 2 * DC_MARGIN) + 'px';
            cell.style.visibility = 'hidden';
            cell.appendChild(shadow);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    let table = document.createElement('table');
    table.id = 'threat-table';
    table.style.border = 'solid ' + BORDER_WIDTH + 'px transparent';
    table.cellSpacing = '0';
    table.appendChild(tbody);
    document.getElementById('layer-5').appendChild(table);
}

function buildCheckDecoration() {
    let tbody = document.createElement('tbody');
    for (let i = 0; i < ROWS_COUNT; ++i) {
        let row = document.createElement('tr');
        for (let j = 0; j < COLS_COUNT; ++j) {
            let shadow = document.createElement('div');
            shadow.style.backgroundColor = CHECK_COLOR;
            shadow.style.width = '100%';
            shadow.style.height = '100%';
            shadow.style.borderRadius = '50%';
            shadow.style.boxShadow = '0px 0px 20px ' + CHECK_COLOR;
            let cell = document.createElement('td');
            cell.id = 'check-' + i + '-' + j;
            cell.className = 'v' + i + ' h' + j;
            cell.style.padding = '' + DC_MARGIN + 'px';
            cell.style.width = '' + (CELL_WIDTH - 2 * DC_MARGIN) + 'px';
            cell.style.height = '' + (CELL_HEIGHT - 2 * DC_MARGIN) + 'px';
            cell.style.visibility = 'hidden';
            cell.appendChild(shadow);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    let table = document.createElement('table');
    table.id = 'check-table';
    table.style.border = 'solid ' + BORDER_WIDTH + 'px transparent';
    table.cellSpacing = '0';
    table.appendChild(tbody);
    document.getElementById('layer-6').appendChild(table);
}

function buildLinksDecoration() {
    let linksTBody = document.createElement('tbody');
    for (let i = 0; i < ROWS_COUNT; ++i) {
        let row = document.createElement('tr');
        for (let j = 0; j < COLS_COUNT; ++j) {
            let link = document.createElement('a');
            link.id = 'link-' + i + '-' + j;
            link.className = 'v' + i + ' h' + j;
            link.href = "javascript:void(0)";
            link.style.display = 'block';
            link.style.margin = '0px';
            link.style.padding = '0px';
            link.style.width = '' + CELL_WIDTH + 'px';
            link.style.height = '' + CELL_HEIGHT + 'px';
            let cell = document.createElement('td');
            cell.className = 'v' + i + ' h' + j;
            cell.style.margin = '0px';
            cell.style.padding = '0px';
            cell.style.width = '' + CELL_WIDTH + 'px';
            cell.style.height = '' + CELL_HEIGHT + 'px';
            cell.style.visibility = 'hidden';
            cell.appendChild(link);
            row.appendChild(cell);
        }
        linksTBody.appendChild(row);
    }
    let linksTable = document.createElement('table');
    linksTable.id = 'links-table';
    linksTable.style.border = 'solid ' + BORDER_WIDTH + 'px transparent';
    linksTable.cellSpacing = '0';
    linksTable.appendChild(linksTBody);
    document.getElementById('layer-links').appendChild(linksTable);
}

function buildCheckThreatDecoration() {
    let text = document.createElement('div');
    text.innerText = CHECK_LABEL;
    text.style.fontFamily = 'Arial, Helvetica, sans-serif';
    text.style.color = "#CC1700";
    text.style.fontStyle = 'italic';
    text.style.fontWeight = 'bold';
    text.style.fontSize = CELL_HEIGHT + 'px';
    text.style.textTransform = 'uppercase';
    let background = document.createElement('div');
    background.id = 'check-threat-display';
    background.style.display = 'table-cell';
    background.style.width = '' + (BORDER_WIDTH + ROWS_COUNT * CELL_WIDTH) + 'px';
    background.style.height = '' + (BORDER_WIDTH + COLS_COUNT * CELL_HEIGHT) + 'px';
    background.style.verticalAlign = 'middle';
    background.style.textAlign = 'center';
    background.style.visibility = 'hidden';
    background.appendChild(text);
    document.getElementById('layer-check-threat').appendChild(background);
}

function buildWhiteWonDecoration() {
    let width = 2 * BORDER_WIDTH + ROWS_COUNT * CELL_WIDTH;
    let height = 2 * BORDER_WIDTH + COLS_COUNT * CELL_WIDTH;
    let text = document.createElement('div');
    text.innerText = WHITE_WINS_LABEL;
    text.style.fontFamily = 'Arial, Helvetica, sans-serif';
    text.style.color = "#FFFFFF";
    text.style.fontStyle = 'normal';
    text.style.fontWeight = 'bold';
    text.style.fontSize = CELL_HEIGHT + 'px';
    text.style.textTransform = 'uppercase';
    let background = document.createElement('div');
    background.id = 'white-won-display';
    background.style.display = 'table-cell';
    background.style.background = 'rgba(0, 0, 0, 0.7)';
    background.style.width = '' + width + 'px';
    background.style.height = '' + height + 'px';
    background.style.verticalAlign = 'middle';
    background.style.textAlign = 'center';
    background.style.visibility = 'hidden';
    background.appendChild(text);
    document.getElementById('layer-white-won').appendChild(background);
}

function buildBlackWonDecoration() {
    let width = 2 * BORDER_WIDTH + ROWS_COUNT * CELL_WIDTH;
    let height = 2 * BORDER_WIDTH + COLS_COUNT * CELL_WIDTH;
    let text = document.createElement('div');
    text.innerText = BLACK_WINS_LABEL;
    text.style.fontFamily = 'Arial, Helvetica, sans-serif';
    text.style.color = "#000000";
    text.style.fontStyle = 'normal';
    text.style.fontWeight = 'bold';
    text.style.fontSize = CELL_HEIGHT + 'px';
    text.style.textTransform = 'uppercase';
    let background = document.createElement('div');
    background.id = 'black-won-display';
    background.style.display = 'table-cell';
    background.style.background = 'rgba(255, 255, 255, 0.7)';
    background.style.width = '' + width + 'px';
    background.style.height = '' + height + 'px';
    background.style.verticalAlign = 'middle';
    background.style.textAlign = 'center';
    background.style.visibility = 'hidden';
    background.appendChild(text);
    document.getElementById('layer-black-won').appendChild(background);
}

function buildDecorations() {
    buildAvailablePiecesDecoration();
    buildcurrentFocusDecoration();
    buildPossibleMovesDecoration();
    buildKillerMovesDecoration();
    buildThreatDecoration();
    buildWhiteWonDecoration();
    buildBlackWonDecoration();
    buildCheckDecoration();
    buildLinksDecoration();
    buildCheckThreatDecoration();
}

function checkCoord(x, y) {
    return x >= 0 && x < ROWS_COUNT &&
        y >= 0 && y < COLS_COUNT;
}

function isFree(x, y) {
    return checkCoord(x, y) && blackPiecesMatrix[x][y] === NONE && whitePiecesMatrix[x][y] === NONE;
}

function hasBlackPiece(x, y) {
    return checkCoord(x, y) && blackPiecesMatrix[x][y] !== NONE;
}

function hasWhitePiece(x, y) {
    return checkCoord(x, y) && whitePiecesMatrix[x][y] !== NONE;
}

function hasRivalPiece(x, y) {
    return checkCoord(x, y) && 
        ((turnMode === WHITE && blackPiecesMatrix[x][y] !== NONE) || 
            (turnMode === BLACK && whitePiecesMatrix[x][y] !== NONE));
}

function hasFriendPiece(x, y) {
    return checkCoord(x, y) && 
        ((turnMode === WHITE && whitePiecesMatrix[x][y] !== NONE) || 
            (turnMode === BLACK && blackPiecesMatrix[x][y] !== NONE));
}

function getColor(piece) {
    let coord = calcCoord(piece);
    let blackType = blackPiecesMatrix[coord.x][coord.y];
    let whiteType = whitePiecesMatrix[coord.x][coord.y];
    if (whiteType !== NONE)
        return WHITE;
    if (blackType !== NONE)
        return BLACK;
    return null;
}

function getPieceType(piece) {
    let coord = calcCoord(piece);
    let blackType = blackPiecesMatrix[coord.x][coord.y];
    let whiteType = whitePiecesMatrix[coord.x][coord.y];
    return whiteType === NONE ? blackType : whiteType;
}

function mayMovePawn(piece) {
    let color = getColor(piece);
    if (color === null)
        return;
    let coord = calcCoord(piece);
    if (color === WHITE && !colored || color === BLACK && colored) {
        let firstPosition = { x: (coord.x - 1), y: coord.y };
        // let secondPosition = { x: (coord.x - 2), y: coord.y };
        let thirdPosition = { x: (coord.x - 1), y: (coord.y - 1) };
        let fourthPosition = { x: (coord.x - 1), y: (coord.y + 1) };
        return isFree(firstPosition.x, firstPosition.y) ||
            hasRivalPiece(thirdPosition.x, thirdPosition.y) ||
            hasRivalPiece(fourthPosition.x, fourthPosition.y);
    } else {
        let firstPosition = { x: (coord.x + 1), y: coord.y };
        // let secondPosition = { x: (coord.x + 2), y: coord.y };
        let thirdPosition = { x: (coord.x + 1), y: (coord.y - 1) };
        let fourthPosition = { x: (coord.x + 1), y: (coord.y + 1) };
        return isFree(firstPosition.x, firstPosition.y) ||
            hasRivalPiece(thirdPosition.x, thirdPosition.y) ||
            hasRivalPiece(fourthPosition.x, fourthPosition.y);
    }
}

function mayMoveRook(piece) {
    let coord = calcCoord(piece);
    let positions = [
        { x: (coord.x - 1), y: coord.y },
        { x: (coord.x + 1), y: coord.y },
        { x: coord.x, y: (coord.y - 1) },
        { x: coord.x, y: (coord.y + 1) }
    ];
    let result = false;
    for (let i = 0; i < positions.length && !result; ++i)
        result = result || isFree(positions[i].x, positions[i].y) || hasRivalPiece(positions[i].x, positions[i].y);
    return result;
}

function mayMoveKnight(piece) {
    let coord = calcCoord(piece);
    let positions = [
        { x: (coord.x - 2), y: (coord.y + 1) },
        { x: (coord.x - 1), y: (coord.y + 2) },
        { x: (coord.x + 1), y: (coord.y + 2) },
        { x: (coord.x + 2), y: (coord.y + 1) },
        { x: (coord.x - 2), y: (coord.y - 1) },
        { x: (coord.x - 1), y: (coord.y - 2) },
        { x: (coord.x + 1), y: (coord.y - 2) },
        { x: (coord.x + 2), y: (coord.y - 1) }
    ];
    let result = false;
    for (let i = 0; i < positions.length && !result; ++i)
        result = result || isFree(positions[i].x, positions[i].y) || hasRivalPiece(positions[i].x, positions[i].y);
    return result;
}

function mayMoveBishop(piece) {
    let coord = calcCoord(piece);
    let positions = [
        { x: (coord.x - 1), y: (coord.y - 1) },
        { x: (coord.x + 1), y: (coord.y - 1) },
        { x: (coord.x - 1), y: (coord.y + 1) },
        { x: (coord.x + 1), y: (coord.y + 1) },
    ];
    let result = false;
    for (let i = 0; i < positions.length && !result; ++i)
        result = result || isFree(positions[i].x, positions[i].y) || hasRivalPiece(positions[i].x, positions[i].y);
    return result;
}

function mayMoveQueen(piece) {
    let coord = calcCoord(piece);
    let positions = [
        { x: (coord.x - 1), y: coord.y },
        { x: (coord.x + 1), y: coord.y },
        { x: coord.x, y: (coord.y - 1) },
        { x: coord.x, y: (coord.y + 1) },
        { x: (coord.x - 1), y: (coord.y - 1) },
        { x: (coord.x + 1), y: (coord.y - 1) },
        { x: (coord.x - 1), y: (coord.y + 1) },
        { x: (coord.x + 1), y: (coord.y + 1) },
    ];
    let result = false;
    for (let i = 0; i < positions.length && !result; ++i)
        result = result || isFree(positions[i].x, positions[i].y) || hasRivalPiece(positions[i].x, positions[i].y);
    return result;
}

function mayMoveKing(piece) {
    let coord = calcCoord(piece);
    let positions = [
        { x: (coord.x - 1), y: coord.y },
        { x: (coord.x + 1), y: coord.y },
        { x: coord.x, y: (coord.y - 1) },
        { x: coord.x, y: (coord.y + 1) },
        { x: (coord.x - 1), y: (coord.y - 1) },
        { x: (coord.x + 1), y: (coord.y - 1) },
        { x: (coord.x - 1), y: (coord.y + 1) },
        { x: (coord.x + 1), y: (coord.y + 1) },
    ];
    let result = false;
    for (let i = 0; i < positions.length && !result; ++i)
        result = result || isFree(positions[i].x, positions[i].y) || hasRivalPiece(positions[i].x, positions[i].y);
    return result;
}

function mayMove(piece) {
    let pieceType = getPieceType(piece);
    switch (pieceType) {
        case PAWN:   return mayMovePawn(piece);
        case ROOK:   return mayMoveRook(piece);
        case KNIGHT: return mayMoveKnight(piece);
        case BISHOP: return mayMoveBishop(piece);
        case QUEEN:  return mayMoveQueen(piece);
        case KING:   return mayMoveKing(piece);
        default:     return false;
    }
}

function selectPiece() {
    let piece = event.target;
    let coord = calcCoord(piece);
    currentFocus = coord;
    resetSelection();
    showSelection(coord.x, coord.y);
    resetPossibleMoves();
    showAllPossibleMoves(piece);
    state = 2;
    updateInstruction();
}

function showAction(i, j, callback) {
    let elem = document.getElementById('link-' + i + '-' + j);
    elem.style.visibility = 'visible';
    elem.onclick = callback;
}

function hideAction(i, j) {
    let elem = document.getElementById('link-' + i + '-' + j);
    elem.style.visibility = 'hidden';
    elem.onclick = null;
}

function resetActions() {
    for (let i = 0; i < ROWS_COUNT; ++i)
        for (let j = 0; j < COLS_COUNT; ++j) {
            let elem = document.getElementById('link-' + i + '-' + j);
            elem.style.visibility = 'hidden';
            elem.onclick = null;
        }
}

function showThreat(i, j) {
    let elem = document.getElementById('threat-' + i + '-' + j);
    elem.style.visibility = 'visible';
}

function hideThreat(i, j) {
    let elem = document.getElementById('threat-' + i + '-' + j);
    if (elem.style.visibility === 'visible')
        elem.style.visibility = 'hidden';
}

function resetThreats() {
    for (let i = 0; i < ROWS_COUNT; ++i)
        for (let j = 0; j < COLS_COUNT; ++j)
            hideThreat(i, j);
}

function showCheck(i, j) {
    let elem = document.getElementById('check-' + i + '-' + j);
    elem.style.visibility = 'visible';
}

function hideCheck(i, j) {
    let elem = document.getElementById('check-' + i + '-' + j);
    if (elem.style.visibility === 'visible')
        elem.style.visibility = 'hidden';
}

function resetChecks() {
    for (let i = 0; i < ROWS_COUNT; ++i)
        for (let j = 0; j < COLS_COUNT; ++j)
            hideCheck(i, j);
}

function showAvailability(i, j) {
    let elem = document.getElementById('availability-' + i + '-' + j);
    elem.style.visibility = 'visible';
}

function hideAvailability(i, j) {
    let elem = document.getElementById('availability-' + i + '-' + j);
    if (elem.style.visibility === 'visible') {
        elem.style.visibility = 'hidden';
        hideAction(i, j);
    }
}

function resetAvailability() {
    for (let i = 0; i < ROWS_COUNT; ++i)
        for (let j = 0; j < COLS_COUNT; ++j)
            hideAvailability(i, j);
}

function showSelection(i, j) {
    let elem = document.getElementById('selected-' + i + '-' + j);
    elem.style.visibility = 'visible';
}

function hideSelection(i, j) {
    let elem = document.getElementById('selected-' + i + '-' + j);
    if (elem.style.visibility === 'visible')
        elem.style.visibility = 'hidden';
}

function resetSelection() {
    for (let i = 0; i < ROWS_COUNT; ++i)
        for (let j = 0; j < COLS_COUNT; ++j)
            hideSelection(i, j);
}

function showPawnPossibleMoves(piece) {
    let color = getColor(piece);
    if (color === null)
        return;
    let coord = calcCoord(piece);
    let firstTime = firstPawnMove[coord.x][coord.y];
    if ((color === WHITE && !colored) || (color === BLACK && colored)) {
        let firstPosition = { x: (coord.x - 1), y: coord.y };
        let secondPosition = { x: (coord.x - 2), y: coord.y };
        let thirdPosition = { x: (coord.x - 1), y: (coord.y - 1) };
        let fourthPosition = { x: (coord.x - 1), y: (coord.y + 1) };
        if (isFree(firstPosition.x, firstPosition.y)) {
            if (firstTime && isFree(secondPosition.x, secondPosition.y))
                showPossibleMove(secondPosition.x, secondPosition.y)
            showPossibleMove(firstPosition.x, firstPosition.y);
        }
        if (hasRivalPiece(thirdPosition.x, thirdPosition.y))
            showPossibleMove(thirdPosition.x, thirdPosition.y);
        if (hasRivalPiece(fourthPosition.x, fourthPosition.y))
            showPossibleMove(fourthPosition.x, fourthPosition.y);
    } else {
        let firstPosition = { x: (coord.x + 1), y: coord.y };
        let secondPosition = { x: (coord.x + 2), y: coord.y };
        let thirdPosition = { x: (coord.x + 1), y: (coord.y - 1) };
        let fourthPosition = { x: (coord.x + 1), y: (coord.y + 1) };
        if (isFree(firstPosition.x, firstPosition.y)) {
            if (firstTime && isFree(secondPosition.x, secondPosition.y))
                showPossibleMove(secondPosition.x, secondPosition.y)
            showPossibleMove(firstPosition.x, firstPosition.y);
        }
        if (hasRivalPiece(thirdPosition.x, thirdPosition.y))
            showPossibleMove(thirdPosition.x, thirdPosition.y);
        if (hasRivalPiece(fourthPosition.x, fourthPosition.y))
            showPossibleMove(fourthPosition.x, fourthPosition.y);
    }
}

function showRookPossibleMoves(piece) {
    let limit, i, j;
    let coord = calcCoord(piece);
    limit = true;
    i = coord.x - 1;
    while (i >= 0 && limit) {
        limit = isFree(i, coord.y);
        if (limit || hasRivalPiece(i, coord.y))
            showPossibleMove(i, coord.y);
        --i;
    }
    limit = true;
    i = coord.x + 1;
    while (i < ROWS_COUNT && limit) {
        limit = isFree(i, coord.y);
        if (limit || hasRivalPiece(i, coord.y))
            showPossibleMove(i, coord.y);
        ++i;
    }
    limit = true;
    i = coord.y - 1;
    while (i >= 0 && limit) {
        limit = isFree(coord.x, i);
        if (limit || hasRivalPiece(coord.x, i))
            showPossibleMove(coord.x, i);
        --i;
    }
    limit = true;
    i = coord.y + 1; 
    while (i < COLS_COUNT && limit) {
        limit = isFree(coord.x, i);
        if (limit || hasRivalPiece(coord.x, i))
            showPossibleMove(coord.x, i);
        ++i;
    }
}

function showKnightPossibleMoves(piece) {
    let coord = calcCoord(piece);
    let positions = [
        { x: (coord.x - 2), y: (coord.y + 1) },
        { x: (coord.x - 1), y: (coord.y + 2) },
        { x: (coord.x + 1), y: (coord.y + 2) },
        { x: (coord.x + 2), y: (coord.y + 1) },
        { x: (coord.x - 2), y: (coord.y - 1) },
        { x: (coord.x - 1), y: (coord.y - 2) },
        { x: (coord.x + 1), y: (coord.y - 2) },
        { x: (coord.x + 2), y: (coord.y - 1) }
    ];
    for (let i = 0; i < positions.length; ++i)
        if (isFree(positions[i].x, positions[i].y) || hasRivalPiece(positions[i].x, positions[i].y))
            showPossibleMove(positions[i].x, positions[i].y);
}

function showBishopPossibleMoves(piece) {
    let limit, i, j;
    let coord = calcCoord(piece);
    limit = true;
    i = coord.x - 1;
    j = coord.y - 1;
    while (i >= 0 && j >= 0 && limit) {
        limit = isFree(i, j);
        if (limit || hasRivalPiece(i, j))
            showPossibleMove(i, j);
        --i;
        --j;
    }
    limit = true;
    i = coord.x - 1;
    j = coord.y + 1;
    while (i >= 0 && j < COLS_COUNT && limit) {
        limit = isFree(i, j);
        if (limit || hasRivalPiece(i, j))
            showPossibleMove(i, j);
        --i;
        ++j;
    }
    limit = true;
    i = coord.x + 1;
    j = coord.y - 1;
    while (i < ROWS_COUNT && j >= 0 && limit) {
        limit = isFree(i, j);
        if (limit || hasRivalPiece(i, j))
            showPossibleMove(i, j);
        ++i;
        --j;
    }
    limit = true;
    i = coord.x + 1;
    j = coord.y + 1;
    while (i < ROWS_COUNT && j < COLS_COUNT && limit) {
        limit = isFree(i, j);
        if (limit || hasRivalPiece(i, j))
            showPossibleMove(i, j);
        ++i;
        ++j;
    }
}

function showQueenPossibleMoves(piece) {
    let limit, i, j;
    let coord = calcCoord(piece);
    limit = true;
    i = coord.x - 1;
    while (i >= 0 && limit) {
        limit = isFree(i, coord.y);
        if (limit || hasRivalPiece(i, coord.y))
            showPossibleMove(i, coord.y);
        --i;
    }
    limit = true;
    i = coord.x + 1;
    while (i < ROWS_COUNT && limit) {
        limit = isFree(i, coord.y);
        if (limit || hasRivalPiece(i, coord.y))
            showPossibleMove(i, coord.y);
        ++i;
    }
    limit = true;
    i = coord.y - 1;
    while (i >= 0 && limit) {
        limit = isFree(coord.x, i);
        if (limit || hasRivalPiece(coord.x, i))
            showPossibleMove(coord.x, i);
        --i;
    }
    limit = true;
    i = coord.y + 1; 
    while (i < COLS_COUNT && limit) {
        limit = isFree(coord.x, i);
        if (limit || hasRivalPiece(coord.x, i))
            showPossibleMove(coord.x, i);
        ++i;
    }
    limit = true;
    i = coord.x - 1;
    j = coord.y - 1;
    while (i >= 0 && j >= 0 && limit) {
        limit = isFree(i, j);
        if (limit || hasRivalPiece(i, j))
            showPossibleMove(i, j);
        --i;
        --j;
    }
    limit = true;
    i = coord.x - 1;
    j = coord.y + 1;
    while (i >= 0 && j < COLS_COUNT && limit) {
        limit = isFree(i, j);
        if (limit || hasRivalPiece(i, j))
            showPossibleMove(i, j);
        --i;
        ++j;
    }
    limit = true;
    i = coord.x + 1;
    j = coord.y - 1;
    while (i < ROWS_COUNT && j >= 0 && limit) {
        limit = isFree(i, j);
        if (limit || hasRivalPiece(i, j))
            showPossibleMove(i, j);
        ++i;
        --j;
    }
    limit = true;
    i = coord.x + 1;
    j = coord.y + 1;
    while (i < ROWS_COUNT && j < COLS_COUNT && limit) {
        limit = isFree(i, j);
        if (limit || hasRivalPiece(i, j))
            showPossibleMove(i, j);
        ++i;
        ++j;
    }
}

function showKingPossibleMoves(piece) {
    let coord = calcCoord(piece);
    let positions = [
        { x: (coord.x - 1), y: (coord.y - 1) },
        { x: (coord.x - 1), y: coord.y },
        { x: (coord.x - 1), y: (coord.y + 1) },
        { x: coord.x, y: (coord.y - 1) },
        { x: coord.x, y: (coord.y + 1) },
        { x: (coord.x + 1), y: (coord.y - 1) },
        { x: (coord.x + 1), y: coord.y },
        { x: (coord.x + 1), y: (coord.y + 1) },
    ];
    for (let i = 0; i < positions.length; ++i)
        if (isFree(positions[i].x, positions[i].y) || hasRivalPiece(positions[i].x, positions[i].y))
            showPossibleMove(positions[i].x, positions[i].y);
}

function showAllPossibleMoves(piece) {
    let pieceType = getPieceType(piece);
    switch (pieceType) {
        case PAWN: 
            showPawnPossibleMoves(piece);
            break;
        case ROOK:
            showRookPossibleMoves(piece);
            break;
        case KNIGHT:
            showKnightPossibleMoves(piece);
            break;
        case BISHOP:
            showBishopPossibleMoves(piece);
            break;
        case QUEEN:
            showQueenPossibleMoves(piece);
            break;
        case KING:
            showKingPossibleMoves(piece);
            break;
    }
}

function showPossibleMove(i, j) {
    let className = hasRivalPiece(i, j) ? 'killer' : 'possible';
    let elem = document.getElementById(className + '-move-' + i + '-' + j);
    elem.style.visibility = 'visible';
    showAction(i, j, movePiece);
}

function hidePossibleMove(i, j) {
    let elem;
    elem = document.getElementById('possible-move-' + i + '-' + j);
    if (elem.style.visibility === 'visible') {
        elem.style.visibility = 'hidden';
        hideAction(i, j);
    }
    elem = document.getElementById('killer-move-' + i + '-' + j);
    if (elem.style.visibility === 'visible') {
        elem.style.visibility = 'hidden';
        hideAction(i, j);
    }
}

function resetPossibleMoves() {
    for (let i = 0; i < ROWS_COUNT; ++i)
        for (let j = 0; j < COLS_COUNT; ++j)
            hidePossibleMove(i, j);
}

function showEliminationAnimation(x, y, callback) {
    let className = 'v' + x + ' h' + y + ' piece ' + (turnMode === WHITE ? 'black' : 'white');
    let query = document.getElementsByClassName(className);
    let elem = query && query.length ? query[0] : null;
    if (elem === null) {
        callback();
        return;
    }
    elem.parentNode.removeChild(elem);
    let oldPiece;
    if (turnMode === WHITE) {
        oldPiece = blackPiecesMatrix[x][y];
        blackPiecesMatrix[x][y] = NONE;
    } else {
        oldPiece = whitePiecesMatrix[x][y];
        whitePiecesMatrix[x][y] = NONE;
    }
    if (oldPiece === KING && turnMode === WHITE)
        showWhiteWins();
    else if (oldPiece === KING && turnMode === BLACK)
        showBlackWins();
    else
        callback();
}

function showMoveAnimation(piece, oldPlace, newPlace, callback) {
    let oldRealPos = { x: calcTop(oldPlace.x), y: calcLeft(oldPlace.y) };
    let newRealPos = { x: calcTop(newPlace.x), y: calcLeft(newPlace.y) };
    let slurpX = (newRealPos.x - oldRealPos.x) / 50;
    let slurpY = (newRealPos.y - oldRealPos.y) / 50;
    let currentX = oldRealPos.x;
    let currentY = oldRealPos.y;
    let time = 0;
    function eliminateRivalPlace(x, y) {
    }
    function finishAnimation() {
        piece.style.top = '' + newRealPos.x + 'px';
        piece.style.left = '' + newRealPos.y + 'px';	
        let color = getColor(piece);
        let pieceType = getPieceType(piece);
        if (color === WHITE) {
            whitePiecesMatrix[oldPlace.x][oldPlace.y] = NONE;
            whitePiecesMatrix[newPlace.x][newPlace.y] = pieceType;
        } else {
            blackPiecesMatrix[oldPlace.x][oldPlace.y] = NONE;
            blackPiecesMatrix[newPlace.x][newPlace.y] = pieceType;
        }
        if (pieceType === PAWN && firstPawnMove[oldPlace.x][oldPlace.y])
            firstPawnMove[oldPlace.x][oldPlace.y] = false;
        let className = piece.className;
        let tokens = className.split(" ");
        let newClassName = 'v' + newPlace.x + ' h' + newPlace.y;
        for (let i = 2; i < tokens.length; ++i)
            newClassName = newClassName + ' ' + tokens[i];
        piece.className = newClassName;
        if (hasRivalPiece(newPlace.x, newPlace.y))
            showEliminationAnimation(newPlace.x, newPlace.y, callback);
        else
            callback();
    }
    function showMoveAnimationR() {
        currentX = currentX + slurpX;
        currentY = currentY + slurpY;
        piece.style.top = '' + currentX + 'px';
        piece.style.left = '' + currentY + 'px';
        if (time++ < 50)
            setTimeout(showMoveAnimationR, 10);
        else
            finishAnimation();
    }
    showMoveAnimationR();
}

function finishTurn() {
    state = 3;
    updateInstruction();
    if (turnMode === WHITE) {
        turnMode = BLACK;
        document.getElementById('layer-white').style.zIndex = LOWER_ZINDEX;
        document.getElementById('layer-black').style.zIndex = UPPER_ZINDEX;
    } else {
        turnMode = WHITE;
        document.getElementById('layer-black').style.zIndex = LOWER_ZINDEX;
        document.getElementById('layer-white').style.zIndex = UPPER_ZINDEX;
    }
    let checkmate = testCheckmate();
    if (checkmate)
        showCheckmate();
}

function startTurn() {
    state = 1;
    updateInstruction();
    if (colored)
        startBlackTurn();
    else
        startWhiteTurn();
}

function movePiece() {
    resetAvailability();
    resetSelection();
    resetPossibleMoves();
    resetChecks();
    resetThreats();
    let query = document.getElementsByClassName('piece v' + currentFocus.x + ' h' + currentFocus.y);
    let piece = query && query.length ? query[0] : null;
    if (piece === null)
        return;
    let oldPlace = currentFocus;
    let newPlace = calcCoord(event.target);
    fireMoveEvent(oldPlace, newPlace);
    showMoveAnimation(piece, oldPlace, newPlace, finishTurn);
}

function enableSelection(piece) {
    let coord = calcCoord(piece);
    showAvailability(coord.x, coord.y);
    showAction(coord.x, coord.y, selectPiece);
}

function showCheckmate() {
    // TODO implement
    // Does nothing
}

function checkGameover(color, threats) {
    // TODO implement
    return false;
}

function showCheckThreat() {
    const duration = 300;
    let display = document.getElementById('check-threat-display');
    display.style.visibility = 'visible';
    let index = 0;
    const finishAnimation = () => {
        display.style.visibility = 'hidden';
        display.style.opacity = 1.0;
        display.style.transform = 'none';
    }
    const animation = () => {
        let factor = index * (10 / duration);
        display.style.opacity = 1 - factor;
        display.style.transform = 'scale(' + (1 + factor) + ', ' + (1 + factor) + ')';
        if (++index < (duration / 10))
            setTimeout(animation, 10);
        else
            finishAnimation();
    };
    animation();
}

function showWhiteWins() {
    stopTimer();
    state = colored ? 5 : 4;
    updateInstruction();
    document.getElementById('white-won-display').style.visibility = 'visible';
}

function showBlackWins() {
    stopTimer();
    state = colored ? 4 : 5;
    updateInstruction();
    document.getElementById('black-won-display').style.visibility = 'visible';
}

function showKingThreatsByColor(threats, color) {
    let kingPiece = document.getElementsByClassName('piece king ' + color)[0];
    let kingPos = calcCoord(kingPiece);
    showCheck(kingPos.x, kingPos.y);
    for (let i = 0; i < threats.length; ++i) {
        let piecePos = threats[i];
        showThreat(piecePos.x, piecePos.y);
    }
}

function showKingThreats(threats) {
    showKingThreatsByColor(threats, 'white');
    showKingThreatsByColor(threats, 'black');
    if (turnMode === WHITE)
        freeWhiteMove();
    else
        freeBlackMove();
}

function checkIfPawnThreatsKing(color, kingPos, piecePos) {
    let firstPos, secondPos;
    if (color === 'white') {
        firstPos = { x: (piecePos.x + 1), y: (piecePos.y - 1) };
        secondPos = { x: (piecePos.x + 1), y: (piecePos.y + 1) };
    } else {
        firstPos = { x: (piecePos.x - 1), y: (piecePos.y - 1) };
        secondPos = { x: (piecePos.x - 1), y: (piecePos.y + 1) };
    }
    let result = (firstPos.x === kingPos.x && firstPos.y === kingPos.y) ||
        (secondPos.x === kingPos.x && secondPos.y === kingPos.y);
    return result;
}

function checkIfRookThreatsKing(color, kingPos, piecePos) {
    let keepGoing, i;
    let rivalPiecesMatrix = color === 'white' ? whitePiecesMatrix : blackPiecesMatrix;
    keepGoing = true;
    i = piecePos.x - 1;
    while (i >= 0 && keepGoing) {
        let newPos = { x: i, y: piecePos.y };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        --i;
    }
    keepGoing = true;
    i = piecePos.x + 1
    while (i < rivalPiecesMatrix.length && keepGoing) {
        let newPos = { x: i, y: piecePos.y };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        ++i;
    }
    keepGoing = true;
    i = piecePos.y - 1;
    while (i >= 0 && keepGoing) {
        let newPos = { x: piecePos.x, y: i };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        --i;
    }
    keepGoing = true;
    i = piecePos.y + 1;
    while (i < rivalPiecesMatrix[0].length && keepGoing) {
        let newPos = { x: piecePos.x, y: i };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        ++i;
    }
    return false;
}

function checkIfKnightThreatsKing(color, kingPos, piecePos) {
    let positions = [
        { x: (piecePos.x - 2), y: (piecePos.y + 1) },
        { x: (piecePos.x - 1), y: (piecePos.y + 2) },
        { x: (piecePos.x + 1), y: (piecePos.y + 2) },
        { x: (piecePos.x + 2), y: (piecePos.y + 1) },
        { x: (piecePos.x - 2), y: (piecePos.y - 1) },
        { x: (piecePos.x - 1), y: (piecePos.y - 2) },
        { x: (piecePos.x + 1), y: (piecePos.y - 2) },
        { x: (piecePos.x + 2), y: (piecePos.y - 1) }
    ];
    let isAThreat = false;
    for (let i = 0; i < positions.length && !isAThreat; ++i) {
        let pos = positions[i];
        isAThreat = pos.x === kingPos.x && pos.y === kingPos.y;
    }
    return isAThreat;
}

function checkIfBishopThreatsKing(color, kingPos, piecePos) {
    let keepGoing, i, j;
    let rivalPiecesMatrix = color === 'white' ? whitePiecesMatrix : blackPiecesMatrix;
    keepGoing = true;
    i = piecePos.x - 1;
    j = piecePos.y - 1;
    while (i >= 0 && j >= 0 && keepGoing) {
        let newPos = { x: i, y: j };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        --i;
        --j;
    }
    keepGoing = true;
    i = piecePos.x + 1
    j = piecePos.y - 1;
    while (i < rivalPiecesMatrix.length && j >= 0 && keepGoing) {
        let newPos = { x: i, y: j };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        ++i;
        --j;
    }
    keepGoing = true;
    i = piecePos.x - 1;
    j = piecePos.y + 1;
    while (i >= 0 && j < rivalPiecesMatrix[0].length && keepGoing) {
        let newPos = { x: i, y: j };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        --i;
        ++j;
    }
    keepGoing = true;
    i = piecePos.x + 1;
    j = piecePos.y + 1;
    while (i < rivalPiecesMatrix.length && j < rivalPiecesMatrix[0].length && keepGoing) {
        let newPos = { x: i, y: j };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        ++i;
        ++j;
    }
    return false;
}

function checkIfQueenThreatsKing(color, kingPos, piecePos) {
    let keepGoing, i, j;
    let rivalPiecesMatrix = color === 'white' ? whitePiecesMatrix : blackPiecesMatrix;
    keepGoing = true;
    i = piecePos.x - 1;
    while (i >= 0 && keepGoing) {
        let newPos = { x: i, y: piecePos.y };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        --i;
    }
    keepGoing = true;
    i = piecePos.x + 1
    while (i < rivalPiecesMatrix.length && keepGoing) {
        let newPos = { x: i, y: piecePos.y };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        ++i;
    }
    keepGoing = true;
    i = piecePos.y - 1;
    while (i >= 0 && keepGoing) {
        let newPos = { x: piecePos.x, y: i };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        --i;
    }
    keepGoing = true;
    i = piecePos.y + 1;
    while (i < rivalPiecesMatrix[0].length && keepGoing) {
        let newPos = { x: piecePos.x, y: i };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        ++i;
    }
    keepGoing = true;
    i = piecePos.x - 1;
    j = piecePos.y - 1;
    while (i >= 0 && j >= 0 && keepGoing) {
        let newPos = { x: i, y: j };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        --i;
        --j;
    }
    keepGoing = true;
    i = piecePos.x + 1
    j = piecePos.y - 1;
    while (i < rivalPiecesMatrix.length && j >= 0 && keepGoing) {
        let newPos = { x: i, y: j };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        ++i;
        --j;
    }
    keepGoing = true;
    i = piecePos.x - 1;
    j = piecePos.y + 1;
    while (i >= 0 && j < rivalPiecesMatrix[0].length && keepGoing) {
        let newPos = { x: i, y: j };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        --i;
        ++j;
    }
    keepGoing = true;
    i = piecePos.x + 1;
    j = piecePos.y + 1;
    while (i < rivalPiecesMatrix.length && j < rivalPiecesMatrix[0].length && keepGoing) {
        let newPos = { x: i, y: j };
        keepGoing = isFree(newPos.x, newPos.y);
        if (!keepGoing && rivalPiecesMatrix[newPos.x][newPos.y] === KING)
            return true;
        ++i;
        ++j;
    }
    return false;
}

function checkIfKingThreatsRivalKing(color, kingPos, piecePos) {
    let positions = [
        { x: (piecePos.x - 1), y: (piecePos.y - 1) },
        { x: (piecePos.x - 1), y: piecePos.y },
        { x: (piecePos.x - 1), y: (piecePos.y + 1) },
        { x: piecePos.x, y: (piecePos.y - 1) },
        { x: piecePos.x, y: (piecePos.y + 1) },
        { x: (piecePos.x + 1), y: (piecePos.y - 1) },
        { x: (piecePos.x + 1), y: piecePos.y },
        { x: (piecePos.x + 1), y: (piecePos.y + 1) },
    ];
    let isAThreat = false;
    for (let i = 0; i < positions.length && !isAThreat; ++i) {
        let pos = positions[i];
        isAThreat = pos.x === kingPos.x && pos.y === kingPos.y;
    }
    return isAThreat;
}

function testCheckmateByColor(color) {
    let threats = [];
    let kingPiece = document.getElementsByClassName('piece king ' + color)[0];
    let kingPos = calcCoord(kingPiece);
    let piecesMatrix = color === 'white' ? blackPiecesMatrix : whitePiecesMatrix;
    for (let i = 0; i < piecesMatrix.length; ++i)
        for (let j = 0; j < piecesMatrix[i].length; ++j) {
            let piece = piecesMatrix[i][j];
            let piecePos = { x: i, y: j };
            let isAThreat = false;
            switch (piece) {
                case PAWN:
                    isAThreat = checkIfPawnThreatsKing(color, kingPos, piecePos);
                    break;
                case ROOK:
                    isAThreat = checkIfRookThreatsKing(color, kingPos, piecePos);
                    break;
                case KNIGHT:
                    isAThreat = checkIfKnightThreatsKing(color, kingPos, piecePos);
                    break;
                case BISHOP:
                    isAThreat = checkIfBishopThreatsKing(color, kingPos, piecePos);
                    break;
                case QUEEN:
                    isAThreat = checkIfQueenThreatsKing(color, kingPos, piecePos);
                    break;
                case KING:
                    isAThreat = checkIfKingThreatsRivalKing(color, kingPos, piecePos);
                    break;
            }
            if (isAThreat)
                threats.push({ x: i, y: j });
        }
    let gameover = false;
    let hasThreats = threats.length > 0;
    if (hasThreats > 0) {
        showCheck(kingPos.x, kingPos.y);
        for (let i = 0; i < threats.length; ++i)
            showThreat(threats[i].x, threats[i].y);
        gameover = checkGameover(color, threats);
    }
    return { gameover, hasThreats };
}

function testCheckmate() {
    let whiteResult = testCheckmateByColor('white');
    let blackResult = testCheckmateByColor('black');
    if (whiteResult.hasThreats || blackResult.hasThreats)
        showCheckThreat();
    return whiteResult.gameover || blackResult.gameover;
}

function freeBlackMove() {
    let blackPieces = document.getElementsByClassName('piece black');
    for (let i = 0; i < blackPieces.length; ++i)
        if (mayMove(blackPieces[i]))
            enableSelection(blackPieces[i]);
}

function startBlackTurn() {
    turnMode = BLACK;
    document.getElementById('layer-white').style.zIndex = LOWER_ZINDEX;
    document.getElementById('layer-black').style.zIndex = UPPER_ZINDEX;
    let checkmate = testCheckmate();
    if (checkmate)
        showCheckmate();
    else
        freeBlackMove();
}

function freeWhiteMove() {
    let whitePieces = document.getElementsByClassName('piece white');
    for (let i = 0; i < whitePieces.length; ++i)
        if (mayMove(whitePieces[i]))
            enableSelection(whitePieces[i]);
}

function startWhiteTurn() {
    turnMode = WHITE;
    document.getElementById('layer-white').style.zIndex = UPPER_ZINDEX;
    document.getElementById('layer-black').style.zIndex = LOWER_ZINDEX;
    let checkmate = testCheckmate();
    if (checkmate)
        showCheckmate();
    else
        freeWhiteMove();
}

function updateInstruction() {
    let message;
    switch (state) {
    case 0:
        message = INSTRUCTION0;
        break;
    case 1:
        message = INSTRUCTION1;
        break;
    case 2:
        message = INSTRUCTION2;
        break;
    case 3:
        message = INSTRUCTION3;
        break;
    case 4:
        message = INSTRUCTION4;
        break;
    case 5:
        message = INSTRUCTION5;
        break;
    }
    let components = document.getElementsByClassName('instruction');
    for (let i = 0; i < components.length; ++i)
        components[i].innerText = message;
}

function fireMoveEvent(oldPlace, newPlace) {
    let oldPosition = {x: oldPlace.x, y: oldPlace.y};
    let newPosition = {x: newPlace.x, y: newPlace.y};
    if (colored) {
        oldPosition = rotatePosition(oldPosition);
        newPosition = rotatePosition(newPosition);
    }
    sendMoveNotification(matchCode, colored, oldPosition.x, oldPosition.y, newPosition.x, newPosition.y);
}

function moveCallback(move) {
    if (move.playerColor == colored)
        return;
    resetChecks();
    resetThreats();
    let fromPosition = {x: move.fromX, y: move.fromY};
    let toPosition = {x: move.toX, y: move.toY};
    if (colored) {
        fromPosition = rotatePosition(fromPosition);
        toPosition = rotatePosition(toPosition);
    }
    let query = document.getElementsByClassName('piece v' + fromPosition.x + ' h' + fromPosition.y);
    let piece = query && query.length ? query[0] : null;
    if (piece === null)
        return;
    showMoveAnimation(piece, fromPosition, toPosition, startTurn);
}

function playerJoinedCallback(player) {
    if (state === 0) {
        state = 1;
        updateInstruction();
        startGame(colored);
    }
}

function rotateBlueprint(sourceBlueprint) {
    let result = [];
    for (let i = sourceBlueprint.length - 1; i >= 0; --i) {
        let row = [];
        for (let j = sourceBlueprint[i].length - 1; j >= 0; --j) {
            let value = sourceBlueprint[i][j];
            row.push(value);
        }
        result.push(row);
    }
    return result;
}

function rotatePosition(source) {
    return {x: (COLS_COUNT - source.x - 1), y: (ROWS_COUNT - source.y - 1)};
}
