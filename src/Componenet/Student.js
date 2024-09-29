import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Typography, Paper } from '@mui/material';
import { useState, useEffect } from 'react';

export default function Student() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [students, setStudents] = useState([]);
  
  // Validation state
  const [nameError, setNameError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to fetch the updated list of students
  const fetchStudents = () => {
    fetch("http://localhost:8080/student/getAll")
      .then(res => res.json())
      .then((result) => {
        setStudents(result);
      });
  };

  // Handle form submission
  const handleClick = (e) => {
    e.preventDefault();

    // Perform validation
    if (name.trim() === '') {
      setNameError(true);
      setErrorMessage('Name is required');
      return;
    } else {
      setNameError(false);
    }

    if (address.trim() === '') {
      setAddressError(true);
      setErrorMessage('Address is required');
      return;
    } else {
      setAddressError(false);
    }

    // Clear error messages if validation passes
    setErrorMessage('');

    const student = { name, address };
    console.log(student);

    // Submit the student data
    fetch("http://localhost:8080/student/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    }).then(() => {
      console.log("New Student added");
      
      // Fetch updated student list after adding new student
      fetchStudents();

      // Optionally reset fields after successful submission
      setName('');
      setAddress('');
    });
  };

  useEffect(() => {
    // Fetch students on initial load
    fetchStudents();
  }, []);

  return (
    <Box
      component="form"
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        '& > *': { marginBottom: 2, width: '100%' } 
      }}
      noValidate
      autoComplete="off"
    >
      <Paper sx={{ padding: '30px', width: '600px', margin: '20px auto' }} elevation={3}>
        <Typography variant="h4" sx={{ color: 'blue', textAlign: 'center', marginBottom: 2 }}>
          Add Student
        </Typography>

        {/* Name TextField with validation */}
        <TextField
          id="outlined-basic"
          label="Student Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim() !== '') {
              setNameError(false);
            }
          }}
          error={nameError}
          helperText={nameError ? "Name is required" : ""}
        />

        {/* Address TextField with validation */}
        <TextField
          id="outlined-basic"
          label="Student Address"
          variant="outlined"
          fullWidth
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (e.target.value.trim() !== '') {
              setAddressError(false);
            }
          }}
          error={addressError}
          helperText={addressError ? "Address is required" : ""}
        />

        {/* Show error message if validation fails */}
        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
            {errorMessage}
          </Typography>
        )}

        {/* Submit button */}
        <Button 
          variant="contained" 
          color="secondary" 
          sx={{ marginTop: 2 }} 
          onClick={handleClick}
          disabled={nameError || addressError}
        >
          Submit
        </Button>
      </Paper>

      <Typography variant="h5" sx={{ marginTop: 3 }}>
        Students
      </Typography>

      {/* Display the list of students */}
      <Paper sx={{ padding: '20px', width: '600px', margin: '20px auto' }} elevation={3}>
        {students.map((student) => (
          <Paper
            key={student.id}
            elevation={6}
            sx={{ padding: 2, margin: 1, textAlign: 'left' }}
          >
            <Typography variant="body1">
              <strong>Id:</strong> {student.id}
            </Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {student.name}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {student.address}
            </Typography>
          </Paper>
        ))}
      </Paper>
    </Box>
  );
}


