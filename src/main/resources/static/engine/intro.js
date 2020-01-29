function showIntro() {
    cleanPage();
    buildIntro();
}

function cleanPage() {
    const cover = document.getElementById('cover');
    while (cover.firstChild)
        cover.removeChild(cover.firstChild);
    //
    const board = document.getElementById('board');
    while (board.firstChild)
        board.removeChild(board.firstChild);
}

function buildIntro() {
    const root = document.createElement('div');
    //
    root.style.position = 'absolute';
    root.style.width = TABLE_WIDTH + 'px';
    root.style.height = TABLE_HEIGHT + 'px';
    root.style.border = 'solid ' + BORDER_WIDTH + 'px ' + BG_COLOR_DARK;
    root.style.background = COVER_COLOR;
    //
    const title = buildTitle();
    const firstMessage = buildFirstMessage();
    const secondMessage = buildSecondMessage();
    //
    root.appendChild(title);
    root.appendChild(firstMessage);
    root.appendChild(secondMessage);
    //
    document.getElementById('cover').appendChild(root);
}

function buildTitle() {
    const title = document.createElement('h1');
    //
    title.style.textAlign = 'center';
    title.innerText = GAME_TITLE;
    //
    return title;
}

function buildFirstMessage() {
    const message = document.createElement('p');
    message.style.textAlign = 'center';
    //
    const firstDiv = document.createElement('div');
    firstDiv.innerText = MESSAGE0;
    //
    const secondDiv = document.createElement('form');
    secondDiv.action = 'javascript:joinMatch()';
    //
    const joinMatchInput = document.createElement('input');
    joinMatchInput.id = 'join-match-input';
    joinMatchInput.type = 'text';
    joinMatchInput.autofocus = true;
    secondDiv.appendChild(joinMatchInput);
    //
    const joinMatchButton = document.createElement('input');
    joinMatchButton.type = 'submit';
    joinMatchButton.value = IMPORT_GAME_LABEL;
    secondDiv.appendChild(joinMatchButton);
    //
    message.appendChild(firstDiv);
    message.appendChild(secondDiv);
    return message;
}

function buildSecondMessage() {
    const message = document.createElement('p');
    message.style.textAlign = 'center';
    //
    const firstDiv = document.createElement('div');
    firstDiv.innerText = MESSAGE1;
    //
    const secondDiv = document.createElement('form');
    secondDiv.action = 'javascript:createNewMatch()';
    //
    const newMatchButton = document.createElement('input');
    newMatchButton.type = 'submit';
    newMatchButton.value = NEW_GAME_LABEL;
    secondDiv.appendChild(newMatchButton);
    //
    message.appendChild(firstDiv);
    message.appendChild(secondDiv);
    return message;
}

function createNewMatch() {
    cleanPage();
    sendNewMatchRequest();
}

function joinMatch() {
    let matchCode = buildJoinMatchParams();
    cleanPage();
    sendJoinMatchRequest(matchCode);
}

function sendNewMatchRequest() {
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4 && ajax.status == 200) {
			let matchConfig = JSON.parse(ajax.responseText);
			prepareMatch(matchConfig, false);
		}
	}
	ajax.open('post', '/new_match', true);
	ajax.send();
}

function sendJoinMatchRequest(matchCode) {
    var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4 && ajax.status == 200) {
			let matchConfig = JSON.parse(ajax.responseText);
			prepareMatch(matchConfig, true);
		}
	}
	ajax.open('post', '/join_match?code=' + matchCode, true);
	ajax.send();
}

function prepareMatch(matchConfig, mustStartTimer) {
	startEngine(
	    matchConfig.match.code,
	    matchConfig.match.blueprint,
	    matchConfig.colored,
	    matchConfig.activeTurn,
	    mustStartTimer
    );
}

function buildJoinMatchParams() {
    let matchCode = document.getElementById("join-match-input").value;
    return matchCode;
}