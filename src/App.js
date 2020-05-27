import React from 'react';
import AppTitle from "./AppTitle";
import { ExamScores, OptionalExamForm, OptionalErrorMsg, Loading } from "./ExamComponents";
import { LoginForm, Logout } from "./LoginComponent";
import API from './API';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = { exams: [], courses: [], 
            mode: 'login', editedExam: null, 
            errorMsg: '', loginError: false,
            csrfToken: null };
    }

    componentDidMount() {
        // load initial data is now done after login
        // this.loadInitialData();
    }

    loadInitialData() {
        const promises = [ API.getAllExams(), API.getAllCourses() ];
        Promise.all(promises).then(
            ([ex, cs]) => {
                this.setState({ exams: this.sortExams(ex), courses: cs, mode: 'view' })
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
                setTimeout( ()=>{this.setState({mode:'login', loginError:false, errorMsg:''})}, 2000 );
            }
            const err0 = errorObj.errors[0];
            const errorString = err0.param + ': ' + err0.msg;
            this.setState({ errorMsg: errorString });
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
        /*
        // Mandatory reading: https://www.robinwieruch.de/react-state-array-add-update-remove
        this.setState((state) => {
            // remove possible duplicates (same code) -- happens when you EDIT a course
            let buildState = state.exams.filter((ex) => ex.coursecode !== exam.coursecode);
            // add new exam
            buildState.push(exam);
            // sort by date
            buildState.sort((a, b) => a.date.localeCompare(b.date));
            return {exams: buildState}
        });
        */
        this.setState({ mode: 'view' });
    }

    requireEditExam = (exam) => {
        this.setState({ mode: 'edit', editedExam: exam, errorMsg: '' });
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

    cancelForm = () => {
        this.setState({ mode: 'view', editedExam: null, errorMsg: '' });

    }

    openExamForm = () => {
        this.setState({ mode: 'add', editedExam: null, errorMsg: '' });
    }

    cancelErrorMsg = () => {
        this.setState({ errorMsg: '' });
    }

    userLogin = (user, pass) => {
        this.setState({mode: 'loginInProgress'});
        API.userLogin(user, pass).then(
            () => {
                this.setState({ mode: 'loading' , loginError: false});
                this.loadInitialData();
                API.getCSRFToken().then( (response) => this.setState({csrfToken: response.csrfToken}));
            }
        ).catch(
            () => {this.setState({loginError: true, mode: 'login'})}
            /*
            (errorObj) => {
                if (errorObj) {
                    const err0 = errorObj.errors[0];
                    const errorString = err0.param + ': ' + err0.msg;
                    this.setState({ errorMsg: errorString })
                }
                API.getAllExams().then((ex) => this.setState({ exams: this.sortExams(ex) }))
            }
            */
        );
    }

    userLogout = () => {
        API.userLogout().then(
            () => {this.setState({mode: 'login'})}
        );
    }

    cancelLoginErrorMsg = () => {
        this.setState({loginError: false});
    }

    render() {
        // NB: for simplicity, this implementation does not use react routes
        // This is NOT the recommended way to implement login "pages" in React
        return <div className="App">
            <AppTitle />
            <Logout mode={this.state.mode} userLogout={this.userLogout} />
            
            <OptionalErrorMsg errorMsg={this.state.loginError?'Wrong username and/or password':''}
                cancelErrorMsg={this.cancelLoginErrorMsg} />
            <LoginForm mode={this.state.mode} userLogin={this.userLogin} />

            <Loading mode={this.state.mode} />
            <OptionalErrorMsg errorMsg={this.state.errorMsg} cancelErrorMsg={this.cancelErrorMsg} />
            <ExamScores exams={this.state.exams} courses={this.state.courses} mode={this.state.mode}
                openExamForm={this.openExamForm} requireEditExam={this.requireEditExam}
                deleteExam={this.deleteExam}
            />
            <OptionalExamForm courses={this.state.courses} mode={this.state.mode} exam={this.state.editedExam}
                addOrEditExam={this.addOrEditExam}
                cancelForm={this.cancelForm}
            />
        </div>
    }

}

export default App;
