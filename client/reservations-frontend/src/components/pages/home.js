import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactFlexyTable from "react-flexy-table"
import "react-flexy-table/dist/index.css"
import Card from "react-bootstrap/Card"
// import {Col, Row, Button, Container} from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";



const ReservationsList = () => {
  const [reservationsList, setReservationsList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/reservations')
      .then(response => {        
        setReservationsList(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>People Count</th>
            <th>Waiting Time</th>
            <th>Status</th>
            <th>Entered By</th>
          </tr>
        </thead>
        <tbody>
          {reservationsList.map(reservation => (
            <tr key={reservation.id}>
              <td>{reservation.name}</td>
              <td>{reservation.count}</td>
              <td>{reservation.start_time}</td>
              <td>{reservation.status}</td>
              <td>{reservation.entered_by}</td>
              <td>
                <button className="action-button edit-button" onClick={() => console.log("edot")/* Implement your edit action */}>
                  Edit
                </button>
                <button className="action-button delete-button" onClick={() => console.log("delete")}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

//   return (
//     <div>
//       <h1>Reservation List</h1>
//       <ul>
//         {reservationsList.map(reservationsList => (
//           <li key={reservationsList.id}>{reservationsList.count}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

export default ReservationsList;