import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { 
  Select,
  MenuItem,
  Typography,
  Button,
  Grid,
  FormControl, 
  InputLabel,
  Input,
  FormHelperText } from '@material-ui/core';
import { postRequest, getRequest } from '../../api/GeneralApi';

import CustomAppBar from '../../components/CustomAppbar'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 300,
  },
  title: {
    margin: theme.spacing(1),
    minWidth: 450,
  },
  gridForm: {
    padding: "20px",
  },
}));


const Buy = (props) => {

  const history = useHistory();

  const classes = useStyles();
  const [ token, setToken ] = useState();
  const [ coinAmount, setCoinAmount ] = useState();
  const [ coinAmountError, setCoinAmountError ] = useState();
  const [ coinConcept, setCoinConcept ] = useState();
  const [ coinConceptError, setCoinConceptError ] = useState();
  const [ coinSelected, setCoinSelected ] = useState('');
  const [ coinList, setCoinList ] = useState([]);
  
  const [ loadingButton, setLoadingButton ] = useState(false);


  const createCoinMovement = async () => {
    const tokenLocal = await getToken();
    setCoinConceptError(null);
    setCoinAmountError();
    const data = {
      "id_coin": coinList[coinSelected]['id_coin'],
      "amount": coinAmount,
      "detail_movement": coinConcept,
    };
    postRequest('/users-coins/movements', data, tokenLocal)
    .then(function (response) {
      if ( response['data'] ) {
        alert(response['data']['message']);
      } else {
        console.log(response);
        alert('Ocurrio un error creando la moneda.')
      }
    })
    .catch(function (error) {
      const errors = error.response && error.response.data 
        ? error.response.data 
        : null;
      if ( errors ) {
        if (errors['detail_movement']) setCoinConceptError(errors['detail_movement'][0]);
        if (errors['amount']) setCoinAmountError(errors['amount'][0]);
        if (errors['error']) alert(errors['error']);
      } else console.log(error.response);
    })
    .then(function () {
      setLoadingButton(false);
    }); 
  }

  const getCoins = async () => {
    const tokenLocal = await getToken();
    getRequest('/coins/', {}, tokenLocal)
    .then(function (response) {
      console.log(response['data'] );
      const data = response['data'] ? response['data'] : [];
      setCoinList(data);
    })
    .catch(function (error) {
      console.log(error);
      alert('Ocurrio un error leyendo la data de monedas.')
    }); 
  }

  const selectCoin = (e) => {
    const c = coinList[e];
    if( c ) {
      setCoinSelected(e);
    } else {
      // setMoneyDetail('');
      setCoinSelected('');
    }
    // setCoinList();
  }

  const getToken = async () => {
    if ( !token ) {
      const tokenLocal = await localStorage.getItem('token');
      setToken(tokenLocal);
      return tokenLocal;
    }
    return token;
  }

  useEffect(() => {
    if ( !props.user ) history.push('/');
    getToken();
    getCoins();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
  <>
  <CustomAppBar user={props.user} />
  <div className={classes.root} >
    { props.user && props.user.is_superuser ?
    <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.gridForm}
      >
        <Grid 
          item
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Typography variant="h5" >
              Regalar Saldo
          </Typography>
        </Grid>
        <Grid item>
          <FormControl className={classes.title}>
            <InputLabel id="demo-simple-select-label">Monedas</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              // variant="filled"
              // size="small"
              value={coinSelected}
              style={{width: "100%"}}
              onChange={(e) => selectCoin(e.target.value)}
            >
              {coinList.map((coin, i) =>{
                return (<MenuItem  key={`${i}`} value={i}>
                  Moneda {coin['coin_name']}
                </MenuItem>)
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item >
          <FormControl className={classes.title}>
            <InputLabel htmlFor="coin-input">
              Concepto
            </InputLabel>
            <Input 
              size="small"
              variant="filled"
              id="coin-input" 
              aria-describedby="coin-helper-text" 
              onChange={(e) => setCoinConcept(e.target.value)}
              error={coinConceptError!=null}
            />
            {coinConceptError != null && <FormHelperText id="coin-helper-text">{coinConceptError}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item >
          <FormControl className={classes.title}>
            <InputLabel htmlFor="coin-amount-input">
              Monto
            </InputLabel>
            <Input 
              type="number"
              size="small"
              variant="filled"
              id="coin-amount-input" 
              aria-describedby="coin-amount-helper-text" 
              onChange={(e) => setCoinAmount(e.target.value)}
              error={coinAmountError!=null}
              inputProps={{
                maxLength: 13,
                step: "0.1",
                min: "0.001"
              }}
            />
            {coinAmountError != null && <FormHelperText id="coin-amount-helper-text">{coinAmountError}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item style={{marginTop: 20}}>
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            onClick={createCoinMovement} 
            disabled={coinSelected === '' || !coinConcept || loadingButton || !coinAmount}
          >
            { loadingButton ? "Creando..." : "Crear" }
          </Button>
          
        </Grid>
      </Grid>
      :
      <label>Acceso restringigo</label>
    }
  </div>
  </>
  );
}

export default Buy;
