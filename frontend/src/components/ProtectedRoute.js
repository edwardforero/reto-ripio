import React from 'react';
import { Redirect } from 'react-router-dom';

const ProtectedRoute = props => {

    const { component: Component } = props;
    return (
        props.user && Component != null
            ? <Component {...props} />
            : <Redirect to={{
                    pathname: '/login',
                }} />
        
    );
}

export default ProtectedRoute;
