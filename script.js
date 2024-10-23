const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const days = document.querySelector(".days");
const monthDisplay = document.querySelector("#month");
const yearDisplay = document.querySelector("#year");
const day = document.getElementsByClassName("day");
const message = document.querySelector("#message");
const list = document.querySelector("#list");
const submitBtn = document.querySelector("#submit-btn");
const dateList = document.querySelector("#date");
// const dots = document.querySelectorAll("#dots")
// const redDot = document.querySelector("#red-dot");
// const yellowDot = document.querySelector("#yellow-dot");
// const greenDot = document.querySelector("#green-dot");
let monthCout = 0;
let year, month;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const tasks = [];

calendar();
prevBtn.addEventListener("click", pervMonth);
nextBtn.addEventListener("click", nextMonth);
function calendar(){
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + monthCout);
    year = currentDate.getFullYear();
    month = currentDate.getMonth();
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
        html += '<div class="day-space"></div>'
    }
    for(let i = 1; i <= daysInMonth; i++){
        let weekends = (new Date(year, month, i).getDay());
        let dayClass = "day";
        if(i === today){
            dayClass += " active selected"
        }
        if(weekends === 0 || weekends === 6){
            dayClass +=  " weekend"
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

for(let i = 0; i < day.length; i++){   
    day[i].addEventListener("click", selectDay);
}
function selectDay(){  
    let target = event.target;
    let date = year + "." + (month + 1) + "." + target.innerHTML;
    target.setAttribute("data-date", date);
    for(let i = 0; i < day.length; i++){
        day[i].classList.remove("selected")
    }
    target.classList.add("selected");
    dateList.innerHTML = date;
}
function createList(){
    if(message.value === ""){
        return; 
    }
    const selectedDay = document.querySelector(".selected");
    let div = document.createElement("div");
    list.appendChild(div);

    if (colorText(selectedColor) === "red") {
        div.classList.add("red-task");
    } else if(colorText(selectedColor) === "yellow"){
        div.classList.add("yellow-task");
    } else if (colorText(selectedColor) === "green"){
        div.classList.add("green-task");
    }
    div.classList.add("flexbox");
    div.classList.remove("hidden")
    div.innerHTML =  '<div><input type="checkbox">' + message.value + '</div>';
    message.value = "";
     
}
    
    
submitBtn.addEventListener("click", createList);
const dots = document.querySelectorAll("#dots");
const redDot = document.querySelector("#red-dot");
const yellowDot = document.querySelector("#yellow-dot");
const greenDot = document.querySelector("#green-dot");
let selectedColor = null;
redDot.addEventListener("click", () => {
    selectedColor = "red";
    colorText("red");
});
yellowDot.addEventListener("click", () => {
    selectedColor = "yellow";
    colorText("yellow");
});
greenDot.addEventListener("click", () => {
    selectedColor = "green";
    colorText("green");
});

function colorText(textClass){
    if(textClass === "red"){
        return "red";
    } else if (textClass === "yellow"){
        return "yellow";
    } else if(textClass === "green"){
        return "green";
    }
}