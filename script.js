// Select DOM elements
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
const dots = document.querySelectorAll(".dot");
const redDot = document.querySelector("#red-dot");
const yellowDot = document.querySelector("#yellow-dot");
const greenDot = document.querySelector("#green-dot");

// Initialize variables for month and year
let monthCount = 0;
let year, month;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const tasks = new Map(); // Store tasks in a Map for easy access
let selectedColor = null; // Store the selected color for tasks

// Event listeners for navigation buttons
prevBtn.addEventListener("click", pervMonth);
nextBtn.addEventListener("click", nextMonth);

// Load tasks and initialize the calendar on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
    loadTasks(); 
    calendar();
});

// Event listener for selecting a day in the calendar
days.addEventListener("click", selectDay);

// Event listener for submitting a new task
submitBtn.addEventListener("click", createList);

// Event listeners for color selection dots
redDot.addEventListener("click", () => colorText("red", redDot));
yellowDot.addEventListener("click", () => colorText("yellow", yellowDot));
greenDot.addEventListener("click", () => colorText("green", greenDot));

// Function to render the calendar
function calendar() {
    const currentDate = new Date(); // Get current date
    currentDate.setMonth(currentDate.getMonth() + monthCount); // Adjust month based on monthCount
    year = currentDate.getFullYear(); // Get the current year
    month = currentDate.getMonth(); // Get the current month
    let daysInMonth = (new Date(year, month + 1, 0).getDate()); // Get the number of days in the month
    let weekDay = (new Date(year, month, 1).getDay()); // Get the weekday of the first day of the month
    if (weekDay === 0) {
        weekDay = 7; // Adjust Sunday to be the last day of the week
    }
    let today; // Variable to store today's date
    if (monthCount === 0) {
        today = currentDate.getDate(); // Set today's date if current month is displayed
    }
    let date = year + "." + (month + 1) + "."; // Format date for tasks
    createCalendar(weekDay, daysInMonth, today, date); // Create the calendar
    monthDisplay.innerHTML = months[month]; // Display the month name
    yearDisplay.innerHTML = year; // Display the year
    updateTask(); // Update tasks for the selected day
}

// Function to create the calendar grid
function createCalendar(weekDay, daysInMonth, today, date) {
    let html = ""; // Initialize HTML string
    
    // Add empty spaces for days before the first day of the month
    for (let i = 1; i < weekDay; i++) {
        html += '<div class="day-space"></div>';
    }
    
    // Create day elements for each day in the month
    for (let i = 1; i <= daysInMonth; i++) {
        let todayTask = 'data-date="' + date;        
        let weekends = (new Date(year, month, i).getDay()); // Determine if the day is a weekend
        let dayClass = "day"; // Base class for day elements
        
        // Add classes for today and weekends
        if (i === today) {
            dayClass += " active selected"; // Highlight today's date
        }
        if (weekends === 0 || weekends === 6) {
            dayClass += " weekend"; // Add weekend class for Saturday/Sunday
        }       
        html += '<div class="' + dayClass + '" ' + todayTask + i + '"' + '>' + i + "</div>"; // Create day div
    }
    days.innerHTML = html; // Render the calendar in the DOM
}

// Function to navigate to the previous month
function pervMonth() {
    monthCount--; // Decrease month count
    calendar(); // Re-render the calendar
}

// Function to navigate to the next month
function nextMonth() {
    monthCount++; // Increase month count
    calendar(); // Re-render the calendar
}

// Function to handle day selection in the calendar
function selectDay(event) {  
    let target = event.target; // Get the clicked element
    if (!target.classList.contains("day")) return; // Exit if clicked element is not a day
    for (let i = 0; i < day.length; i++) {  
        day[i].classList.remove("selected"); // Remove 'selected' class from all days
    }
    target.classList.add("selected"); // Add 'selected' class to the clicked day

    let date = year + "." + (month + 1) + "." + target.innerHTML; // Format the date
    dateList.innerHTML = date; // Display the selected date
    updateTask(); // Update tasks for the selected date
}

// Function to create a new task
function createList() {
    if (message.value === "") {
        return; // Exit if message input is empty
    }
    let date = dateList.innerHTML; // Get the selected date
    let div = document.createElement("div"); // Create a new task element
    div.classList.add("task", "flexbox"); // Add classes for styling
    
    // Add color class based on selected color
    if (selectedColor === "red") {
        div.classList.add("red-task");
    } else if (selectedColor === "yellow") {
        div.classList.add("yellow-task");
    } else if (selectedColor === "green") {
        div.classList.add("green-task");
    }

    // Set the inner HTML for the task
    div.innerHTML = '<input type="checkbox"><div class="message-list">' + message.value + '</div>' + '<img src="img/delete-btn.svg" class="delete">';

    // Add the task to the tasks map
    if (tasks.has(date)) {
        let value = tasks.get(date);
        value.push(div); // Add the new task to existing tasks
        tasks.set(date, value);
    } else {
        tasks.set(date, [div]); // Create a new array for tasks on this date
    }

    saveTasks(); // Save tasks to local storage

    message.value = ""; // Clear the input field
    list.appendChild(div); // Append the new task to the task list

    const deleteBtn = div.querySelector(".delete"); // Get the delete button
    deleteBtn.addEventListener("click", removeListItem); // Attach delete event listener

    updateTask(); // Update tasks for the selected date
}

// Function to handle color selection for tasks
function colorText(textClass, element) {
    const isActive = element.classList.contains("active-dot"); // Check if the dot is already active
    dots.forEach(dot => dot.classList.remove("active-dot")); // Remove active class from all dots
    if (!isActive) {
        element.classList.add("active-dot"); // Mark the selected dot as active
        selectedColor = textClass; // Set the selected color
        console.log("Color Selected:", selectedColor);
    } else {
        selectedColor = null; // Deselect if the active dot is clicked again
    }
}

// Function to update tasks based on the selected day
function updateTask() {
    let selectedDay = document.querySelector(".selected");  
    if (!selectedDay) return; // Exit if no day is selected
    let dataDate = selectedDay.getAttribute("data-date"); // Get the date of the selected day
    dateList.innerHTML = dataDate; // Display the selected date
    if (tasks.has(dataDate)) {
        showTask(); // Show tasks for the selected date
    } else {
        list.innerHTML = ""; // Clear the task list if no tasks exist
    }
}

// Function to display tasks for the selected day
function showTask() {
    const selectedDayTasks = tasks.get(dateList.innerHTML) || []; // Get tasks for the selected day
    list.innerHTML = ""; // Clear the current task list
    selectedDayTasks.forEach(taskDiv => {
        list.appendChild(taskDiv); // Append each task to the list
        const deleteBtn = taskDiv.querySelector(".delete"); // Get the delete button for each task
        deleteBtn.addEventListener("click", removeListItem); // Attach delete event listener
    });
}

// Function to remove a task from the list
function removeListItem() {
    const taskElement = this.closest('.task'); // Get the closest task element
    if (taskElement) {
        const date = dateList.innerHTML; // Get the current date

        if (tasks.has(date)) {
            const taskArray = tasks.get(date); // Get tasks for the date
            const updatedTasks = taskArray.filter(task => task !== taskElement); // Filter out the deleted task
            if (updatedTasks.length > 0) {
                tasks.set(date, updatedTasks); // Update the tasks map
            } else {
                tasks.delete(date); // Remove the date entry if no tasks remain
            }
            taskElement.remove(); // Remove the task element from the DOM
        }

        saveTasks(); // Save updated tasks to local storage
    }
    updateTask(); // Update tasks for the selected date
}


// Function to load tasks from local storage
function loadTasks() {
    const savedTasks = localStorage.getItem("tasks"); // Get tasks from local storage
    if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks); // Parse the saved tasks
        for (const [date, taskArray] of Object.entries(parsedTasks)) {
            const taskDivs = taskArray.map(task => {
                const div = document.createElement("div"); // Create a new task element
                div.classList.add("task", "flexbox"); // Add classes for styling

                // Set the inner HTML for the task
                div.innerHTML = `<input type="checkbox"><div class="message-list">${task.message}</div>` +
                                `<img src="img/delete-btn.svg" class="delete">`;
                div.classList.add(`${task.color}-task`); // Add color class based on saved color

                const deleteBtn = div.querySelector(".delete"); // Get the delete button
                deleteBtn.addEventListener("click", removeListItem); // Attach delete event listener

                return div; // Return the created task element
            });
            tasks.set(date, taskDivs); // Store the tasks in the map
        }
    }
}

// Function to save tasks to local storage
function saveTasks() {
    const tasksObject = {}; // Initialize an object to store tasks
    tasks.forEach((value, key) => {
        tasksObject[key] = value.map(taskDiv => {
            return {
                message: taskDiv.querySelector(".message-list").innerText, // Get task message
                color: taskDiv.classList.contains("red-task") ? "red" :
                       taskDiv.classList.contains("yellow-task") ? "yellow" :
                       taskDiv.classList.contains("green-task") ? "green" : ""
            };
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasksObject)); // Save tasks to local storage
}

// localStorage.clear();