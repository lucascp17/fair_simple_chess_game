var time = 0;
var timeInterval = null;

function updateTimerLabels() {
    const formattedTime = formatTime();
    let timerLabels = document.getElementsByClassName('timer');
    if (timerLabels != null && timerLabels.length > 0)
        for (let i = 0; i < timerLabels.length; ++i)
            timerLabels[i].innerText = formattedTime;
}

function resetTimer() {
    clearInterval(timeInterval);
    time = 0;
    updateTimerLabels();
}

function startTimer() {
    time = 0;
    updateTimerLabels();
    timeInterval = setInterval(countSecond, 1000);
}

function stopTimer() {
    clearInterval(timeInterval);
}

function resumeTimer() {
    timeInterval = setInterval(countSecond, 1000);
}

function countSecond() {
    time = time + 1;
    updateTimerLabels();
}

function formatTime() {
    let seconds = time % 60;
    let minutes = ((time / 60) >> 0) % 60;
    let hours = (time / 3600) >> 0;
    //
    const format = number => number < 10 ? '0' + number : number;
    let formattedHours = format(hours);
    let formattedMinutes = format(minutes);
    let formattedSeconds = format(seconds);
    //
    return formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
}