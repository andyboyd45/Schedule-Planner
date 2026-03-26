const today = new Date();
let yr = today.getFullYear();
let mon = today.getMonth();

let table = document.getElementById('calendar_id');
let thead = document.getElementById('cal_header');
let tbody = document.getElementById('cal_body');
let month = document.getElementById('month');
let year = document.getElementById('year');

let prev = document.getElementById('prev');
let next = document.getElementById('next');

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

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
 */
function create_cal_body(){
    const firstday = new Date(yr, mon, 1).getDay();
    const daysInMonth = new Date(yr, mon+1,0).getDate();
    day = 1;
    
    cal_body.innerHTML = ''; //Refreshes list

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
                btn.id = "btn-"+yr + "-" + mon + "-" + day;
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>';
                date_cell.appendChild(btn);

                day++;
            }

            tr.appendChild(td);
        
        }
        
        tbody.appendChild(tr);
    }
}


prev.addEventListener('click', function() {
    mon --;
    if(mon < 0){
        yr --;
        mon = 11;
    }
    set_header();   
    create_cal_body(); 

});

next.addEventListener('click', function() {
    mon ++;
    if(mon > 11){
        yr ++;
        mon = 0;
    }
    set_header();   
    create_cal_body(); 

});

document.addEventListener('DOMContentLoaded', function(){
    set_header();
    create_cal_header();
    create_cal_body();
});
