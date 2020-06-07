import React, {useState, useEffect} from 'react';
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

function App(props) {

    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);

    // isLoggedIn: false, // User is authenticated
    // loginError: false, // Need to display that login action failed
    // user: '',          // Name of user to display when authenticated
    const [loginStatus, setLoginStatus] = useState({isLoggedIn: false, loginError: false, user: ''});

    // Need to start with loading: true to check if user already is logged in
    const [loading, setLoading] = useState(true);
    
    // Error message received by an API call
    const [errorMsg, setErrorMsg] = useState('');
    const [csrfToken, setCsrfToken] = useState(null);


    const handleErrors = (errorObj) => {
        if (errorObj) {
            if (errorObj.status && errorObj.status === 401) {
                // isLoggedIn false redirects to /login
                setTimeout( ()=>{
                    setLoginStatus({isLoggedIn: false, loginError: false, user: loginStatus.user});
                    setErrorMsg('');
                }, 2000 );
            }
            const err0 = errorObj.errors[0];
            const errorString = err0.param + ': ' + err0.msg;
            setErrorMsg(errorString);
            setLoading(false);
        }
    };

    const loadInitialData = () => {
        const promises = [ API.getAllExams(), API.getAllCourses() ];
        Promise.all(promises).then(
            ([ex, cs]) => {
                setExams(sortExams(ex));
                setCourses(cs);
                setLoading(false);
            }
        ).catch(
            (errorObj) => {
                handleErrors(errorObj);
            }
        );
    };


    // NB: This is required only if you want to recognize that a user is already logged in when
    // reloading the application in the browser or by manually setting a URL in the browser URL bar
    // To remove it, remember to set the initial state of loading equal to false

    // Attempt to load user info as if the user were authenticated, to determine:
    // - if the authorization token is present (since cookie is not directly accessible by JS)
    // - if the token is present, if it is still valid
    // - if it is valid, re-init user name, exams, courses, csrfToken
    useEffect(() => {
        if (!loginStatus.isLoggedIn) {
            API.getUserInfo().then((userInfo) => {
                setLoginStatus({ isLoggedIn: true, user: userInfo.name, loginError: loginStatus.loginError });
                loadInitialData();
                API.getCSRFToken().then((response) => { setCsrfToken(response.csrfToken) });
            }).catch((errorObj) => {
                if (errorObj.status && errorObj.status === 401) {
                    // setting isLoggedIn to false redirects to /login
                    setLoginStatus({ isLoggedIn: false, loginError: false, user: loginStatus.user });
                    setLoading(false);
                    setErrorMsg('');
                }
            })
        }
    // The next comment disables a warning: in this specific case no needed dependencies 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);  // Simply want to emulate a componentDidMount, so do not list dependencies. Will run only once.
    


    const sortExams = (exams) => {
        // Returns the same array: creating a new array is assumed to be done by the caller if used in setState
        return exams.sort((a, b) => a.date.localeCompare(b.date));
    }


    const addOrEditExam = (exam) => {
        if (exams.some((ex) => ex.coursecode === exam.coursecode)) {
            API.updateExam(exam, csrfToken).then(
                () => API.getAllExams().then((ex) => setExams( sortExams(ex)))
            ).catch(
                (errorObj) => {
                    handleErrors(errorObj);
                }
            )
        } else {
            API.insertNewExam(exam, csrfToken).then(
                () => API.getAllExams().then((ex) => setExams( sortExams(ex)))
            ).catch(
                (errorObj) => {
                    handleErrors(errorObj);
                }
            )
        }
    }

    const deleteExam = (exam) => {
        API.deleteExam(exam, csrfToken).then(
            () => API.getAllExams().then((ex) => setExams( sortExams(ex) ) )
        ).catch(
            (errorObj) => {
                handleErrors(errorObj);
            }
        );
        //this.setState((state) => ({exams: state.exams.filter((ex) => ex.coursecode !== exam.coursecode)}));
    }

    const cancelErrorMsg = () => {
        setErrorMsg('');
    }

    const userLogout = () => {
        API.userLogout().then(
            () => {setLoginStatus({isLoggedIn: false, user: '', loginError: loginStatus.loginError}) }
        );
    }

    const setLoggedInUser = (name) => {
        setLoginStatus({isLoggedIn: true, user: name, loginError: false});
        setLoading(true);
        loadInitialData();
        API.getCSRFToken().then( (response) => setCsrfToken(response.csrfToken) );
    }

        return <Router>
            <Switch>
                <Route path='/login' render={(props) => {
                    // This automatically redirect to main page if user is logged in
                    // Use logout button or manually delete the authorization cookie to logout
                    if (loginStatus.isLoggedIn)
                        return <Redirect to='/' />;
                    else
                        return <>
                            <AppTitle />
                            <Login setLoggedInUser={setLoggedInUser} />
                        </>;
                }} >
                </Route>
                <Route path='/update' render={ (props) => {
                    return <>
                    <AppTitle />
                    <ExamForm courses={courses}
                        exam={props.location.state && props.location.state.exam}
                        addOrEditExam={addOrEditExam} />
                    </>;
                } }>
                </Route>
                <Route path='/' render={(props) => {
                    if (loading)
                        return <>
                            <AppTitle />
                            <Logout isLoggedIn={loginStatus.isLoggedIn} userLogout={userLogout} />
                            <Loading />
                        </>;
                    else {
                        // Logged in if it is already so in  state, or it just became so from the origin link
                        let isLoggedIn = loginStatus.isLoggedIn;
                        if (props.location.state && props.location.state.isLoggedIn)
                            isLoggedIn = props.location.state.isLoggedIn;

                        if (isLoggedIn)
                            return <>
                                <AppTitle />
                                <Logout isLoggedIn={loginStatus.isLoggedIn} userLogout={userLogout} />
                                <OptionalErrorMsg errorMsg={errorMsg} cancelErrorMsg={cancelErrorMsg} />
                                <ExamScores exams={exams} courses={courses}
                                    isLoggedIn={loginStatus.isLoggedIn}
                                    user={loginStatus.user}
                                    deleteExam={deleteExam}
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

export default App;
