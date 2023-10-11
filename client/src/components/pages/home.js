

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import ReactFlexyTable from "react-flexy-table"
// import "react-flexy-table/dist/index.css"
// import Card from "react-bootstrap/Card"
import { Modal, Button, Form, Table, Tab } from "react-bootstrap"
// import "bootstrap/dist/css/bootstrap.css";
// import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// import BootstrapTable from "react-bootstrap-table-next";
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import Nav from 'react-bootstrap/Nav';

const ReservationsList = () => {
  const token = localStorage.getItem("token")
  // console.log("Token: "+token)
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))

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
        toast.error('Error: ' + error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      });
  }, [temp]);

  const Serve = async (reservation) => {
    reservation.status = "Served";
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    axios.put('http://localhost:5000/reservations/update', { ...reservation }, config)
      .then(response => {
        toast.info('Reservation updated!', {
          position: toast.POSITION.TOP_RIGHT
        });
        console.log("updated");
        Settemp(!temp);

      })
      .catch(error => {
        console.error('Error updating reservation:', error);
        toast.error('Error: ' + error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      });


  };

  const getWaiting =  () => {
    console.log("ASD")
    let newList = []
    reservationsList.forEach(item => {
      if (item["status"]=="Entered"){
        newList.push(item);
      }
    });

    setReservationsList(newList);

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let date = moment().format('MMMM Do YYYY, h:mm:ss a');
    formData["start_time"] = date;

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    axios.post('http://localhost:5000/reservations/add', formData, config)
      .then(response => {
        Settemp(!temp);
        toast.info('Added a reservation!', {
          position: toast.POSITION.TOP_RIGHT
        });
      })
      .catch(error => {
        console.error('Error posting reservation data:', error);
        toast.error('Error: ' + error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      });
    console.log('Form data submitted:', formData);
    closeModal(); // Close the modal after submission
  };


  return (

    <section class="py-1 bg-blueGray-50">

      <h1>{loggedInUser["name"].split(" ")[1]}'s Restaurant</h1>
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
        <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
          <div class="rounded-t mb-0 px-4 py-3 border-0">
            <div class="flex flex-wrap items-center">
              {/* <div class="relative w-full px-4 max-w-full flex-grow flex-1"> */}
              {/* <h3 class="relative font-semibold text-base text-blueGray-700">Today's List</h3> */}
              {/* </div> */}
              <Nav variant="tabs" defaultActiveKey="/home">
                <Nav.Item>
                  <Nav.Link href="/home">All</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-1" onClick={() => getWaiting()} >Waiting</Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                  
                  {/* <Nav.Link eventKey="disabled" disabled>
                    Disabled
                  </Nav.Link> */}
                {/* </Nav.Item> */} 
              </Nav>
              <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <button class="add-reservation-button" type="button" onClick={openModal}>Add</button>
              </div>
            </div>
          </div>
          <div className="table-container">

            <Table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>People Count</th>
                  <th>Created At</th>
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
            </Table>
          </div>
        </div>
      </div>

      {/* <!-- Modal --> */}
      {/* <Modal show={isOpen}>
        <Modal.Header closeButton>
          <Modal.Title>Add a reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal> */}

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
      <ToastContainer />

    </section>
  );
}
export default ReservationsList;