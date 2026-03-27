const today = new Date();
let yr = today.getFullYear();
let mon = today.getMonth();
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

//Constants
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const format_st = [1,21,31];
const format_nd = [2, 22];
const format_rd = [3, 23];

//Setting Month and Year at the top of planner
function set_header(){
    month.textContent = monthNames[mon];
    year.textContent = yr;
}

//Setting Weeks
function create_cal_header(){
    const tr = document.createElement('tr');
    for(const day in dayNames){
        const th = document.createElement('th');
        th.textContent = dayNames[day];
        tr.appendChild(th);
    }
    thead.appendChild(tr)
}

//REMEMBER: td id = yr-mon-day
/**
 * How we want the format of td id
 * button (add events)
 * list of events
 * td.id = 'empty-'+row+'-'+col //FOR EMPTY CELLS
 * td.id = year-month-day
 * eventList.id = events-year-month-day
 * 
 */
function create_cal_body(){
    const firstday = new Date(yr, mon, 1).getDay();
    const daysInMonth = new Date(yr, mon+1,0).getDate();
    let day = 1;
    
    tbody.innerHTML = ''; //Refreshes list

    for (let row = 0; row < 5; row++) {       // 5 rows
        const tr = document.createElement('tr');
        
        for (let col = 0; col < 7; col++) {   // 7 columns
            const td = document.createElement('td');

            if((row === 0 && col < firstday) || (day > daysInMonth)){ //creating empty cell
                td.id = 'empty-'+row+'-'+col;
                td.classList.add('empty');
            }
            else{
                td.id = yr + "-" + mon + "-" + day;

                const date_cell = document.createElement('div');
                date_cell.classList.add('date_cell');
                date_cell.textContent = day;
                td.appendChild(date_cell);

                const eventList = document.createElement('ul');
                eventList.id = "events-"+yr + "-" + mon + "-" + day;
                eventList.classList.add('event-list');
                td.appendChild(eventList);

                const btn = document.createElement('button');
                btn.classList.add("add-event-btn");
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>';
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
function showForm(date){
    selectedDate = date;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('event-form').style.display = 'block';
    let format = dateFormat(selectedDate);
    event_title.textContent = "Add Event for " + format;
}
//Close form
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

cancel_btn.addEventListener('click', function(){
    closeForm()
});

save_btn.addEventListener('click', async function(event){
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
        const event = {
            name : event_name,
            description : event_description,
            type : event_type,
            start : event_start,
            end : event_end,
        };

        const Eventyear = selectedDate.getFullYear();
        const Eventmonth = selectedDate.getMonth();
        const Eventday = selectedDate.getDate();
        const dateKey = Eventyear+"-"+Eventmonth+"-"+Eventday

        console.log(Eventmonth);

        planner[dateKey].push(event);

        const eventList = document.getElementById("events-" + dateKey);

        const li = document.createElement('li');
        li.textContent = event_name;
        eventList.appendChild(li);

        
        //Save planner func
        await savePlanner();
        closeForm();      
    }
});


//Go back one month
prev.addEventListener('click', function() {
    mon --;
    if(mon < 0){
        yr --;
        mon = 11;
    }
    set_header();   
    create_cal_body();
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
    create_cal_body(); 
    displayPlanner(planner);

});

function displayPlanner(events){

    for(const key in events){
        console.log(key); //key is the same as id 

        const eventList = document.getElementById('events-'+key);
        const[eventYear, eventMonth, eventDay] = key.split('-').map(Number);

        if (!eventList) continue;
        if(eventYear !== yr || eventMonth !== mon+1){
            continue;
        }

        //Display name of each event
        events[key].array.forEach(event => {
            const li = document.createElement('li');
            li.textContent = event.name;
            li.classList.add('event-item');

            eventList.appendChild(li);
        });
    }
}

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

async function getPlanner(){
    try{
        const response = await fetch('/api/planner_data');
        const data = await response.json();

        if(response.ok){
            const planner = data.planner_data;
            console.log("data loaded successfully");
            return planner;
        }
        else{
            console.error(data.error);
            return {};
        }
    }catch(error){
        console.error('Error:',error);
        return {};
    }    
}

document.addEventListener('DOMContentLoaded', async function(){

    set_header();
    create_cal_header();
    create_cal_body();
    planner = await getPlanner();
    displayPlanner(planner);
});
