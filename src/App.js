import React from 'react';
import AppTitle from "./AppTitle";
import {ExamScores, OptionalExamForm} from "./ExamComponents";
import API from './API';

class App extends React.Component {

    constructor(props) {
        super(props);

        // initially empty because I will populate this in async mode
        this.state = {exams: [], courses: [], mode: 'view', editedExam: null};
    }

    componentDidMount() {
        // fake loading the exams from the API server into the state
        // I have to use then because these are async calls to API (simulate a database)
        API.getExams().then((ex) => this.setState({exams: ex}));
        API.getCourses().then((cs) => this.setState({courses: cs}));
    }

    addOrEditExam = (exam) => {
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
        this.setState({mode: 'view'});
    }

    // Enter in edit mode, edit an exam using the passed one
    requireEditExam = (exam) => {
        this.setState({mode: 'edit', editedExam: exam});
    }

    // Delete an exam by filtering the exams list using the passed one
    deleteExam = (exam) => {
        this.setState((state) => ({exams: state.exams.filter((ex) => ex.coursecode !== exam.coursecode)}));
    }

    // My form is opened but the user press the "Cancel" button to go back, return in view mode
    cancelExam = () => {
        this.setState({mode: 'view', editedExam: null});

    }

    // Enter in add mode, open the form
    openExamForm = () => {
        this.setState({mode: 'add', editedExam: null});
    }

    // Mandatory render function ( all app )
    render() {
        // Design the app a big <div>
        return <div className="App">
            
                    {/* TITLE */}
                    <AppTitle/>
                        {/* MAIN TABLE*/}
                        <ExamScores 
                            exams={this.state.exams} 
                            courses={this.state.courses} 
                            mode={this.state.mode}
                            openExamForm={this.openExamForm} 
                            requireEditExam={this.requireEditExam}
                            deleteExam={this.deleteExam}
                        />
                        {/* FORM */}
                        <OptionalExamForm 
                            courses={this.state.courses} 
                            mode={this.state.mode} 
                            exam={this.state.editedExam}
                            addOrEditExam={this.addOrEditExam}
                            cancelExam={this.cancelExam}
                        />
                </div>
    }

}

export default App;
