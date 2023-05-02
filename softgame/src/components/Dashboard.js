import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Chart, LineController, LineElement, BarController } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { CategoryScale } from 'chart.js';
import { registerables } from 'chart.js';
// import 'chartjs-adapter-date-fns';
import { LinearScale } from 'chart.js';

Chart.register(...registerables, LinearScale);

Chart.register(CategoryScale);
Chart.register(BarController);
function Dashboard() {
  const [stats, setStats] = useState({});
  const [puzzlestats, setpuzzlestats] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const chartData = {
      labels: ['Number of times played', 'Total wrong answers', 'Total time spent', 'Avg time per task'],
      datasets: [
        {
          label: 'Mystery game',
          data: [stats.numTasks, stats.totalWrongAnswers, stats.totalSecondsSpent, stats.avgSecondsPerTask],
          backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(128, 0, 128, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(144, 238, 144, 0.5)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(128, 0, 128, 1)', 'rgba(255, 206, 86, 1)', 'rgba(144, 238, 144, 1)'],
          borderWidth: 1
        }

      ]
    };

    const ctx = document.getElementById('myChart').getContext('2d');
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
  }, [stats]);

  useEffect(() => {
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
  }, [puzzlestats]);

  useEffect(() => {
    const username = localStorage.getItem('user');
    const useremail = JSON.parse(username);

    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:3001/${useremail}/stats`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch user stats');
      }
    };

    fetchStats();

    const fetchpuzzlestats = async () => {
      try {
        const resp = await fetch(`http://localhost:3001/${useremail}/puzzlestats`);
        const data = await resp.json();
        setpuzzlestats(data);
      }
      catch (error) {
        console.error(error);
        alert('failed to fetch user stats')
      }
    };
    fetchpuzzlestats();
  }, []);

  const handleBack = () => {
    navigate('/memory');
  };

  return (
    <div className="container1">
      <h1 >My Statistics</h1>
      <div className='row ms-3 me-3 mt-3'>
        <div className='col-6'>
          <canvas id="myChart"></canvas>
          <div className='stats'>
            <p>Number of tasks completed: {stats.numTasks}</p>
            <p>Total number of wrong answers: {stats.totalWrongAnswers}</p>
            <p>Total time spent: {stats.totalSecondsSpent} seconds</p>
            <p>Average time per task: {stats.avgSecondsPerTask ? stats.avgSecondsPerTask.toFixed(2) + ' seconds' : 'N/A'}</p>

          </div>
        </div>
        <div className='col-6'>
          <canvas id="mypuzzlechart"></canvas>
          <div className='stats'>
            <p>Number of times won: {puzzlestats.numoftimesplayed}</p>
            <p>total moves: {puzzlestats.totalmoves} </p>
            <p>total seconds: {puzzlestats.totalSecondsSpent} </p>
            <p>average moves per game : {puzzlestats.avgmoves} </p>

          </div>
        </div>

      </div>



    </div>
  );
}

export default Dashboard;
