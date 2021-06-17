import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { 
  Typography,
  Button,
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


const Coin = (props) => {

  const history = useHistory();

  const classes = useStyles();
  const [ token, setToken ] = useState();
  const [ coinList, setCoinList ] = useState();

  const columns = [
    // { field: 'id', headerName: 'ID', flex: 1, },
    { field: 'coin_name', headerName: 'Moneda', flex: 2,},
    { field: 'dolar_buys', headerName: 'Compra', flex: 2, },
    { field: 'dolar_sale', headerName: 'Venta', flex: 2, },
  ];

  const getToken = async () => {
    if ( !token ) {
      const tokenLocal = await localStorage.getItem('token');
      setToken(tokenLocal);
      return tokenLocal;
    }
    return token;
  }

  const getCoins = async () => {
    const tokenLocal = await getToken();
    getRequest('/coins/', {}, tokenLocal)
    .then(function (response) {
      const data = response['data'] ? response['data'] : [];
      const finalData = data.map((row) => {
        row['id'] = `${row['id_coin']}`;
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
      getCoins();
      getToken();
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <CustomAppBar user={props.user} />
      <div className={classes.root} >
        <Grid 
          container
          direction="column"
          // spacing={1}
        >
          <Grid 
            item
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography variant="h5" >
                Monedas
            </Typography>
          </Grid>
          { props.user && props.user['is_superuser'] && 
          <Grid 
          item 
          container
          justify="flex-end"
          alignItems="flex-end"
          >
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              onClick={() => history.push('/coins/create')} 
            >
              Crear Moneda
            </Button>
          </Grid>}
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
    </>
  );
}

export default Coin;
