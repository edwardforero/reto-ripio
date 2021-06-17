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



const Signin = (props) => {

  const history = useHistory();

  const classes = useStyles();
  const [ firstName, setFirstName ] = useState();
  const [ firstNameError, setFirstNameError ] = useState();
  const [ lastName, setLastName ] = useState();
  const [ lastNameError, setLastNameError ] = useState();
  const [ email, setEmail ] = useState(props.email);
  const [ emailError, setEmailError ] = useState();
  const [ password, setPassword ] = useState();
  const [ passwordError, setPasswordError ] = useState();
  const [ repeatPassword, setRepeatPassword ] = useState();
  const [ repeatPasswordError, setRepeatPasswordError ] = useState();
  const [ disabledButton, setDisabledButton ] = useState(true);
  const [ loadingButton, setLoadingButton ] = useState(false);


  const signinUser = () => {
    setEmailError(null);
    setPasswordError(null);
    setRepeatPasswordError(null);
    setFirstNameError(null);
    setLastNameError(null);
    setLoadingButton(true);
    const data = {
      'first_name': firstName, 
      'last_name': lastName,
      'is_superuser': true,
      email, 
      password
    };
    postRequest('/users/', data)
    .then(function (response) {
      if ( response['data'] ) {
        alert(response['data']['message']);
        history.push('/login');
      } else {
        console.log(response);
        alert('Ocurrio un error registrando al usuario.')
      }
    })
    .catch(function (error) {
      const errors = error.response && error.response.data 
        ? error.response.data 
        : null;
      if ( errors ) {
        console.log(errors);
        if (errors['email']) setEmailError(errors['email'][0]);
        if (errors['password']) setPasswordError(errors['password'][0]);
        if (errors['first_name']) setFirstNameError(errors['first_name'][0]);
        if (errors['last_name']) setLastNameError(errors['last_name'][0]);
        if (errors['error']) alert(errors['error']);
      } else console.log(error.response);
    })
    .then(function () {
      setLoadingButton(false);
    }); 
  }

  useEffect(() => {
    if ( props.user ) history.push('/');
  }); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const emailValid = email && email.length > 3 && /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
    const passValid = password && password.length >= 6;
    var repeatPassValid = repeatPassword && repeatPassword.length >= 6;
    if( passValid && repeatPassValid && password !== repeatPassword ) {
      setPasswordError('No coinciden.');
      setRepeatPasswordError('No coinciden.');
    }
    const disabled = !emailValid || !passValid || !repeatPassword || password !== repeatPassword;
    if(disabled !== disabledButton ) setDisabledButton(disabled);
  }, [email, password, repeatPassword]); // eslint-disable-line react-hooks/exhaustive-deps

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
          Registrarse
        </Typography>
        <FormControl className={classes.title}>
          <InputLabel htmlFor="first-input">
            Nombre
          </InputLabel>
          <Input 
            variant="filled"
            id="first-input" 
            aria-describedby="first-helper-text" 
            onChange={(e) => setFirstName(e.target.value)}
            error={firstNameError!=null}
          />
          {firstNameError != null && <FormHelperText id="first-helper-text">{firstNameError}</FormHelperText>}
        </FormControl>
        <FormControl className={classes.title}>
          <InputLabel htmlFor="last-input">
            Apellidos
          </InputLabel>
          <Input 
            variant="filled"
            id="last-input" 
            aria-describedby="last-helper-text" 
            onChange={(e) => setLastName(e.target.value)}
            error={lastNameError!=null}
          />
          {lastNameError != null && <FormHelperText id="last-helper-text">{lastNameError}</FormHelperText>}
        </FormControl>
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
        <FormControl className={classes.title}>
          <InputLabel htmlFor="repeat-password-input">
            Repetir Password
          </InputLabel>
          <Input 
            variant="filled"
            id="repeat-password-input" 
            type="password"
            aria-describedby="repeat-password-helper-text" 
            onChange={(e) => setRepeatPassword(e.target.value)}
            error={repeatPasswordError!=null}
          />
          {repeatPasswordError != null && <FormHelperText id="repeat-password-helper-text">{repeatPasswordError}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid  alignItems="center"  justify="flex-end" container >
        <Button variant="contained" color="primary" onClick={signinUser} disabled={disabledButton || loadingButton}>
          { loadingButton ? "Registrando..." : "Registrar" }
        </Button>
      </Grid>
      <Grid  alignItems="center"  justify="center" container >
        <p><Link to='/login'>Ingresar</Link></p>
      </Grid>
    </Paper>
  </div>
  );
}

export default Signin;
