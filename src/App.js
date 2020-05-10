import React from 'react';
import AppTitle from "./AppTitle";
import {ExamScores, OptionalExamForm} from "./ExamComponents";


const fakeExams = [
    {coursecode: '01TYMOV', score: 28, date: new Date('2020-04-01')},
    {coursecode: '01SQJOV', score: 29, date: new Date('2020-05-03')},
    {coursecode: '04GSPOV', score: 18, date: new Date('2020-04-24')},
    {coursecode: '01TXYOV', score: 24, date: new Date('2020-04-21')},
];

const fakeCourses = [
    {coursecode: '01TYMOV', name: 'Information systems security'},
    {coursecode: '02LSEOV', name: 'Computer architectures'},
    {coursecode: '01SQJOV', name: 'Data Science and Database Technology'},
    {coursecode: '01OTWOV', name: 'Computer network technologies and services'},
    {coursecode: '04GSPOV', name: 'Software engineering'},
    {coursecode: '01TXYOV', name: 'Web Applications I'},
    {coursecode: '01NYHOV', name: 'System and device programming'},
    {coursecode: '01TYDOV', name: 'Cloud Computing'},
    {coursecode: '01SQPOV', name: 'Software Networking'},
];

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {exams: [...fakeExams]}; // copy the initial list of exams from props
    }


    addExam = (exam) => {
        // Mandatory reading: https://www.robinwieruch.de/react-state-array-add-update-remove
        this.setState((state) => {
            // remove possible duplicates (same code)
            let buildstate = state.exams.filter((ex)=> ex.coursecode!==exam.coursecode) ;
            // add new exam
            buildstate.push(exam);
            return {exams: buildstate}
        }, ()=>{console.log(this.state)});
    }

    render() {
        return <div className="App">
            <AppTitle/>
            <ExamScores exams={this.state.exams} courses={fakeCourses} mode={'view'}

            />
            <OptionalExamForm courses={fakeCourses} mode={'add'} exam={fakeExams[2]} addExam={this.addExam}
            />
        </div>
    }

}

export default App;
