/**
 * TODO:
 * Event categories with colors (Implement a pallette of colors)
 * allow users to add event types
 * Responsive mobile layout (Implemented but will need improvemnts)
 * Add weekly calendar view
 * Drag and drop events(Complex and can be done last)
 */

//Constants
//Today's date info used as a default when the calendar is loaded up
const today = new Date();
const year_to_date = today.getFullYear();
const month_to_date = today.getMonth();
const day_to_date = today.getDate();
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayNames = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
const format_st = [1,21,31];
const format_nd = [2, 22];
const format_rd = [3, 23];

//INIT variables
let yr = year_to_date;
let mon = month_to_date;
let selectedDate = null;
let planner = {
  "2026-4-1": [
    { "id": 0, "end": "14:30", "date": "2026-4-1", "name": "Chick Fil A", "type": "work", "start": "06:00", "description": "breading BOH" },
    { "id": 1, "end": "", "date": "2026-4-1", "name": "Work on project", "type": "personal", "start": "", "description": "" },
    { "id": 2, "end": "20:00", "date": "2026-4-1", "name": "Gym", "type": "personal", "start": "18:00", "description": "Leg day" },
    { "id": 3, "end": "09:00", "date": "2026-4-1", "name": "Doctor Appointment", "type": "personal", "start": "08:00", "description": "Annual checkup" },
    { "id": 4, "end": "23:00", "date": "2026-4-1", "name": "Study Session", "type": "personal", "start": "21:00", "description": "Review calculus notes" }
  ],
  "2026-4-2": [
    { "id": 5, "end": "15:00", "date": "2026-4-2", "name": "Chick Fil A", "type": "work", "start": "07:00", "description": "Front counter" },
    { "id": 6, "end": "12:00", "date": "2026-4-2", "name": "Grocery Run", "type": "personal", "start": "11:00", "description": "Costco and Trader Joe's" },
    { "id": 7, "end": "19:00", "date": "2026-4-2", "name": "Dentist", "type": "personal", "start": "18:00", "description": "Cleaning" },
    { "id": 8, "end": "", "date": "2026-4-2", "name": "Call Mom", "type": "personal", "start": "", "description": "" }
  ],
  "2026-4-3": [
    { "id": 9, "end": "14:00", "date": "2026-4-3", "name": "Chick Fil A", "type": "work", "start": "06:00", "description": "Opening shift, nugget prep" },
    { "id": 10, "end": "16:00", "date": "2026-4-3", "name": "Car Wash", "type": "personal", "start": "15:30", "description": "" },
    { "id": 11, "end": "20:30", "date": "2026-4-3", "name": "Movie Night", "type": "social", "start": "19:00", "description": "Watch Dune 3 with friends" },
    { "id": 12, "end": "09:30", "date": "2026-4-3", "name": "Morning Run", "type": "personal", "start": "08:00", "description": "5 miles" },
    { "id": 13, "end": "22:00", "date": "2026-4-3", "name": "Meal Prep", "type": "personal", "start": "21:00", "description": "Cook for the week" }
  ],
  "2026-4-4": [
    { "id": 14, "end": "13:00", "date": "2026-4-4", "name": "Church", "type": "personal", "start": "10:00", "description": "" },
    { "id": 15, "end": "15:00", "date": "2026-4-4", "name": "Family Lunch", "type": "social", "start": "13:30", "description": "Dad's birthday lunch at Olive Garden" },
    { "id": 16, "end": "18:00", "date": "2026-4-4", "name": "Study Group", "type": "personal", "start": "16:00", "description": "Chemistry group project" },
    { "id": 17, "end": "", "date": "2026-4-4", "name": "Finish essay draft", "type": "personal", "start": "", "description": "English 101 due Monday" }
  ],
  "2026-4-5": [
    { "id": 18, "end": "14:30", "date": "2026-4-5", "name": "Chick Fil A", "type": "work", "start": "07:00", "description": "Drive-thru window" },
    { "id": 19, "end": "17:00", "date": "2026-4-5", "name": "Haircut", "type": "personal", "start": "16:30", "description": "" },
    { "id": 20, "end": "20:00", "date": "2026-4-5", "name": "Gym", "type": "personal", "start": "18:30", "description": "Chest and triceps" },
    { "id": 21, "end": "22:30", "date": "2026-4-5", "name": "Game Night", "type": "social", "start": "20:30", "description": "Board games at Jake's place" }
  ],
  "2026-4-6": [
    { "id": 22, "end": "09:00", "date": "2026-4-6", "name": "Morning Run", "type": "personal", "start": "07:30", "description": "3 miles easy pace" },
    { "id": 23, "end": "12:00", "date": "2026-4-6", "name": "Laundry", "type": "personal", "start": "10:00", "description": "" },
    { "id": 24, "end": "15:00", "date": "2026-4-6", "name": "Library", "type": "personal", "start": "13:00", "description": "Return books and study" },
    { "id": 25, "end": "19:00", "date": "2026-4-6", "name": "Dinner with Sarah", "type": "social", "start": "18:00", "description": "Sushi place downtown" },
    { "id": 26, "end": "", "date": "2026-4-6", "name": "Pay rent", "type": "personal", "start": "", "description": "Due today" }
  ],
  "2026-4-7": [
    { "id": 27, "end": "15:00", "date": "2026-4-7", "name": "Chick Fil A", "type": "work", "start": "08:00", "description": "BOH training new hire" },
    { "id": 28, "end": "17:30", "date": "2026-4-7", "name": "Grocery Run", "type": "personal", "start": "16:30", "description": "Walmart run" },
    { "id": 29, "end": "21:00", "date": "2026-4-7", "name": "Gym", "type": "personal", "start": "19:00", "description": "Back and biceps" },
    { "id": 30, "end": "", "date": "2026-4-7", "name": "Email professor", "type": "personal", "start": "", "description": "Ask about extra credit" }
  ],
  "2026-4-8": [
    { "id": 31, "end": "14:00", "date": "2026-4-8", "name": "Chick Fil A", "type": "work", "start": "06:00", "description": "Opening, fry station" },
    { "id": 32, "end": "16:30", "date": "2026-4-8", "name": "Oil Change", "type": "personal", "start": "15:30", "description": "Jiffy Lube" },
    { "id": 33, "end": "20:00", "date": "2026-4-8", "name": "Study Session", "type": "personal", "start": "18:00", "description": "Midterm review" },
    { "id": 34, "end": "22:00", "date": "2026-4-8", "name": "FaceTime Alex", "type": "social", "start": "21:00", "description": "" },
    { "id": 35, "end": "", "date": "2026-4-8", "name": "Submit assignment", "type": "personal", "start": "", "description": "Stats homework due 11:59pm" }
  ],
  "2026-4-9": [
    { "id": 36, "end": "11:00", "date": "2026-4-9", "name": "Morning Run", "type": "personal", "start": "09:30", "description": "Long run, 7 miles" },
    { "id": 37, "end": "14:00", "date": "2026-4-9", "name": "Brunch with Friends", "type": "social", "start": "12:30", "description": "First Watch" },
    { "id": 38, "end": "17:00", "date": "2026-4-9", "name": "Work on project", "type": "personal", "start": "15:00", "description": "Portfolio website" },
    { "id": 39, "end": "20:00", "date": "2026-4-9", "name": "Grocery Run", "type": "personal", "start": "19:00", "description": "" }
  ],
  "2026-4-10": [
    { "id": 40, "end": "13:00", "date": "2026-4-10", "name": "Church", "type": "personal", "start": "10:00", "description": "" },
    { "id": 41, "end": "15:30", "date": "2026-4-10", "name": "Chick Fil A", "type": "work", "start": "14:00", "description": "Closing shift help" },
    { "id": 42, "end": "18:00", "date": "2026-4-10", "name": "Gym", "type": "personal", "start": "16:30", "description": "Shoulders and traps" },
    { "id": 43, "end": "", "date": "2026-4-10", "name": "Meal prep", "type": "personal", "start": "", "description": "Rice, chicken, broccoli" }
  ],
  "2026-4-11": [
    { "id": 44, "end": "14:30", "date": "2026-4-11", "name": "Chick Fil A", "type": "work", "start": "06:00", "description": "BOH, lemonade restock" },
    { "id": 45, "end": "17:00", "date": "2026-4-11", "name": "Tutoring Session", "type": "personal", "start": "15:30", "description": "Help cousin with algebra" },
    { "id": 46, "end": "20:00", "date": "2026-4-11", "name": "Study Session", "type": "personal", "start": "18:30", "description": "Review psych notes" },
    { "id": 47, "end": "", "date": "2026-4-11", "name": "Fix resume", "type": "personal", "start": "", "description": "Update internship section" }
  ],
  "2026-4-12": [
    { "id": 48, "end": "09:30", "date": "2026-4-12", "name": "Morning Run", "type": "personal", "start": "08:00", "description": "4 miles" },
    { "id": 49, "end": "13:00", "date": "2026-4-12", "name": "Dentist Follow-up", "type": "personal", "start": "12:00", "description": "Check on cavity filling" },
    { "id": 50, "end": "16:00", "date": "2026-4-12", "name": "Work on project", "type": "personal", "start": "14:00", "description": "Calendar app bug fixes" },
    { "id": 51, "end": "19:30", "date": "2026-4-12", "name": "Chick Fil A", "type": "work", "start": "17:00", "description": "Evening shift, drive-thru" },
    { "id": 52, "end": "22:00", "date": "2026-4-12", "name": "Movie with roommates", "type": "social", "start": "20:30", "description": "" }
  ],
  "2026-4-13": [
    { "id": 53, "end": "10:00", "date": "2026-4-13", "name": "Gym", "type": "personal", "start": "08:30", "description": "Full body" },
    { "id": 54, "end": "13:00", "date": "2026-4-13", "name": "Lunch with Dad", "type": "social", "start": "12:00", "description": "Catch up, Chili's" },
    { "id": 55, "end": "17:00", "date": "2026-4-13", "name": "Library Study", "type": "personal", "start": "14:30", "description": "Final exam prep" },
    { "id": 56, "end": "", "date": "2026-4-13", "name": "Apply to internship", "type": "personal", "start": "", "description": "Google SWE internship deadline" }
  ],
  "2026-4-14": [
    { "id": 57, "end": "14:00", "date": "2026-4-14", "name": "Chick Fil A", "type": "work", "start": "06:30", "description": "Opening, sandwich prep" },
    { "id": 58, "end": "16:30", "date": "2026-4-14", "name": "Pick up prescription", "type": "personal", "start": "15:30", "description": "CVS pharmacy" },
    { "id": 59, "end": "19:00", "date": "2026-4-14", "name": "Gym", "type": "personal", "start": "17:30", "description": "Legs" },
    { "id": 60, "end": "21:30", "date": "2026-4-14", "name": "Netflix binge", "type": "personal", "start": "20:00", "description": "Catch up on Severance" },
    { "id": 61, "end": "", "date": "2026-4-14", "name": "Budget check", "type": "personal", "start": "", "description": "Review this month's spending" }
  ],
  "2026-4-15": [
    { "id": 62, "end": "09:00", "date": "2026-4-15", "name": "Morning Run", "type": "personal", "start": "07:30", "description": "5 miles tempo" },
    { "id": 63, "end": "12:30", "date": "2026-4-15", "name": "Tax Filing", "type": "personal", "start": "10:00", "description": "Tax deadline today!" },
    { "id": 64, "end": "15:00", "date": "2026-4-15", "name": "Chick Fil A", "type": "work", "start": "13:00", "description": "Mid shift, front counter" },
    { "id": 65, "end": "18:30", "date": "2026-4-15", "name": "Gym", "type": "personal", "start": "17:00", "description": "Chest" },
    { "id": 66, "end": "21:00", "date": "2026-4-15", "name": "Dinner with friends", "type": "social", "start": "19:30", "description": "Korean BBQ" }
  ],
  "2026-4-16": [
    { "id": 67, "end": "11:00", "date": "2026-4-16", "name": "Sleep in", "type": "personal", "start": "09:00", "description": "Rest day" },
    { "id": 68, "end": "14:00", "date": "2026-4-16", "name": "Brunch", "type": "social", "start": "12:30", "description": "With coworkers from CFA" },
    { "id": 69, "end": "17:30", "date": "2026-4-16", "name": "Grocery Run", "type": "personal", "start": "16:00", "description": "" },
    { "id": 70, "end": "21:00", "date": "2026-4-16", "name": "Study Session", "type": "personal", "start": "19:00", "description": "Midterm tomorrow" }
  ],
  "2026-4-17": [
    { "id": 71, "end": "11:00", "date": "2026-4-17", "name": "Midterm Exam", "type": "personal", "start": "09:00", "description": "Chemistry 201" },
    { "id": 72, "end": "14:30", "date": "2026-4-17", "name": "Chick Fil A", "type": "work", "start": "12:00", "description": "Lunch rush" },
    { "id": 73, "end": "17:00", "date": "2026-4-17", "name": "Gym", "type": "personal", "start": "15:30", "description": "Post-exam stress relief" },
    { "id": 74, "end": "", "date": "2026-4-17", "name": "Call grandma", "type": "personal", "start": "", "description": "" }
  ],
  "2026-4-18": [
    { "id": 75, "end": "10:00", "date": "2026-4-18", "name": "Morning Run", "type": "personal", "start": "08:30", "description": "Easy 4 miles" },
    { "id": 76, "end": "14:00", "date": "2026-4-18", "name": "Work on project", "type": "personal", "start": "11:00", "description": "Add event drag & drop" },
    { "id": 77, "end": "17:00", "date": "2026-4-18", "name": "Chick Fil A", "type": "work", "start": "15:00", "description": "Mid shift" },
    { "id": 78, "end": "20:00", "date": "2026-4-18", "name": "Grocery Run", "type": "personal", "start": "18:30", "description": "Meal prep supplies" },
    { "id": 79, "end": "", "date": "2026-4-18", "name": "Reply to emails", "type": "personal", "start": "", "description": "3 unread school emails" }
  ],
  "2026-4-19": [
    { "id": 80, "end": "13:00", "date": "2026-4-19", "name": "Church", "type": "personal", "start": "10:00", "description": "Easter Sunday" },
    { "id": 81, "end": "16:00", "date": "2026-4-19", "name": "Easter Family Gathering", "type": "social", "start": "14:00", "description": "Grandma's house" },
    { "id": 82, "end": "19:00", "date": "2026-4-19", "name": "Egg Hunt (kids)", "type": "social", "start": "17:00", "description": "Help organize for the little ones" },
    { "id": 83, "end": "", "date": "2026-4-19", "name": "Meal prep", "type": "personal", "start": "", "description": "Leftovers from Easter dinner" }
  ],
  "2026-4-20": [
    { "id": 84, "end": "14:30", "date": "2026-4-20", "name": "Chick Fil A", "type": "work", "start": "07:00", "description": "BOH, breading and frying" },
    { "id": 85, "end": "17:00", "date": "2026-4-20", "name": "Gym", "type": "personal", "start": "15:30", "description": "Arms" },
    { "id": 86, "end": "20:00", "date": "2026-4-20", "name": "Study Session", "type": "personal", "start": "18:30", "description": "History reading" },
    { "id": 87, "end": "", "date": "2026-4-20", "name": "Check grades", "type": "personal", "start": "", "description": "" }
  ],
  "2026-4-21": [
    { "id": 88, "end": "09:30", "date": "2026-4-21", "name": "Morning Run", "type": "personal", "start": "08:00", "description": "6 miles" },
    { "id": 89, "end": "13:00", "date": "2026-4-21", "name": "Work on project", "type": "personal", "start": "10:30", "description": "CSS overflow fix" },
    { "id": 90, "end": "16:00", "date": "2026-4-21", "name": "Lunch with coworkers", "type": "social", "start": "13:30", "description": "Chipotle" },
    { "id": 91, "end": "20:30", "date": "2026-4-21", "name": "Chick Fil A", "type": "work", "start": "17:00", "description": "Evening shift" },
    { "id": 92, "end": "", "date": "2026-4-21", "name": "Write in journal", "type": "personal", "start": "", "description": "" }
  ],
  "2026-4-22": [
    { "id": 93, "end": "11:00", "date": "2026-4-22", "name": "Gym", "type": "personal", "start": "09:00", "description": "Legs and core" },
    { "id": 94, "end": "14:00", "date": "2026-4-22", "name": "Chick Fil A", "type": "work", "start": "11:30", "description": "Lunch shift" },
    { "id": 95, "end": "17:30", "date": "2026-4-22", "name": "Dentist", "type": "personal", "start": "16:30", "description": "Check on filling" },
    { "id": 96, "end": "21:00", "date": "2026-4-22", "name": "Hang with friends", "type": "social", "start": "19:00", "description": "Bowling at Main Event" },
    { "id": 97, "end": "", "date": "2026-4-22", "name": "Online quiz", "type": "personal", "start": "", "description": "Due tonight at midnight" }
  ],
  "2026-4-23": [
    { "id": 98, "end": "10:00", "date": "2026-4-23", "name": "Sleep in", "type": "personal", "start": "", "description": "" },
    { "id": 99, "end": "13:00", "date": "2026-4-23", "name": "Brunch", "type": "social", "start": "11:30", "description": "Waffle House run" },
    { "id": 100, "end": "16:00", "date": "2026-4-23", "name": "Work on project", "type": "personal", "start": "14:00", "description": "Add recurring events feature" },
    { "id": 101, "end": "19:30", "date": "2026-4-23", "name": "Grocery Run", "type": "personal", "start": "18:00", "description": "" }
  ],
  "2026-4-24": [
    { "id": 102, "end": "14:00", "date": "2026-4-24", "name": "Chick Fil A", "type": "work", "start": "06:00", "description": "Opening, full BOH" },
    { "id": 103, "end": "17:00", "date": "2026-4-24", "name": "Library", "type": "personal", "start": "15:00", "description": "Return overdue book" },
    { "id": 104, "end": "20:00", "date": "2026-4-24", "name": "Gym", "type": "personal", "start": "18:00", "description": "Chest and shoulders" },
    { "id": 105, "end": "", "date": "2026-4-24", "name": "Call insurance", "type": "personal", "start": "", "description": "Dispute claim charge" }
  ],
  "2026-4-25": [
    { "id": 106, "end": "09:00", "date": "2026-4-25", "name": "Morning Run", "type": "personal", "start": "07:30", "description": "8 miles long run" },
    { "id": 107, "end": "13:00", "date": "2026-4-25", "name": "Work on project", "type": "personal", "start": "10:30", "description": "Polish UI and test data" },
    { "id": 108, "end": "16:30", "date": "2026-4-25", "name": "Chick Fil A", "type": "work", "start": "14:00", "description": "Afternoon shift" },
    { "id": 109, "end": "20:00", "date": "2026-4-25", "name": "Study Session", "type": "personal", "start": "18:30", "description": "Final exam prep week 1" },
    { "id": 110, "end": "22:30", "date": "2026-4-25", "name": "Movie Night", "type": "social", "start": "21:00", "description": "Thriller night with roommates" }
  ],
  "2026-4-26": [
    { "id": 111, "end": "13:00", "date": "2026-4-26", "name": "Church", "type": "personal", "start": "10:00", "description": "" },
    { "id": 112, "end": "15:00", "date": "2026-4-26", "name": "Family BBQ", "type": "social", "start": "13:30", "description": "Uncle's backyard" },
    { "id": 113, "end": "18:00", "date": "2026-4-26", "name": "Gym", "type": "personal", "start": "16:30", "description": "Light active recovery" },
    { "id": 114, "end": "", "date": "2026-4-26", "name": "Meal prep", "type": "personal", "start": "", "description": "" }
  ],
  "2026-4-27": [
    { "id": 115, "end": "14:00", "date": "2026-4-27", "name": "Chick Fil A", "type": "work", "start": "07:00", "description": "Inventory count morning" },
    { "id": 116, "end": "17:00", "date": "2026-4-27", "name": "Academic Advising", "type": "personal", "start": "15:30", "description": "Plan next semester schedule" },
    { "id": 117, "end": "20:30", "date": "2026-4-27", "name": "Study Session", "type": "personal", "start": "18:30", "description": "English paper outline" },
    { "id": 118, "end": "", "date": "2026-4-27", "name": "Water plants", "type": "personal", "start": "", "description": "" }
  ],
  "2026-4-28": [
    { "id": 119, "end": "10:00", "date": "2026-4-28", "name": "Morning Run", "type": "personal", "start": "08:30", "description": "5 miles easy" },
    { "id": 120, "end": "14:00", "date": "2026-4-28", "name": "Chick Fil A", "type": "work", "start": "11:00", "description": "BOH lunch rush" },
    { "id": 121, "end": "17:00", "date": "2026-4-28", "name": "Gym", "type": "personal", "start": "15:30", "description": "Back and biceps" },
    { "id": 122, "end": "20:00", "date": "2026-4-28", "name": "Dinner out", "type": "social", "start": "18:30", "description": "Thai food with Marcus" },
    { "id": 123, "end": "", "date": "2026-4-28", "name": "Submit final draft", "type": "personal", "start": "", "description": "English paper due" }
  ],
  "2026-4-29": [
    { "id": 124, "end": "11:30", "date": "2026-4-29", "name": "Sleep in", "type": "personal", "start": "", "description": "No alarm" },
    { "id": 125, "end": "14:00", "date": "2026-4-29", "name": "Laundry", "type": "personal", "start": "12:00", "description": "" },
    { "id": 126, "end": "17:00", "date": "2026-4-29", "name": "Work on project", "type": "personal", "start": "15:00", "description": "Final testing before deploy" },
    { "id": 127, "end": "20:30", "date": "2026-4-29", "name": "Chick Fil A", "type": "work", "start": "18:00", "description": "Closing shift" },
    { "id": 128, "end": "", "date": "2026-4-29", "name": "Pack gym bag", "type": "personal", "start": "", "description": "" }
  ],
  "2026-4-30": [
    { "id": 129, "end": "09:30", "date": "2026-4-30", "name": "Morning Run", "type": "personal", "start": "08:00", "description": "Last run of April, 6 miles" },
    { "id": 130, "end": "13:00", "date": "2026-4-30", "name": "Chick Fil A", "type": "work", "start": "10:00", "description": "Morning shift" },
    { "id": 131, "end": "16:00", "date": "2026-4-30", "name": "Grocery Run", "type": "personal", "start": "14:30", "description": "Stock up for May" },
    { "id": 132, "end": "19:00", "date": "2026-4-30", "name": "Study Session", "type": "personal", "start": "17:00", "description": "Finals are coming" },
    { "id": 133, "end": "22:00", "date": "2026-4-30", "name": "End of month review", "type": "personal", "start": "20:30", "description": "Journal + budget + goals check-in" },
    { "id": 134, "end": "", "date": "2026-4-30", "name": "Set May goals", "type": "personal", "start": "", "description": "Fitness, school, work balance" }
  ]
};
let calendar_event_types = [
  { "name": "work",     "color": "#1a73e8", "default": true },
  { "name": "health",   "color": "#34a853", "default": true },
  { "name": "fitness",  "color": "#e8710a", "default": true },
  { "name": "personal", "color": "#9c27b0", "default": true },
  { "name": "social",   "color": "#e91e63", "default": true }
];

//Select
let event_type_select = document.getElementById('event-type');

//div
let event_type_list = document.getElementById('event-types-list');

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
let prev_month = document.getElementById('prev');
let next_month = document.getElementById('next');
let event_cancel_btn = document.getElementById('cancel-btn');
let event_save_btn = document.getElementById('save-btn');
let type_save_btn = document.getElementById('event-type-save-btn');
let type_cancel_btn = document.getElementById('event-type-cancel-btn');
let add_type_btn = document.getElementById('add-type-btn');

//might change later since I need to clean up and simplify this file
function replaceButton(btn) {
    if (!btn) {
        console.error("replaceButton got an invalid button:", btn);
        return null;
    }

    if (!btn.parentNode) {
        console.error("Button has no parentNode:", btn);
        return null;
    }

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    return newBtn;
}

/**
 * Calculates luminance of a color and returns either black or white based on if the background color is lighter or darker
 * @param {*} hexColor color in hex format ex: #ffffff
 * @return text color in hex format ex: #000000 or #ffffff
 */
function getTextColor(hexColor) {
    const hex = hexColor.replace('#', '');

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance (human eye weighs colors differently)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Light background = dark text, dark background = light text
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Initalizing event types on the side and in the add/edit event form select options
 */
function initEventTypeList(){
    calendar_event_types.forEach(event_type => {
        addEventType(event_type);
    });
}

function addEventType(event_type){
    const li = document.createElement('li');
    li.id = "event-type-" + event_type.name;
    li.classList.add('event-type-item');
    li.textContent = event_type.name;
    li.dataset.eventTypeData = JSON.stringify(event_type);

    const colordot = document.createElement('span');
    colordot.classList.add('event-type-color-dot');
    colordot.style.backgroundColor = event_type.color;

    li.appendChild(colordot);
    event_type_list.appendChild(li);

    const option = document.createElement('option');
    option.value = event_type.name;
    option.textContent = event_type.name;
    event_type_select.appendChild(option);    
}

function showTypeForm(){
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('event-type-form').style.display = 'flex';
}

function closeTypeForm(){
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('event-type-form').style.display = 'none';
    document.getElementById('event-type-name').value = '';
}

add_type_btn.addEventListener('click', showTypeForm);

type_save_btn.addEventListener('click', async function(event){
    event.preventDefault();
    const event_type_name =  document.getElementById('event-type-name').value;
    const color = document.getElementById('event-type-color').value;
    let error_message = document.getElementById('event-type-error');

const check = calendar_event_types.find(type => type.name === event_type_name)?.name || "EIONCWOENCOWNEBOIU";
    if(check === event_type_name){
        error_message.textContent = "Name already used!!!";
        error_message.style.display = "block";
        return;
    }
    else if(event_type_name.trim() === ""){
        error_message.textContent = "Name is empty";
        error_message.style.display = "block";
        return;        
    }
    
    console.log(color);

    const data = {'name':event_type_name, 'color':color,'default':false};
    
    calendar_event_types.push(data);
    addEventType(data);
    await getData()
    closeTypeForm()

});
type_cancel_btn.addEventListener('click', closeTypeForm);


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
            const div = document.createElement('div');
            div.classList.add('date');

            if((row === 0 && col < firstday) || (day > daysInMonth)){ //creating empty cell
                td.id = 'empty-'+row+'-'+col;
                td.classList.add('empty');
            }
            else{
                td.id = yr + "-" + (mon+1) + "-" + day;

                const date_cell = document.createElement('div');
                date_cell.classList.add('date-cell');
                div.appendChild(date_cell);

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

                div.appendChild(eventList);

                const btn = document.createElement('button');
                btn.classList.add("add-event-btn");
                btn.innerHTML = '<span class="plus">+</span>';
                date_cell.appendChild(btn);

                const currentDay = day;
                btn.addEventListener('click', () => {
                    const getDate = new Date(yr, mon, currentDay);
                    console.log(getDate);
                    showEventForm(getDate);
                });

                td.appendChild(div);

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

/**
 * Shows pop up form for adding events to a day
 * @param {*} date 
 * @param {*} mode 
 * @param {*} item 
 */
function showEventForm(date = null, mode = "add", item=null){
    if (mode === "add" && date){
        selectedDate = date;
        document.getElementById('overlay').style.display = 'flex';
        document.getElementById('event-form').style.display = 'flex';
        let format = dateFormat(selectedDate);
        event_title.textContent = "Add Event for " + format;     
        
        event_save_btn = replaceButton(event_save_btn);
        event_cancel_btn = replaceButton(event_cancel_btn); 


        event_save_btn.textContent = "Save Event";
        event_cancel_btn.textContent = "Cancel";

        //button to close form
        event_cancel_btn.addEventListener('click', closeEventForm);

        //button to save event into database and display on calendar
        event_save_btn.addEventListener('click', save_event);



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
        event_save_btn = replaceButton(event_save_btn);
        event_cancel_btn = replaceButton(event_cancel_btn);


        event_save_btn.textContent = "Save Edit";
        event_cancel_btn.textContent = "Delete Event";

        event_save_btn.addEventListener('click', function(event){
            edit_event(event, item=item);
        });
        event_cancel_btn.addEventListener('click', function(event){
            delete_event(event, item=item);
        });

    }
    else{
        console.error("Invalid mode, date, or item");
    }
}
/**
 * Closes pop up form for adding events to day and resets all values to default
 */
function closeEventForm(){
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

async function delete_event(event, item){
    event.preventDefault();
    const data = JSON.parse(item.dataset.eventData);

    if(!planner[data.date]){return;}

    planner[data.date] = planner[data.date].filter(event => event.id !== data.id);

    if(planner[data.date].length === 0){
        delete planner[data.date];
    }
    else{
        //Update id of events after the deleted event to prevent id confusion/errors
        planner[data.date].forEach(event => {
            const old_id = event.id;
            const id = planner[data.date].indexOf(event);
            event.id = id;

            const li = document.getElementById(data.date + '-' + old_id);
            if(li){
                li.id = data.date + '-' + id;
                li.dataset.eventData = JSON.stringify(event);
            }
        });       
    }

    const li = document.getElementById(data.date + '-' + data.id);
    if(li){
        li.remove();
    }



    await saveData();
    closeEventForm();
}

async function edit_event(event, item){
    event.preventDefault();

    const data = JSON.parse(item.dataset.eventData);

    const event_name = document.getElementById('event-name').value;
    const event_description = document.getElementById('event-description').value;
    const event_type = document.getElementById('event-type').value;
    const event_start = document.getElementById('event-start').value;
    const event_end = document.getElementById('event-end').value; 

    planner[data.date][data.id] = {
            name : event_name,
            description : event_description,
            type : event_type,
            start : event_start,
            end : event_end,
            id : data.id,
            date : data.date        
    }
    
    const li = document.getElementById(data.date + '-' + data.id);
    li.textContent = event_name;
    li.dataset.eventData = JSON.stringify(planner[data.date][data.id]);
    const hexcolor = calendar_event_types.find(type => type.name === planner[data.date][data.id].type)?.color || '#ffffff';
    li.style.backgroundColor = hexcolor;
    li.style.color = getTextColor(hexcolor);
    await saveData();
    closeEventForm();
    
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
            id : null,
            date : null
        };

        const Eventyear = selectedDate.getFullYear();
        const Eventmonth = selectedDate.getMonth()+1;
        const Eventday = selectedDate.getDate();
        const dateKey = Eventyear+"-"+Eventmonth+"-"+Eventday;

        data['date'] = dateKey;

        if(!planner[dateKey]){planner[dateKey] = [];}

        planner[dateKey].push(data);
        id = planner[dateKey].length - 1;

        data['id'] = id;            

        const eventList = document.getElementById("events-" + dateKey);

        const li = document.createElement('li');
        li.id = dateKey + '-' + id;
        li.textContent = event_name;
        li.classList.add('event-item');
        const hexcolor = calendar_event_types.find(type => type.name === data.type)?.color || '#ffffff';
        li.style.backgroundColor = hexcolor;
        li.style.color = getTextColor(hexcolor);
        li.dataset.eventData = JSON.stringify(data); // Store event data in a data attribute
        addEventButton(li);
        eventList.appendChild(li);

        
        //Save planner func
        let result = await saveData();
        if (!result){
            console.log("Could not save event to database");
            console.log("Event will be used for current session but not for future sessions");
        }
        closeEventForm();      
    }    
}

//Go back one month
prev_month.addEventListener('click', function() {
    mon --;
    if(mon < 0){
        yr --;
        mon = 11;
    }
    set_header();   
    create_monthly_view_B();
    displayPlanner(planner);
    reloadEventItems();

});

//Go foward one month
next_month.addEventListener('click', function() {
    mon ++;
    if(mon > 11){
        yr ++;
        mon = 0;
    }
    set_header();   
    create_monthly_view_B(); 
    displayPlanner(planner);
    reloadEventItems();

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
        count = 0;
        //Display name of each event
        events[key].forEach(event => {
            if(event.id === null){
                event["id"] = count;
                console.log(event);
            }

            const hexcolor = calendar_event_types.find(type => type.name === event.type)?.color || '#ffffff';

            const li = document.createElement('li');
            li.id = key + '-' + event.id;
            li.textContent = event.name;
            li.classList.add('event-item');
            li.style.backgroundColor = hexcolor;
            li.style.color = getTextColor(hexcolor);
            li.dataset.eventData = JSON.stringify(event); // Store event data in a data attribute
            eventList.appendChild(li);
            count ++;
        });
    }
}


/**
 * gets data from planner variable and sends it to the server to be stored in the database
 * @returns true, false, or none
 */
async function saveData(){
    try{
        const response = await fetch('/api/save', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                planner_data : planner,
                event_type : calendar_event_types
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
 * @returns username, planner data, and event types
 */
async function getData(){
    try{
        const response = await fetch('/api/get_data');

        if(response.ok){
            const data = await response.json();

            planner = data.planner_data;
            document.getElementById('welcome-message').textContent = "Welcome, " + data.username + "!";
            calendar_event_types = data.event_types;

            console.log("data loaded successfully");
            console.log(calendar_event_types);
        }
        else{
            console.error('Error:',error);
            console.log("Could not retrieve data");
        }

    }catch(error){
        console.error('Error:',error);
        console.log("Could not retrieve data");
    }    
}

function reloadEventItems(){
    //Event listener for each event item on the calendar
    document.querySelectorAll('.event-item').forEach(item => {
        addEventButton(item);
    });    
}

function addEventButton(item){
    item.addEventListener('click',function(){
        showEventForm(null, "edit", item);
        });
}

document.addEventListener('DOMContentLoaded', async function(){
    set_header();
    create_monthly_view_H();
    create_monthly_view_B();
    await getData();
    initEventTypeList();
    displayPlanner(planner);
    reloadEventItems();
});
