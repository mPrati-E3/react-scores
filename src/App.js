import React from 'react';
import AppTitle from "./AppTitle";
import { ExamScores, OptionalExamForm, OptionalErrorMsg, Loading } from "./ExamComponents";
import API from './API';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = { exams: [], courses: [], mode: 'loading', editedExam: null, errorMsg: '' };
    }

    componentDidMount() {
        // Wait to load all info from server before setState
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

    addOrEditExam = (exam) => {
        if (this.state.exams.some((ex) => ex.coursecode === exam.coursecode)) {
            API.updateExam(exam).then(
                () => API.getAllExams().then((ex) => this.setState({ exams: this.sortExams(ex) }))
            ).catch(
                (errorObj) => {
                    if (errorObj) {
                        const err0 = errorObj.errors[0];
                        const errorString = err0.param + ': ' + err0.msg;
                        this.setState({ errorMsg: errorString })
                    }
                    API.getAllExams().then((ex) => this.setState({ exams: this.sortExams(ex) }))
                }
            )
        } else {
            API.insertNewExam(exam).then(
                () => API.getAllExams().then((ex) => this.setState({ exams: this.sortExams(ex) }))
            ).catch(
                (errorObj) => {
                    if (errorObj) {
                        const err0 = errorObj.errors[0];
                        const errorString = err0.param + ': ' + err0.msg;
                        this.setState({ errorMsg: errorString })
                    }
                    API.getAllExams().then((ex) => this.setState({ exams: this.sortExams(ex) }))
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
        API.deleteExam(exam).then(
            () => API.getAllExams().then((ex) => this.setState({ exams: this.sortExams(ex) }))
        ).catch(
            (errorObj) => {
                if (errorObj) {
                    const err0 = errorObj.errors[0];
                    const errorString = err0.param + ': ' + err0.msg;
                    this.setState({ errorMsg: errorString })
                }
                API.getAllExams().then((ex) => this.setState({ exams: this.sortExams(ex) }))
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

    render() {
        return <div className="App">
            <AppTitle />
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
