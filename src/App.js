import React from 'react';
import AppTitle from "./AppTitle";
import { ExamScores, ExamForm, OptionalErrorMsg, Loading } from "./ExamComponents";
import { Login, Logout } from "./LoginComponent";
import API from './API';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

/*
const MyPrivateRoute = ({ isLoggedIn, ...props }) =>
  isLoggedIn
    ? <Route { ...props } />
    : <Redirect to="/login" />
*/

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = { exams: [], courses: [], 
            isLoggedIn: false, // User is authenticated
            loading: true,     // Need to start with loading: true to check if user already is logged in
            errorMsg: '',      // Error message received by an API call
            loginError: false, // Need to display that login action failed
            user: '',          // Name of user to display when authenticated
            csrfToken: null 
        };
    }

    componentDidMount() {
        // NB: This is required only if you want to recognize that a user is already logged in when
        // reloading the application in the browser or by manually setting a URL in the browser URL bar
        // To remove it, remember to se the initial state loading:false

        // Attempt to load user info as if the user were authenticated, to determine:
        // - if the authorization token is present (since cookie is not directly accessible)
        // - if the token is present, if it is still valid
        // - if it is valid, re-init user, exams, courses, csrfToken
        if (!this.state.isLoggedIn) {
            API.getUserInfo().then( (userInfo) => { 
                this.setState({isLoggedIn: true, user: userInfo.name});
                this.loadInitialData();
                API.getCSRFToken().then( (response) => {this.setState({csrfToken: response.csrfToken})} );
            }).catch( (errorObj) => {
                if (errorObj.status && errorObj.status === 401) {
                    // isLoggedIn false redirects to /login
                    this.setState({isLoggedIn: false, loading: false, loginError: false, errorMsg:''});
                }
            })
        }
    }

    loadInitialData() {
        const promises = [ API.getAllExams(), API.getAllCourses() ];
        Promise.all(promises).then(
            ([ex, cs]) => {
                this.setState({ exams: this.sortExams(ex), courses: cs, loading: false })
            }
        ).catch(
            (errorObj) => {
                this.handleErrors(errorObj);
            }
        );
    }

    sortExams(exams) {
        // Returns the same array: creating a new array is assumed to be done by the caller if used in setState
        return exams.sort((a, b) => a.date.localeCompare(b.date));
    }

    handleErrors(errorObj) {
        if (errorObj) {
            if (errorObj.status && errorObj.status === 401) {
                // isLoggedIn false redirects to /login
                setTimeout( ()=>{this.setState({isLoggedIn: false, loginError:false, errorMsg:''})}, 2000 );
            }
            const err0 = errorObj.errors[0];
            const errorString = err0.param + ': ' + err0.msg;
            this.setState({ errorMsg: errorString, loading: false });
        }
    }

    addOrEditExam = (exam) => {
        if (this.state.exams.some((ex) => ex.coursecode === exam.coursecode)) {
            API.updateExam(exam, this.state.csrfToken).then(
                () => API.getAllExams().then((ex) => this.setState({ exams: this.sortExams(ex) }))
            ).catch(
                (errorObj) => {
                    this.handleErrors(errorObj);
                }
            )
        } else {
            API.insertNewExam(exam, this.state.csrfToken).then(
                () => API.getAllExams().then((ex) => this.setState({ exams: this.sortExams(ex) }))
            ).catch(
                (errorObj) => {
                    this.handleErrors(errorObj);
                }
            )
        }
    }

    deleteExam = (exam) => {
        API.deleteExam(exam, this.state.csrfToken).then(
            () => API.getAllExams().then((ex) => this.setState({ exams: this.sortExams(ex) }))
        ).catch(
            (errorObj) => {
                this.handleErrors(errorObj);
            }
        );
        //this.setState((state) => ({exams: state.exams.filter((ex) => ex.coursecode !== exam.coursecode)}));
    }

    cancelErrorMsg = () => {
        this.setState({ errorMsg: '' });
    }

    userLogout = () => {
        API.userLogout().then(
            () => {this.setState({isLoggedIn: false, user: ''})}
        );
    }

    setLoggedInUser = (name) => {
        this.setState({isLoggedIn: true, user: name, loading: true});
        this.loadInitialData();
        API.getCSRFToken().then( (response) => this.setState({csrfToken: response.csrfToken}));
    }

    render() {
        return <Router>
            <Switch>
                <Route path='/login' render={(props) => {
                    // This automatically redirect to main page if user is logged in
                    // Use logout button or manually delete the authorization cookie to logout
                    if (this.state.isLoggedIn)
                        return <Redirect to='/' />;
                    else
                        return <>
                            <AppTitle />
                            <Login setLoggedInUser={this.setLoggedInUser} />
                        </>;
                }} >
                </Route>
                <Route path='/update' render={ (props) => {
                    return <>
                    <AppTitle />
                    <ExamForm courses={this.state.courses}
                        exam={props.location.state && props.location.state.exam}
                        addOrEditExam={this.addOrEditExam} />
                    </>;
                } }>
                </Route>
                <Route path='/' render={(props) => {
                    if (this.state.loading)
                        return <>
                            <AppTitle />
                            <Logout isLoggedIn={this.state.isLoggedIn} userLogout={this.userLogout} />
                            <Loading />
                        </>;
                    else {
                        // Logged in if it is already so in this.state, or it just became so from the origin link
                        let isLoggedIn = this.state.isLoggedIn;
                        if (props.location.state && props.location.state.isLoggedIn)
                            isLoggedIn = props.location.state.isLoggedIn;

                        if (isLoggedIn)
                            return <>
                                <AppTitle />
                                <Logout isLoggedIn={this.state.isLoggedIn} userLogout={this.userLogout} />
                                <OptionalErrorMsg errorMsg={this.state.errorMsg} cancelErrorMsg={this.cancelErrorMsg} />
                                <ExamScores exams={this.state.exams} courses={this.state.courses}
                                    isLoggedIn={this.state.isLoggedIn}
                                    user={this.state.user}
                                    deleteExam={this.deleteExam}
                                />
                            </>;
                        else
                            return <Redirect to='/login' />;
                    }
                }} >
                </Route>
            </Switch>
        </Router>
    }

}

export default App;
