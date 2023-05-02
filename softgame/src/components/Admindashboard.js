import React, { useState, useEffect } from 'react';
import './Admindashboard.css';
// import './Dashboard.css'
import { Chart, LineController, LineElement, BarController } from 'chart.js';
import { CategoryScale } from 'chart.js';
import { registerables } from 'chart.js';
import { LinearScale } from 'chart.js';
import { Table, Badge } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

// Define some symbols for the first row
const symbols = ["🏆", "🥈", "🥉"];

Chart.register(...registerables, LinearScale);
Chart.register(CategoryScale);
Chart.register(BarController);

function Admindashboard() {
  const [puzzlestats, setPuzzleStats] = useState({});
  const [Mysterystats, setMysterystats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [isClickeds, setIsClickeds] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/adminstats');
        const data = await response.json();
        console.log(data);
        setUserStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  const graphfunpuzzlestats = async (user) => {
    setIsClicked(true);
    setIsClickeds(false);
    try {
      const resp = await fetch(`http://localhost:3001/${user.email}/puzzlestats`);
      const data = await resp.json();
      console.log("hgjasgblk.,sn kj", data);
      setPuzzleStats(data);
      console.log("is it  ", puzzlestats)
    } catch (error) {
      console.error(error);
      alert('failed to fetch user stats')
    }
  };

  const graphfunstats = async (user) => {
    setIsClickeds(true);
    setIsClicked(false);
    // setIsClicked(true);
    try {
      const resp = await fetch(`http://localhost:3001/${user.email}/stats`);
      const data = await resp.json();
      console.log("--------", data);
      setMysterystats(data);
      console.log("is it puzzle ", puzzlestats)
    } catch (error) {
      console.error(error);
      alert('failed to fetch user stats')
    }
  }


  useEffect(() => {
    if (isClickeds) {
      // setIsClicked(!isClicked)
      const mysterychartData = {
        labels: ['Number of times played', 'Total wrong answers', 'Total time spent', 'Avg time per task'],
        datasets: [
          {
            label: 'Mystery game',
            data: [Mysterystats.numTasks, Mysterystats.totalWrongAnswers, Mysterystats.totalSecondsSpent, Mysterystats.avgSecondsPerTask],
            backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(128, 0, 128, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(144, 238, 144, 0.5)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(128, 0, 128, 1)', 'rgba(255, 206, 86, 1)', 'rgba(144, 238, 144, 1)'],
            borderWidth: 1
          }
  
        ]
      };
  
     

      const ctxs = document.getElementById('mysterychart').getContext('2d');
      // Destroy the existing chart before creating a new one
      const existingChart = Chart.instances[0];
      if (existingChart) {
        existingChart.destroy();
      }
      const myChart = new Chart(ctxs, {
        type: 'bar',
        data: mysterychartData,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [Mysterystats, isClickeds]);


  useEffect(() => {
    if (isClicked) {
      // setIsClickeds(!isClickeds)
      const chartData = {
        labels: ['Number of times won', 'Total moves', 'Total seconds', 'Avg moves'],
        datasets: [
          {
            label: 'The 16',
            data: [puzzlestats.numoftimesplayed, puzzlestats.totalmoves, puzzlestats.totalSecondsSpent, puzzlestats.avgmoves],
            backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 159, 64, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }
        ]
      };

      const ctx = document.getElementById('mypuzzlechart').getContext('2d');
      // Destroy the existing chart before creating a new one
      const existingChart = Chart.instances[0];
      if (existingChart) {
        existingChart.destroy();
      }
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [puzzlestats, isClicked]);

  return (
    <div>
      <h2 className='center mt-3'>Number of Users: {userStats.numUsers}</h2>
      <p className='container'><b>Note:</b> click on the user Email to see the user stats in that game</p>
      <div className='container'>
        <h3 className='the mt-3 mb-3'>Leaderboard: Mystery Game</h3>
        <table className="mb-3 mt-3 table table-bordered table-striped table-hover ">
          <thead className="thead-dark">
            <tr>
              <th scope="col"><i className="fas fa-user"></i> User Email</th>
              <th scope="col">Total Time Spent</th>
              <th scope="col">Wrongly Answered</th>
            </tr>
          </thead>
          <tbody>
            {(userStats.game1Leaderboard ?? []).map((user, index) => (
              <tr key={index}>
                <td onClick={() => graphfunstats(user)} >{index < 3 ? symbols[index] : ''} {user.email}</td>
                <td>{user.totalTimeSpent}</td>
                <td>{user.wronglyanswered}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='graphchart w-50 h-50 center container'>
        <canvas  id = "mysterychart"></canvas>
        </div>
        

        <h3 className=' the mt-3 mb-3'>Leaderboard: Slide Puzzle</h3>
        <table className="mb-3 mt-3 table table-bordered table-striped table-hover ">
          <thead className="thead-dark">
            <tr>
              <th scope="col"><i className="fas fa-user"></i> User Email</th>
              <th scope="col">No. of Times Played</th>
              <th scope="col">Average Moves</th>
            </tr>
          </thead>
          <tbody>
            {(userStats.game2Leaderboard ?? []).map((user, index) => (
              <tr key={index}  >
                <td onClick={() => graphfunpuzzlestats(user)}>{index < 3 ? symbols[index] : ''} {user.email}</td>

                <td>{user.timesplayed}</td>
                <td>{user.avgMoves ? user.avgMoves.toFixed(2) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <div className='graphchart w-50 h-50 center container mb-5'>
      <canvas id="mypuzzlechart"></canvas>
      </div>
      
      
    </div>
  );
}

export default Admindashboard;
