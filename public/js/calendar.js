/**
 * TODO:
 * edit/delete events
 * Event categories with colors
 * Responsive mobile layout
 * Add weekly calendar view
 * allow users to add event types
 * Drag and drop events(Complex and can be done last)
 */

//Tody's date info used as a default when the calendar is loaded up
const today = new Date();
const year_to_date = today.getFullYear();
const month_to_date = today.getMonth();
const day_to_date = today.getDate();

//INIT variables
let yr = year_to_date;
let mon = month_to_date;
let selectedDate = null;
let planner = {};

//Table
let table = document.getElementById('calendar_id');
let thead = document.getElementById('cal_header');
let tbody = document.getElementById('cal_body');

//Text
let month = document.getElementById('month');
let year = document.getElementById('year');
let event_title = document.getElementById('event-title')
let error_message = document.getElementById('error-message');

//Buttons
let prev = document.getElementById('prev');
let next = document.getElementById('next');
let cancel_btn = document.getElementById('cancel-btn');
let save_btn = document.getElementById('save-btn');
let delete_btn = null;
let edit_btn = null;

//Constants
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayNames = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
const format_st = [1,21,31];
const format_nd = [2, 22];
const format_rd = [3, 23];

function replaceButton(btn){
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    return newBtn;
}

/**Set Month and year at the top of the planner */
function set_header(){
    month.textContent = monthNames[mon];
    year.textContent = yr;
}


/**
 * Create monthly view header with day names
 */
function create_monthly_view_H(){
    const tr = document.createElement('tr');
    for(const day in dayNames){
        const th = document.createElement('th');
        th.textContent = dayNames[day];
        tr.appendChild(th);
    }
    thead.appendChild(tr)
}

/**
 * td.id = 'empty-'+row+'-'+col //FOR EMPTY CELLS
 * td.id = year-month-day
 * eventList.id = events-year-month-day
 * add one to month because system's month index is 0-11 and it's easier to read in database as 1-12
 */

/**
 * Create monthly view body with days and events listed
 * Also creates each day id, event id, buttons to add events to a specific day
 */
function create_monthly_view_B(){
    const firstday = new Date(yr, mon, 1).getDay();
    const daysInMonth = new Date(yr, mon+1,0).getDate();
    let day = 1;
    
    tbody.innerHTML = ''; //Refreshes list

    for (let row = 0; row < 6; row++) {       // 6 rows
        const tr = document.createElement('tr');
        
        for (let col = 0; col < 7; col++) {   // 7 columns
            const td = document.createElement('td');

            if((row === 0 && col < firstday) || (day > daysInMonth)){ //creating empty cell
                td.id = 'empty-'+row+'-'+col;
                td.classList.add('empty');
            }
            else{
                td.id = yr + "-" + (mon+1) + "-" + day;

                const date_cell = document.createElement('div');
                date_cell.classList.add('date_cell');
                td.appendChild(date_cell);

                const p = document.createElement('p');
                p.textContent = day;
                p.classList.add('day');
                date_cell.appendChild(p);

                if(
                    yr === year_to_date &&
                    mon === month_to_date &&
                    day === day_to_date
                ){
                    p.classList.add('today');
                }

                const eventList = document.createElement('ul');
                eventList.id = "events-"+yr + "-" + (mon+1) + "-" + day;
                eventList.classList.add('event-list');
                td.appendChild(eventList);

                const btn = document.createElement('button');
                btn.classList.add("add-event-btn");
                btn.innerHTML = '<span class="plus">+</span>';
                date_cell.appendChild(btn);

                const currentDay = day;
                btn.addEventListener('click', () => {
                    const getDate = new Date(yr, mon, currentDay);
                    console.log(getDate);
                    showForm(getDate);
                });

                day++;
            }

            tr.appendChild(td);
        
        }
        
        tbody.appendChild(tr);
    }
}


/**
 * 
 * @param {*} date 
 * @returns string of the date formatted as "month day with suffix ex: January 1st, March 3rd, etc"
 */
function dateFormat(date){
    let format = '';
    const day = date.getDate()
    const month = date.getMonth();

    if(format_st.includes(day)){
        format = monthNames[month] + " " + day + "st";
    }
    else if(format_nd.includes(day)){
        format = monthNames[month] + " " + day + "nd";
    }
    else if(format_rd.includes(day)){
        format = monthNames[month] + " " + day + "rd";
    }
    else{
        format = monthNames[month] + " " + day + "th";
    }

    console.log(format);
    return format;
}

//Show form
/**
 * Shows pop up form for adding events to a day
 * @param {*} date 
 * @param {*} mode 
 * @param {*} item 

 */
function showForm(date = null, mode = "add", item=null){
    if (mode === "add" && date){
        selectedDate = date;
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('event-form').style.display = 'block';
        let format = dateFormat(selectedDate);
        event_title.textContent = "Add Event for " + format;     
        
        if(edit_btn && delete_btn){
        save_btn = replaceButton(edit_btn);
        cancel_btn = replaceButton(delete_btn);
        }
        save_btn.textContent = "Save Event";
        cancel_btn.textContent = "Cancel";

        //button to close form
        cancel_btn.addEventListener('click', closeForm);

        //button to save event into database and display on calendar
        save_btn.addEventListener('click', save_event);



    }
    else if(mode === "edit" && item){
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('event-form').style.display = 'block';
        event_title.textContent = "Edit/Delete Event";
        
        const eventData = JSON.parse(item.dataset.eventData);

        document.getElementById('event-name').value = eventData.name;
        document.getElementById('event-description').value = eventData.description;
        document.getElementById('event-type').value = eventData.type;
        document.getElementById('event-start').value = eventData.start;
        document.getElementById('event-end').value = eventData.end;

        //Swap cancel and save button for save edit and delete buttons
        edit_btn = replaceButton(save_btn);
        delete_btn = replaceButton(cancel_btn);

        edit_btn.textContent = "Save Edit";
        delete_btn.textContent = "Delete Event";

        edit_btn.addEventListener('click', function(){
            console.log("Save edit works");
            closeForm();
        });
        delete_btn.addEventListener('click', function(){
            console.log("Delete event works");
        });

    }
    else{
        console.error("Invalid mode, date, or item");
    }
}
/**
 * Closes pop up form for adding events to day and resets all values to default
 */
function closeForm(){
    selectedDate = null;
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('event-form').style.display = 'none';
    error_message.style.display = "none";   

    event_title.textContent = 'Add Event';
    error_message.textContent = '';
    document.getElementById('event-name').value = '';
    document.getElementById('event-description').value = '';
    document.getElementById('event-start').value = '';
    document.getElementById('event-end').value = '';
}

/**
 * Saves data into planner variable and sends it to the server to be stored into the database
 * @param {*} event 
 */
async function save_event(event){
    event.preventDefault();

    const event_name = document.getElementById('event-name').value;
    const event_description = document.getElementById('event-description').value;
    const event_type = document.getElementById('event-type').value;
    const event_start = document.getElementById('event-start').value;
    const event_end = document.getElementById('event-end').value;    

    if(!event_name){
        error_message.textContent = "Need to input event name";
        error_message.style.display = "block";
        return;
    }
    else{
        const data = {
            name : event_name,
            description : event_description,
            type : event_type,
            start : event_start,
            end : event_end,
        };

        const Eventyear = selectedDate.getFullYear();
        const Eventmonth = selectedDate.getMonth()+1;
        const Eventday = selectedDate.getDate();
        const dateKey = Eventyear+"-"+Eventmonth+"-"+Eventday;

        console.log(Eventmonth);

        if(!planner[dateKey]){
            planner[dateKey] = []; 
        }

        planner[dateKey].push(data);

        const eventList = document.getElementById("events-" + dateKey);

        const li = document.createElement('li');
        li.textContent = event_name;
        li.classList.add('event-item');
        li.dataset.eventData = JSON.stringify(data); // Store event data in a data attribute
        eventList.appendChild(li);

        
        //Save planner func
        let result = await savePlanner();
        if (!result){
            console.log("Could not save event to database");
            console.log("Event will be used for current session but not for future sessions");
        }
        closeForm();      
    }    
}

//Go back one month
prev.addEventListener('click', function() {
    mon --;
    if(mon < 0){
        yr --;
        mon = 11;
    }
    set_header();   
    create_monthly_view_B();
    displayPlanner(planner); 

});

//Go foward one month
next.addEventListener('click', function() {
    mon ++;
    if(mon > 11){
        yr ++;
        mon = 0;
    }
    set_header();   
    create_monthly_view_B(); 
    displayPlanner(planner);

});

//Displays events on the calendar for the current month
function displayPlanner(events){

    for(const key in events){
        console.log(key); //key is the same as id 

        const eventList = document.getElementById('events-'+key);
        const[eventYear, eventMonth, eventDay] = key.split('-').map(Number);

        if (!eventList){
            continue;
        }
        if(eventYear !== yr || eventMonth !== mon+1){
            continue;
        }

        eventList.innerHTML = '';
        //Display name of each event
        events[key].forEach(event => {
            const li = document.createElement('li');
            li.textContent = event.name;
            li.classList.add('event-item');
            li.dataset.eventData = JSON.stringify(event); // Store event data in a data attribute
            eventList.appendChild(li);
        });
    }
}


/**
 * gets data from planner variable and sends it to the server to be stored in the database
 * @returns true, false, or none
 */
async function savePlanner(){
    try{
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                planner_data : planner
            })
        });

        const data = await response.json();

        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if(response.ok){
            console.log("data sent successfully");
            return true;
        }
        else{
            console.error('Error:',error);
            return false;
        }        
        
    }catch(error){
        console.error('Error:',error);
        return {};
    }
}

/**
 * gets planner data from the server and stores it into the planner variable
 * @returns planner data in a JSON type obj
 */
async function getPlanner(){
    try{
        const response = await fetch('/api/planner_data');

        if(response.ok){
            const data = await response.json();

            const planner = data.planner_data;
            console.log("data loaded successfully");
            console.log(planner);
            return planner;
        }

    }catch(error){
        console.error('Error:',error);
        console.log("Could not retrieve data");
        return {};
    }    
}

document.addEventListener('DOMContentLoaded', async function(){

    set_header();
    create_monthly_view_H();
    create_monthly_view_B();
    planner = await getPlanner();
    displayPlanner(planner);

    //Event listener for each event item on the calendar
    document.querySelectorAll('.event-item').forEach(item => {
    item.addEventListener('click',function(){
        showForm(null, "edit", item);
        });
    });
});
