import React from 'react';
import { Redirect } from 'react-router-dom';

const UnProtectedRoute = props => {

    const { component: Component } = props;
    return (
        !props.user && Component != null
            ? <Component {...props} />
            : <Redirect to={{
                    pathname: '/coins',
                }} />
        
    );
}

export default UnProtectedRoute;
