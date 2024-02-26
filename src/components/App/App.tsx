import React from "react";
import Header from "../Header/Header";
import Calendar from "../Calendar/Calendar";
import Meetings from "../Meetings/Meetings";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
    return (
        <div>
            <Header />
            <div className="bg-light p-4">
                <Calendar /> 
                <Meetings />
            </div>
        </div>
    )
}