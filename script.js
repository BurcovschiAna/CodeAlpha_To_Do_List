const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const days = document.querySelector(".days");
const monthDisplay = document.querySelector("#month");
const yearDisplay = document.querySelector("#year");
let monthCout = 0;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


calendar();
prevBtn.addEventListener("click", pervMonth);
nextBtn.addEventListener("click", nextMonth);
function calendar(){
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + monthCout);
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let daysInMonth = (new Date(year, month + 1, 0).getDate());
    let weekDay = (new Date(year, month, 1).getDay());
    if(weekDay === 0){
        weekDay = 7;
    }
    let today;
    if(monthCout === 0){
        today = currentDate.getDate();
    }
    createCalendar(weekDay, daysInMonth, today);
    monthDisplay.innerHTML = months[month];
    yearDisplay.innerHTML = year;
}
function createCalendar(weekDay, daysInMonth, today){
    let html = "";
    for(let i = 1; i < weekDay; i++){
        html += '<div class="day space"></div>'
    }
    for(let i = 1; i <= daysInMonth; i++){
        let dayClass = "day";
        if(i === today){
            dayClass += " active"
        }
        html += '<div class="' + dayClass + '">' + i + "</div>"
    }
    days.innerHTML = html;   
}

calendar();

function pervMonth(){
    monthCout--;
    calendar();
}
function nextMonth(){
    monthCout++;
    calendar();
}