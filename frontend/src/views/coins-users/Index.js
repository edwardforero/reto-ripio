import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { 
  Typography,
  Grid } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { getRequest } from '../../api/GeneralApi';

import CustomAppBar from '../../components/CustomAppbar'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
}));


const CoinUser = (props) => {

  const history = useHistory();

  const classes = useStyles();
  const [ token, setToken ] = useState();
  const [ coinList, setCoinList ] = useState();

  const columns = [
    { field: 'coin_name', headerName: 'Moneda', flex: 2,},
    { field: 'user_name', headerName: 'usuario', flex: 2, },
    { field: 'email', headerName: 'Correo', flex: 2, },
    { field: 'amount', headerName: 'Cantidad', flex: 2, },
  ];

  const getToken = async () => {
    if ( !token ) {
      const tokenLocal = await localStorage.getItem('token');
      setToken(tokenLocal);
      return tokenLocal;
    }
    return token;
  }

  const getUsersCoins = async () => {
    const tokenLocal = await getToken();
    getRequest('/users-coins/', {'all': true}, tokenLocal)
    .then(function (response) {
      const data = response['data'] ? response['data'] : [];
      console.log(data)
      const finalData = data.map((row) => {
        row['id'] = `${row['coin']['id_coin']}-${row['user']['email']}`;
        row['coin_name'] = row['coin']['coin_name'];
        row['email'] = row['user']['email'];
        row['user_name'] = `${row['user']['first_name']} ${row['user']['last_name']}`;
        return row;
      });
      setCoinList(finalData);
    })
    .catch(function (error) {
      alert('Ocurrio un error leyendo la data de monedas.')
    }); 
  }

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    if ( !props.user ) history.push('/');
      getUsersCoins();
      getToken();
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <CustomAppBar user={props.user} />
      { props.user && props.user['is_superuser'] ?
        <div className={classes.root} >
          <Grid 
            container
            direction="column"
          >
            <>
            <Grid 
              item
              container
              justify="center"
              alignItems="center"
            >
              <Typography variant="h5" className={classes.title}>
                Resumen de usuarios
              </Typography>
            </Grid>
            </>
            <div className={classes.root} >
              <div style={{ height: 500, margin: "auto", padding: "2%" }}>
                {coinList && <DataGrid 
                  rowHeight={25} 
                  rows={coinList} 
                  columns={columns} 
                  pagination 
                />}
              </div>
            </div>
          </Grid>
        </div>
      :
      <label>Acceso restringigo</label>
      }
    </>
  );
}

export default CoinUser;
