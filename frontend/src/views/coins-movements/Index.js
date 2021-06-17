import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Grid } from '@material-ui/core';
import { createMuiTheme, darken, lighten } from '@material-ui/core/styles';
import { DataGrid, getThemePaletteMode } from '@material-ui/data-grid';
import { getRequest } from '../../api/GeneralApi';

import CustomAppBar from '../../components/CustomAppbar'

const defaultTheme = createMuiTheme();
const useStyles = makeStyles(
  
  (theme) => {
    const getBackgroundColor = (color) =>
    getThemePaletteMode(theme.palette) === 'dark'
      ? darken(color, 0.6)
      : lighten(color, 0.6);

  const getHoverBackgroundColor = (color) =>
    getThemePaletteMode(theme.palette) === 'dark'
      ? darken(color, 0.5)
      : lighten(color, 0.5);
    return {
      root: {
        flexGrow: 1,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        '& .greenRow': {
          backgroundColor: getBackgroundColor(theme.palette.success.main),
          '&:hover': {
            backgroundColor: getHoverBackgroundColor(theme.palette.success.main),
          },
        },
        '& .redRow': {
          backgroundColor: getBackgroundColor(theme.palette.error.main),
          '&:hover': {
            backgroundColor: getHoverBackgroundColor(theme.palette.error.main),
          },
        },
      },
    };
  },
  { defaultTheme },
);


const Movement = (props) => {

  const history = useHistory();

  const classes = useStyles();
  const [ token, setToken ] = useState();
  const [ moneyDetail, setMoneyDetail ] = useState('');
  const [ myCoinList, setMyCoinList ] = useState([]);
  const [ coinSelected, setCoinSelected ] = useState('');
  const [ coinList, setCoinList ] = useState();

  const columns = [
    // { field: 'id', headerName: 'ID', flex: 1, },
    { field: 'type', headerName: 'Operacion', flex: 3,},
    { field: 'detail_movement', headerName: 'Detalle', flex: 3, },
    { field: 'amount', headerName: 'Monto', flex: 2, },
    { field: 'to', headerName: 'Destinatario', flex: 2, },
    { field: 'timestamp_created', headerName: 'Fecha', flex: 2, },
  ];

  const getToken = async () => {
    if ( !token ) {
      const tokenLocal = await localStorage.getItem('token');
      setToken(tokenLocal);
      return tokenLocal;
    }
    return token;
  }

  const getMovements = async () => {
    const tokenLocal = await getToken();
    const idCoin = myCoinList[coinSelected]['coin']['id_coin'];
    getRequest('/users-coins/movements', {'id_coin': idCoin}, tokenLocal)
    .then(function (response) {
      console.log(response['data'] );
      const data = response['data'] ? response['data'] : [];
      const finalData = data.map((row) => {
        row['id'] = `${row['id_user_coin_movements']}`;
        row['type'] = !row['user_to'] || row['user_to']['email'] === row['user']['email']
                      ? "Recarga de saldo"
                      : "Regalo";
        row['class'] = row['type'] === 'Regalo' ? 'redRow' : 'greenRow';
        row['to'] = row['type'] === "Regalo" ? row['user_to']['email'] : '';
        return row;
      });
      setCoinList(finalData);
    })
    .catch(function (error) {
      console.log(error);
      alert('Ocurrio un error leyendo la data de monedas.')
    }); 
  }

  const getMyCoins = async () => {
    const tokenLocal = await getToken();
    console.log(tokenLocal);
    getRequest('/users-coins/', {}, tokenLocal)
    .then(function (response) {
      console.log(response['data'] );
      const data = response['data'] ? response['data'] : [];
      setMyCoinList(data);
    })
    .catch(function (error) {
      alert('Ocurrio un error leyendo la data de monedas.')
    }); 
  }

  const selectCoin = (e) => {
    const c = myCoinList[e];
    if( c ) {
      setCoinSelected(e);
      setMoneyDetail(`
        De la moneda ${c['coin']['coin_name']} 
        tienes: ${c['amount']}.`);
    } else {
      setMoneyDetail('');
      setCoinSelected('');
    }
    setCoinList();
  }

  useEffect(() => {
    if ( !props.user ) history.push('/');
      getMyCoins();
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
          alignItems="center"
          // spacing={1}
        >
          <Grid item>
            <Typography variant="h5" className={classes.title}>
              Consulta de movimientos
            </Typography>
          </Grid>
          <Grid 
            item 
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
            className={classes.gridForm}
            spacing={2}
          
          >
            <Grid item>
              <FormControl >
                <InputLabel id="demo-simple-select-label">Mis Monedas</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  // variant="filled"
                  // size="small"
                  value={coinSelected}
                  style={{minWidth: 150}}
                  onChange={(e) => selectCoin(e.target.value)}
                >
                  {myCoinList.map((coin, i) =>{
                    return (<MenuItem  key={`${i}`} value={i}>
                      Moneda {coin['coin']['coin_name']}
                    </MenuItem>)
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                disabled={  coinSelected === '' || coinList}
                onClick={() => getMovements()} 
              >
                Consultar
              </Button>
            </Grid>
                  
          </Grid>

          <Grid 
            item
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            className={classes.gridForm}
          >
              <Typography variant="subtitle1" className={classes.title}>
              {moneyDetail}
              </Typography>
          </Grid>
        </Grid>
          <div className={classes.root} >
            <div style={{ height: 500, margin: "auto", padding: "2%" }}>
              {coinList && <DataGrid 
                rowHeight={25} 
                rows={coinList} 
                columns={columns} 
                pagination 
                getRowClassName={(params) =>
                  `${params.getValue(params.id, 'class')}`
                }
              />}
            </div>
          </div>
      </div>
    </>
  );
}

export default Movement;
