import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { 
  Typography,
  Button,
  Grid,
  FormControl, 
  InputLabel,
  Input,
  FormHelperText } from '@material-ui/core';
import { postRequest } from '../../api/GeneralApi';

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
}));


const Create = (props) => {

  const history = useHistory();

  const classes = useStyles();
  const [ token, setToken ] = useState();
  const [ coinName, setCoinName ] = useState();
  const [ coinBuy, setCoinBuy ] = useState();
  const [ coinBuyError, setCoinBuyError ] = useState();
  const [ coinSale, setCoinSale ] = useState();
  const [ coinSaleError, setCoinSaleError ] = useState();
  const [ coinNameError, setCoinNameError ] = useState();
  
  const [ loadingButton, setLoadingButton ] = useState(false);


  const createCoin = async () => {
    const tokenLocal = await getToken();
    setCoinNameError(null);
    setCoinBuyError();
    setCoinSaleError();
    const data = {
      "coin_name": coinName,
      "created_by": 1,
      "dolar_buys": coinBuy,
      "dolar_sale": coinSale,
    };
    postRequest('/coins/', data, tokenLocal)
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
        console.log(errors);
        if (errors['coin_name']) setCoinNameError(errors['coin_name'][0]);
        if (errors['dolar_buys']) setCoinBuyError(errors['dolar_buys'][0]);
        if (errors['dolar_sale']) setCoinSaleError(errors['dolar_sale'][0]);
        if (errors['error']) alert(errors['error']);
      } else console.log(error.response);
    })
    .then(function () {
      setLoadingButton(false);
    }); 
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
        spacing={1}
      >
        <Grid item>
            <Typography variant="h5" >
            Crear Moneda
            </Typography>
        </Grid>
          <Grid item >
            <FormControl className={classes.title}>
              <InputLabel htmlFor="coin-input">
                Nombre Moneda
              </InputLabel>
              <Input 
                size="small"
                variant="filled"
                id="coin-input" 
                aria-describedby="coin-helper-text" 
                onChange={(e) => setCoinName(e.target.value)}
                error={coinNameError!=null}
              />
              {coinNameError != null && <FormHelperText id="coin-helper-text">{coinNameError}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item >
            <FormControl className={classes.title}>
              <InputLabel htmlFor="coin-sell-input">
                Compra (Dls)
              </InputLabel>
              <Input 
                type="number"
                size="small"
                variant="filled"
                id="coin-sell-input" 
                aria-describedby="coin-sell-helper-text" 
                onChange={(e) => setCoinSale(e.target.value)}
                error={coinSaleError!=null}
                inputProps={{
                  maxLength: 13,
                  step: "0.1",
                  min: "0.001"
                }}
              />
              {coinSaleError != null && <FormHelperText id="coin-sell-helper-text">{coinSaleError}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item >
            <FormControl className={classes.title}>
              <InputLabel htmlFor="coin-buy-input">
                Venta (Dls)
              </InputLabel>
              <Input 
                type="number"
                size="small"
                variant="filled"
                id="coin-buy-input" 
                aria-describedby="coin-buy-helper-text" 
                onChange={(e) => setCoinBuy(e.target.value)}
                error={coinBuyError!=null}
                inputProps={{
                  maxLength: 13,
                  step: "0.1",
                  min: "0.001"
                }}
              />
              {coinBuyError != null && <FormHelperText id="coin-buy-helper-text">{coinBuyError}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              onClick={createCoin} 
              disabled={!coinName || loadingButton || !coinBuy || !coinSale}
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

export default Create;
