import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";


import { Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: "20%",
  },
  title: {
    marginBottom: 30,
  }
}));



const Logout = (props) => {

  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
      async function deleteSession() {
        await localStorage.clear();
        props.setUser(null);
        history.push('/login');
      }
      deleteSession();
  });

  return (
  <div className={classes.root} >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.gridForm}
      >
        <Typography variant="subtitle1" className={classes.title}>
          Cerrando session
        </Typography>
        
    </Grid>
  </div>
  );
}

export default Logout;
