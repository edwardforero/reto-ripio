import React, {useState, useEffect} from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import ProtectedRoute from '../components/ProtectedRoute';
import UnProtectedRoute from '../components/UnProtectedRoute';

import Login from '../views/user/Login';
import Signin from '../views/user/Signin';
import Logout from '../views/user/Logout';

import CoinsUsers from '../views/coins-users/Index';

import Coins from '../views/coins/Index';
import CoinsCreate from '../views/coins/Create';

import CoinsMovements from '../views/coins-movements/Index';
import CoinsMovementsBuy from '../views/coins-movements/Buy';
import CoinsMovementsGift from '../views/coins-movements/Gift';



const Router = (props) => {
    
    const [loading, setLoading] = useState(true);
    useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
        const validateToken = async () => {
            const user = await localStorage.getItem('user');
            console.log('en routers', JSON.parse(user));
            props.setUser(JSON.parse(user));
            setLoading(false);
        }
        validateToken();
        return () => {};
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    loading ?
        <label>Cargando...</label>
        :
        <BrowserRouter>
            <Switch>
                <Route  path="/" exact>
                    <Redirect to='/coins' />
                </Route>

                <Route path="/coins/create" exact {...props} >
                    <ProtectedRoute {...props} component={CoinsCreate}/>
                </Route>
                <Route path="/coins" exact {...props} >
                    <ProtectedRoute {...props} component={Coins}/>
                </Route>

                <Route path="/coins-users" exact {...props} >
                    <ProtectedRoute {...props} component={CoinsUsers}/>
                </Route>

                <Route path="/coins-movements/buy" exact {...props} >
                    <ProtectedRoute {...props} component={CoinsMovementsBuy}/>
                </Route>

                <Route path="/coins-movements/gift" exact {...props} >
                    <ProtectedRoute {...props} component={CoinsMovementsGift}/>
                </Route>
                <Route path="/coins-movements" exact {...props} >
                    <ProtectedRoute {...props} component={CoinsMovements}/>
                </Route>
                
                <Route path="/login" exact {...props} >
                    <UnProtectedRoute {...props} component={Login}/>
                </Route>
                <Route path="/signin" exact >
                    <UnProtectedRoute {...props} component={Signin}/>
                </Route>
                <Route path="/logout" exact >
                    <ProtectedRoute {...props} component={Logout}/>
                </Route>
                <Route >
                    <Login {...props} />
                </Route>
            </Switch>
        </BrowserRouter>
  );
}

export default Router;