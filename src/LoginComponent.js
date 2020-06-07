import React, { useState, useRef } from 'react';
import { OptionalErrorMsg } from "./ExamComponents";

import { Redirect, Link } from 'react-router-dom';

import API from './API';

function Login(props) {

    const [loginSuccess, setLoginSuccess] = useState(false);
    const [waitingLogin, setWaitingLogin] = useState(false);
    const [wrongLoginMsg, setWrongLoginMsg] = useState(false);

    const doLoginCall = (user, pass) => {
        setWaitingLogin(true);
        API.userLogin(user, pass).then( (userObj) => {
            setWaitingLogin(false);
            setLoginSuccess(true);   // set state to redirect in render

            // Do this as the last operation
            // since it will cause the component to be unmounted (not rendered anymore in App)
            // otherwise, other set state methods will give a warning (component unmounted)
            props.setLoggedInUser(userObj.name);  // keep success info in state at App level
        }).catch(
            () => {
                setWrongLoginMsg(true);
                setWaitingLogin(false);
            }
        );
    }

    const cancelLoginErrorMsg = () => {
        setWrongLoginMsg(false);
    }

    if (loginSuccess) {
        return <Redirect to={{
            pathname: '/',
            // Pass here, in addition to previous setLoggedInUser which calls setState in App,
            // since setState is async and can be delayed
            // This 'state:' is guaranteed to be immediately available to the new Route in props.location.state
            state: { isLoggedIn: true },
        }} />;
    } else
        return <>
            <OptionalErrorMsg errorMsg={wrongLoginMsg ? 'Wrong username and/or password' : ''}
                cancelErrorMsg={cancelLoginErrorMsg} />
            <LoginForm doLoginCall={doLoginCall} waitingLogin={waitingLogin} />
        </>;
}


function LoginForm(props) {
    // prefilled user pass fields just for convenience for testing purposes
    const [username, setUsername] = useState('u1@p.it');
    const [password, setPassword] = useState('ppp');
    const formRef = useRef();
    
    const updateUsernameField = (value) => {
        setUsername(value);
    }

    const updatePasswordField = (value) => {
        setPassword(value);
    }

    const doLogin = (event) => {
        event.preventDefault();
        if (formRef.current.checkValidity()) {
            props.doLoginCall(username, password);
        } else {
            formRef.current.reportValidity();
        }
    }

    const validateForm = (event) => {
        event.preventDefault();
    }

    return <div>
        <form className='form' method={'POST'}
            onSubmit={validateForm} ref={formRef}>
            <div className={'form-row'}>
                <div className={'form-group'}>
                    <label htmlFor='username'>Username</label>
                    <input id='username' className={'form-control'} type='email' required={true}
                        name='username'
                        value={username}
                        onChange={(ev) => updateUsernameField(ev.target.value)}
                    />
                </div>
                &nbsp;
                <div className={'form-group'}>
                    <label htmlFor='password'>Password</label>
                    <input id='password' className={'form-control'} type='password' required={true}
                        name='password'
                        value={password}
                        onChange={(ev) => updatePasswordField(ev.target.value)}
                    />
                </div>
            </div>

            <div className={'form-row'}>
                <button type='button' className='btn btn-primary' disabled={props.waitingLogin}
                    onClick={doLogin}>Login</button>
            </div>

        </form>
    </div>;

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

