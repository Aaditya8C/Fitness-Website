import React, { useEffect, useState } from "react";
import WorkoutCard from "../components/cards/WorkoutCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import { getWorkouts } from "../api";
import { CircularProgress } from "@mui/material";
import "../pages/Workouts.css"; 

const Workouts = () => {
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    const getTodaysWorkout = async () => {
      setLoading(true);
      const token = localStorage.getItem("fittrack-app-token");
      await getWorkouts(token, date ? `?date=${date}` : "").then((res) => {
        setTodaysWorkouts(res?.data?.todaysWorkouts);
        setLoading(false);
      });
    };
    getTodaysWorkout();
  },[date]);

  return (
    <div className="container">
      <div className="wrapper">
        <div className="left">
          <div className="title">Select Date</div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              onChange={(e) => setDate(`${e.$M + 1}/${e.$D}/${e.$y}`)}
            />
          </LocalizationProvider>
        </div>
        <div className="right">
          <div className="section">
            <div className="sec-title">Today's Workout</div>
            {loading ? (
              <CircularProgress />
            ) : (
              <div className="card-wrapper">
                {todaysWorkouts.map((workout) => (
                  <WorkoutCard workout={workout} key={workout.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
