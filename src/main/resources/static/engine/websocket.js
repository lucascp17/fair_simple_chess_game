var stompClient;

function connect(matchCode, moveCallback, playerJoinedCallback) {
    let socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    //
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/moves/' + matchCode, function(message) {
            let move = JSON.parse(message.body);
            moveCallback(move);
        });
        stompClient.subscribe('/topic/player_joined/' + matchCode, function(message) {
            let player = JSON.parse(message.body);
            playerJoinedCallback(player);
        });
    });
}

function disconnect(stompClient) {
    if (stompClient !== null)
        stompClient.disconnect();
}

function sendMoveNotification(matchCode, colored, fromX, fromY, toX, toY) {
    let move = {matchCode, playerColor: colored, fromX, fromY, toX, toY};
    stompClient.send("/app/move/" + matchCode, {}, JSON.stringify(move));
}