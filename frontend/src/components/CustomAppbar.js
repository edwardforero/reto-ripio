import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { 
    AppBar,
    Button,
    Grid,
    IconButton,
    Toolbar,
    Typography,
    MenuItem,
    Menu,
    Hidden,
} from "@material-ui/core";


// icons
import MenuIcon from '@material-ui/icons/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const useStyles = makeStyles(theme => ({
    items: {
      marginRight: "20px",
    },
  }));

export default function CustomAppBar(props) {
    const history = useHistory();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);


    const appBarOptions = [{
        onAppBar: true,
        onMenu: true,
        title: "Monedas",
        variant: "text",
        hidden: { xsDown: true, },
        classes: classes.items,
        url: '/coins',
        loginStatus: true,
    },{
        onAppBar: false,
        onMenu: true,
        admin: true,
        title: "Crear Moneda",
        variant: "text",
        hidden: { xsDown: true, },
        classes: classes.items,
        url: '/coins/create',
        loginStatus: true,
    }, {
        onAppBar: true,
        onMenu: true,
        title: "Mi Saldo",
        variant: "text",
        hidden: { xsDown: true, },
        classes: classes.items,
        url: '/coins-movements',
    }, {
        onAppBar: false,
        onMenu: true,
        admin: true,
        title: "Saldo de usuarios",
        variant: "text",
        hidden: { xsDown: true, },
        classes: classes.items,
        url: '/coins-users',
    }, {
        onAppBar: false,
        onMenu: true,
        title: "Comprar Saldo",
        variant: "text",
        hidden: { xsDown: true, },
        classes: classes.items,
        url: '/coins-movements/buy',
    }, {
        onAppBar: false,
        onMenu: true,
        title: "Regalar Saldo",
        variant: "text",
        hidden: { xsDown: true, },
        classes: classes.items,
        url: '/coins-movements/gift',
    }, {
        onAppBar: false,
        onMenu: true,
        title: "Salir",
        icon: <ExitToAppIcon/>,
        variant: "text",
        hidden: { xsDown: true, },
        classes: classes.items,
        url: '/logout',
        loginStatus: true,
    }];

    const handleMenu = (event) => setAnchorEl(event.currentTarget);

    const handleClose = () => {
        setAnchorEl(null);
    };


  return (
    <AppBar 
        position="static"
        style={{ boxShadow: 'none'}}
    >
      <Toolbar
        variant="dense"
      >
        <Grid
            container
            direction="column"
            spacing={1}
        >
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <Grid container item xs={6} sm={4} justify="flex-start">
                    <Typography variant="h6" >
                        Hola! {props.user ? `${props.user['first_name']} ${props.user['last_name']}` : ''}
                    </Typography>
                </Grid>
                <Grid container item xs={6} sm={8} direction="row" justify="flex-end">
                    {appBarOptions.map((item, i) => {
                        if ( item.onAppBar && (!item.admin || props.user.is_superuser)) {
                            return (<Hidden key={i} {...item.hidden}>
                                <Button 
                                    className={item.classes}
                                    variant={item.variant}
                                    size="small"
                                    startIcon={item.icon}
                                    onClick={() => {if (item.url) history.push(item.url);} }
                                >
                                    {item.title}
                                </Button>
                            </Hidden>)
                        } else return (<React.Fragment key={i}></React.Fragment>)
                    })}
                    <IconButton 
                        aria-controls={ 'menu-appbar'}
                        aria-haspopup="true"
                        onClick={handleMenu}
                        size="medium"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {appBarOptions.map((item, i) => {

                            if ( item.onMenu && (!item.admin || props.user.is_superuser) ) {
                                return (<MenuItem 
                                    key={i}
                                    onClick={() => {
                                        handleClose(); 
                                        if (item.url) history.push(item.url);
                                    }}
                                >
                                    {/* <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon> */}
                                    <Typography variant="inherit" noWrap>
                                        {item.title}
                                    </Typography>
                                </MenuItem>);
                            } else return (<MenuItem key={i} style={{display: "none"}}/>)
                        })}
                    </Menu>
                </Grid>
            </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
