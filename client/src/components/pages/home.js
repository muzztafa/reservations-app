

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import ReactFlexyTable from "react-flexy-table"
// import "react-flexy-table/dist/index.css"
// import Card from "react-bootstrap/Card"
import { Modal, Button, Form } from "react-bootstrap"
// import "bootstrap/dist/css/bootstrap.css";
// import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// import BootstrapTable from "react-bootstrap-table-next";

const ReservationsList = () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IndCUTRsTzlkeEZlZE1uZ2VBSGl0IiwiZW1haWwiOiJhaG1lZG11c3RhZmE1ODMyQGdtYWlsLmNvbSIsIm5hbWUiOiJBaG1lZCBNdXN0YWZhIiwiaWF0IjoxNjkxOTAyMzY1fQ.PXglKdP4ZKIABgVigubPxFIrJYssNlaleh6P7ycnYzc"
  const [reservationsList, setReservationsList] = useState([]);
  const [temp, Settemp] = useState(true); //using it to re render
  const [isOpen, SetIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    count: '',
    email: '',
  });

  const openModal = () => SetIsOpen(true)
  const closeModal = () => SetIsOpen(false)

  useEffect(() => {
    axios.get('http://localhost:5000/reservations')
      .then(response => {
        setReservationsList(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [temp]);

  const Serve = async (reservation) => {
    reservation.status = "Served";
    const config = {
      headers: { Authorization: `Bearer ${token}` }
  };
    axios.put('http://localhost:5000/reservations/update', { ...reservation }, config)
      .then(response => {
        console.log("updated");
        Settemp(!temp);

      })
      .catch(error => {
        console.error('Error updating reservation:', error);
      });


  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let date = new Date();
    formData["start_time"] = date;

    const config = {
      headers: { Authorization: `Bearer ${token}` }
  };
  
    axios.post('http://localhost:5000/reservations/add',formData, config)
      .then(response => {
        Settemp(!temp);
      })
      .catch(error => {
        console.error('Error posting reservation data:', error);
      });
    console.log('Form data submitted:', formData);
    closeModal(); // Close the modal after submission
  };


  return (

    <section class="py-1 bg-blueGray-50">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
        <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
          <div class="rounded-t mb-0 px-4 py-3 border-0">
            <div class="flex flex-wrap items-center">
              {/* <div class="relative w-full px-4 max-w-full flex-grow flex-1"> */}
              <h3 class="relative font-semibold text-base text-blueGray-700">Today's List</h3>
              {/* </div> */}
              <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <button class="add-reservation-button" type="button" onClick={openModal}>Add</button>
              </div>
            </div>
          </div>
          <div className="table-container">

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>People Count</th>
                  <th>Waiting Time</th>
                  <th>Status</th>
                  <th>Entered By</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reservationsList.map(reservation => (
                  <tr key={reservation.id}>
                    <td>{reservation.name}</td>
                    <td>{reservation.count}</td>
                    <td>{reservation.start_time}</td>
                    <td>
                      {reservation.status == "Served" ?
                        <div class="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                          {reservation.status}
                        </div> :
                        <div class="inline px-3 py-1 text-sm font-normal rounded-full text-rose-500 gap-x-2 bg-rose-100/60 dark:bg-gray-800">
                          {reservation.status}
                        </div>}</td>
                    <td>{reservation.entered_by}</td>
                    <td>

                      <button className={reservation.status == "Served" ? "serve-button-disabled" : "serve-button"} disabled={reservation.status == "Served"} onClick={() => Serve(reservation)/* Implement your edit action */}>
                        Serve
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* <!-- Modal --> */}
      <Modal show={isOpen}>
        <Modal.Header closeButton>
          <Modal.Title>Add a reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isOpen}>
        <Modal.Header closeButton>
          <Modal.Title>Add a reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                // placeholder="Enter customer's name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Person Count</Form.Label>
              <Form.Control
                type="text"
                // placeholder="Enter person count"
                name="count"
                value={formData.count}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                // placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </section>
  );
}
export default ReservationsList;