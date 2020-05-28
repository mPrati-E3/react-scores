import React from 'react';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        // prefilled user pass fields just for convenience for testing purposes
        this.state = { username: 'u1@p.it', password: 'ppp', buttonEnabled: true };
    }

    updateField = (name, value) => {
        this.setState({ [name]: value });
    }

    doLogin = (event) => {
        event.preventDefault();
        if (this.form.checkValidity()) {
            this.props.userLogin(this.state.username, this.state.password);
        } else {
            this.form.reportValidity();
        }
    }

    doCancel = () => {
        this.props.cancelForm();
    }

    validateForm = (event) => {
        event.preventDefault();
    }

    render() {
        if (this.props.mode === 'login' || this.props.mode === 'loginInProgress') {
            return <div>
                <form className='' method={'POST'}
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
                        <button type='button' className='btn btn-primary' disabled={this.props.mode === 'loginInProgress'}
                            onClick={this.doLogin}>Login</button>
                    </div>

                </form>
            </div>
        } else
            return null;
    }
}

function Logout(props) {
    const modes = ['view', 'add', 'edit'];
    if (modes.includes(props.mode)) {
        return <button type='button' className='btn btn-primary'
                            onClick={props.userLogout}>Logout</button>
    } else
        return null;
}

export { LoginForm, Logout };

