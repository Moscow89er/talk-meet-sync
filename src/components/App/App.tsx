import React from "react";
import Header from "../Header/Header";
import Calendar from "../Calendar/Calendar";
// import CreateMeetingButton from "../CreateMeetingButton/CreateMeetingButton";
import Meetings from "../Meetings/Meetings";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
    return (
        <div>
            <Header />
            <div className="container">
                <Calendar />
            </div>    
            <Meetings />
        </div>
    )
}