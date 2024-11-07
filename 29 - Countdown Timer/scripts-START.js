let countdownFunctionId;
const timerDisplay = document.querySelector('.display__time-left');
const endDisplay = document.querySelector('.display__end-time');

const buttons = document.querySelectorAll('button')
buttons.forEach(button => button.addEventListener('click', updateTimerSeconds));

const form = document.getElementById("custom")
form.addEventListener('submit', updateTimerMinutes);

function updateTimerMinutes(e) {
    e.preventDefault();
    
    input = document.querySelector('input');
    if (isNaN(input.value)) return;
    
    const minutes = input.value;
    const seconds = minutes * 60;
    timer(seconds);
    document.getElementById("custom").reset();
}

function updateTimerSeconds() {
    seconds = this.dataset.time;
    timer(seconds);
}

function displayTimeLeft(seconds) {
    console.log(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    timerDisplay.innerHTML = display
    document.title = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hours = end.getHours();
    const minutes = end.getMinutes();
    endDisplay.innerHTML = `Timer ends at ${hours}:${minutes < 10 ? '0' : '' }${minutes}`;
}

function timer(seconds) {
    clearInterval(countdownFunctionId);
    displayTimeLeft(seconds);
    
    const timeWhenCountdownStartedMillis = Date.now();
    const timeWhenCountdownShouldReachZeroMillis = timeWhenCountdownStartedMillis + seconds * 1000;
    displayEndTime(timeWhenCountdownShouldReachZeroMillis);
    
    countdownFunctionId = setInterval(() => {

        const millisLeft = timeWhenCountdownShouldReachZeroMillis - Date.now();
        const secondsLeft = Math.round(millisLeft / 1000);

        if (secondsLeft < 0)
        {
            clearInterval(countdownFunctionId);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}
