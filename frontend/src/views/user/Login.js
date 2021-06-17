import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";


import { 
  Button,
  Typography,
  Paper,
  Grid,
  FormControl, 
  InputLabel,
  Input,
  FormHelperText } from '@material-ui/core';
import { postRequest } from '../../api/GeneralApi';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: "20%",
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 300,
  },
  title: {
    marginBottom: 30,
  }
}));



const Login = (props) => {

  const history = useHistory();
  const classes = useStyles();
  const [ email, setEmail ] = useState();
  const [ emailError, setEmailError ] = useState();
  const [ password, setPassword ] = useState();
  const [ passwordError, setPasswordError ] = useState();
  const [ disabledButton, setDisabledButton ] = useState(true);
  const [ loadingButton, setLoadingButton ] = useState(false);


  const loginUser = () => {
    setEmailError(null);
    setPasswordError(null);
    setLoadingButton(true);
    postRequest('/users/login', {email, password})
    .then(function (response) {
      console.log(response['data'])
      if ( response['data'] && response['data']['user'] ) {
        const token = response['data']['token'];
        const user = response['data']['user'];
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        props.setUser(user);
        history.push('/coins');
      } else {
        console.log(response);
        alert('Ocurrio un error logueando al usuario.')
      }
    })
    .catch(function (error) {
      const errors = error.response && error.response.data 
        ? error.response.data 
        : null;
      if ( errors ) {
        if (errors['email']) setEmailError(errors['email'][0]);
        if (errors['password']) setPasswordError(errors['password'][0]);
        if (errors['error']) alert(errors['error'])
      } else console.log(error);
    })
    .then(function () {
      setLoadingButton(false);
    }); 
  }

  useEffect(() => {
    if ( props.user ) history.push('/coins');
  }); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const emailValid = email && email.length > 3 && /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
    const passValid = password && password.length >= 6;
    const disabled = !emailValid || !passValid;
    if(disabled !== disabledButton ) setDisabledButton(disabled);
  }, [email, password]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
  <div className={classes.root} >
    <Paper className={classes.paper}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.gridForm}
      >
        <Typography variant="subtitle1" className={classes.title}>
          Ingresa a tu cuenta
        </Typography>
        <FormControl className={classes.title}>
          <InputLabel htmlFor="email-input">
            Email
          </InputLabel>
          <Input 
            variant="filled"
            id="email-input" 
            aria-describedby="email-helper-text" 
            onChange={(e) => setEmail(e.target.value)}
            error={emailError!=null}
          />
          {emailError != null && <FormHelperText id="email-helper-text">{emailError}</FormHelperText>}
        </FormControl>
        <FormControl className={classes.title}>
          <InputLabel htmlFor="password-input">
            Password
          </InputLabel>
          <Input 
            variant="filled"
            id="password-input" 
            type="password"
            aria-describedby="password-helper-text" 
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError!=null}
          />
          {passwordError != null && <FormHelperText id="password-helper-text">{passwordError}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid  alignItems="center"  justify="flex-end" container >
        <Button variant="contained" color="primary" onClick={() => loginUser()} disabled={disabledButton || loadingButton}>
          { loadingButton ? "Ingresando..." : "Ingresar" }
        </Button>
      </Grid>
      <Grid  alignItems="center"  justify="center" container >
        <p><Link to='/signin'>Registrarse</Link></p>
      </Grid>
    </Paper>
  </div>
  );
}

export default Login;
