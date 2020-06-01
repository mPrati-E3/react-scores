import React from 'react';
import { OptionalErrorMsg } from "./ExamComponents";

import { Redirect, Link } from 'react-router-dom';

import API from './API';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loginSuccess: false, wrongLoginMsg: false, doingLogin: false };
    }

    doLoginCall = (user, pass) => {
        this.setState({doingLogin: true});
        API.userLogin(user, pass).then( (userObj) => {
            console.log("DEBUG: userObj: "+JSON.stringify(userObj));
            this.setState({loginSuccess: true});       // need to redirect in render
            this.props.setLoggedInUser(userObj.name);  // keep success info in state at App level
        }).catch(
            () => {this.setState({wrongLoginMsg: true, doingLogin: false})}
        );
    }

    cancelLoginErrorMsg = () => {
        this.setState({wrongLoginMsg: false, doingLogin: false});
    }

    render() {        
        if (this.state.loginSuccess) {
            console.log("DEBUG: redirect to / in login component");
            return <Redirect to={{
                pathname: '/',
                // Pass here, in addition to previous setLoggedInUser which calls setState in App,
                // since setState is async and can be delayed
                // This 'state:' is guaranteed to be immediately available to the new Route in props.location.state
                state: { isLoggedIn: true },
            }} />;
        } else
            return <>
                <OptionalErrorMsg errorMsg={this.state.wrongLoginMsg ? 'Wrong username and/or password' : ''}
                    cancelErrorMsg={this.cancelLoginErrorMsg} />
                <LoginForm doLoginCall={this.doLoginCall} doingLogin={this.state.doingLogin} />
            </>;
    }
}


class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        // prefilled user pass fields just for convenience for testing purposes
        this.state = { username: 'u1@p.it', password: 'ppp' };
    }

    updateField = (name, value) => {
        this.setState({ [name]: value });
    }

    doLogin = (event) => {
        event.preventDefault();
        if (this.form.checkValidity()) {
            //this.props.userLogin(this.state.username, this.state.password);
            this.props.doLoginCall(this.state.username, this.state.password);
        } else {
            this.form.reportValidity();
        }
    }

    validateForm = (event) => {
        event.preventDefault();
    }

    render() {
            return <div>
                <form className='form' method={'POST'}
                    onSubmit={this.validateForm} ref={form => this.form = form}>
                    <div className={'form-row'}>
                        <div className={'form-group'}>
                            <label htmlFor='username'>Username</label>
                            <input id='username' className={'form-control'} type='email' required={true}
                                name='username'
                                value={this.state.username}
                                onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}
                            />
                        </div>
                        &nbsp;
                        <div className={'form-group'}>
                            <label htmlFor='password'>Password</label>
                            <input id='password' className={'form-control'} type='password' required={true}
                                name='password'
                                value={this.state.password}
                                onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}
                            />
                        </div>
                    </div>

                    <div className={'form-row'}>
                        <button type='button' className='btn btn-primary' disabled={this.props.doingLogin}
                            onClick={this.doLogin}>Login</button>
                    </div>

                </form>
            </div>
    }
}

function Logout(props) {
    if (props.isLoggedIn) {
        // The onClick will change the isLoggedIn state in App, in addition to calling the API
        return <Link to='/login' className='btn btn-primary'
                            onClick={props.userLogout}>Logout</Link>
    } else
        return null;
}

export { Login, Logout };

