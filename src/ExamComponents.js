import React from 'react';
import {iconAdd, iconDelete, iconEdit} from "./svgIcons";

class ExamTable extends React.Component {

    // Mandatory render function ( table )
    render() {
        return <table className='table ' style={{marginBottom: 0}}>
                    <thead>
                        <tr>
                            <th className='col-6'>Exam</th>
                            <th className='col-2'>Score</th>
                            <th className='col-2'>Date</th>
                            <th className='col-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{
                            // For each row in the table, I'll design an exam in my exams list
                            // I call the ExamRow function for every exam
                            this.props.exams.map((e) => <ExamRow 
                                                            key={e.coursecode}
                                                            exam={e}
                                                            examName={this.props.courseNames[e.coursecode]}
                                                            requireEditExam={this.props.requireEditExam}
                                                            deleteExam={this.props.deleteExam}
                                                            mode={this.props.mode}
                                                        />)
                            }
                    </tbody>
                    <caption style={{captionSide: 'top'}}>My exams...</caption>
                </table>
    }
}

// Function to create the row where I'll design the exam starting by my exams list and props
function ExamRow(props) {
    return <tr>
                {/* CALLING ExamRowData TO RETRIEVE INFORMATION ABOUT THE EXAM */}
                <ExamRowData 
                    exam={props.exam} 
                    examName={props.examName}
                />
                {/* CALLING RowControls TO INSERT CAPABILITY OF AN EXAM (GET DELETED, MODIFY, ...) */}
                <RowControls 
                    exam={props.exam} 
                    requireEditExam={props.requireEditExam}
                    deleteExam={props.deleteExam} 
                    mode={props.mode}
                />
            </tr>
}

// Function to just get the exam's information
function ExamRowData(props) {
    // Using <></>
    return <>
                <td>
                    {props.examName}
                </td>
                <td>
                    {props.exam.score}
                </td>
                <td>{new Date(props.exam.date).toLocaleDateString()}</td>
            </>;
}

// Function to get the buttons that describe exam capability
function RowControls(props) {
    return <td> {(props.mode === 'view') && <>
                                                <span onClick={() => props.requireEditExam(props.exam)}>{iconEdit}</span>
                                                <span onClick={() => props.deleteExam(props.exam)}>{iconDelete}</span>
                                            </>
                }
            </td>
}

// Function to get the adding button that will open the form
function TableControls(props) {
    if (props.mode === 'view')
        return <div align={'right'}>
                    <button type='button' className='btn btn-default btn-lg' style={{padding: 0}} onClick={() => props.openExamForm()}>
                        {iconAdd}
                    </button>
                </div>
    else 
        return null;
}

// Function to get information about the scores of the courses
function ExamScores(props) {
    const courseNames = {};
    for (const c of props.courses)
        courseNames[c.coursecode] = c.name;
    // Using <></>
    return <>
                {/* CALLING ExamTable TO DESIGN THE TABLE USING THE COURSES AND props */}
                <ExamTable 
                    exams={props.exams} 
                    courseNames={courseNames}
                    requireEditExam={props.requireEditExam}
                    deleteExam={props.deleteExam}
                    mode={props.mode}
                />
                {/* CALLING TableControls TO CREATE THE ADDING BUTTON THAT WILL OPEN THE FORM */}
                <TableControls 
                    mode={props.mode} 
                    openExamForm={props.openExamForm}
                />
    </>;
}

// Function that call ExamForm to open the adding form
function OptionalExamForm(props) {
    if (props.mode === 'view')
        return null;
    else {
        return <div className={'jumbotron'}>
                    <ExamForm 
                        exam={props.exam} 
                        courses={props.courses}
                        mode={props.mode}
                        addOrEditExam={props.addOrEditExam}
                        cancelExam={props.cancelExam}
                    />
                </div>;
    }
}

// Component to design the form ---> It's called by OptionalExamForm
class ExamForm extends React.Component {

    constructor(props) {
        super(props);
        // It is not optimal to define the state like this but for this app is ok
        this.state = this.props.exam ? {...this.props.exam} : {coursecode: null, score: null, date: null};
    }

    // update the course in the state
    updateCourse = (coursecode) => {
        this.setState({coursecode: coursecode});
    }

    // update the score in the state
    updateScore = (score) => {
        this.setState({score: score});
    }

    // update the date in the state
    updateDate = (date) => {
        this.setState({date: new Date(date)});
    }
    
    // update the a filed (generic) in the state
    updateField = (name, value) => {
        this.setState({[name]: value});
    }

    // if valid, insert a new exam
    doInsertExam = (exam) => {
        if (this.form.checkValidity()) {
            this.props.addOrEditExam(exam);
        } else {
            this.form.reportValidity();
        }
    }

    // the user want to close the form and go back without insert a new exam
    doCancel = () => {
        this.props.cancelExam();
    }

    // check if the form is valid, basically just force it to not reload the page
    validateForm = (event) => {
        event.preventDefault();
    }

    // Mandatory render function ( form )
    render() {
        return <form className='' onSubmit={this.validateForm} ref={form => this.form = form}>

                    {/* GETTING THE INFORMATION ABOUT THE FORM CALLIN ExamFormData */}
                    <ExamFormData 
                        exam={{
                            coursecode: this.state.coursecode || '',
                            score: this.state.score || '',
                            date: this.state.date || ''
                        }}
                        courses={this.props.courses}
                        updateField={this.updateField}
                        mode={this.props.mode}
                    />

                    {/* GETTING THE CONTROLS (BUTTONS AND MODE) ABOUT THE FORM CALLIN ExamFormControls */}
                    <ExamFormControls 
                        insert={() => this.doInsertExam(this.state)} cancel={this.doCancel} mode={this.props.mode}
                    />
        </form>;
    }
}

// Design the form information
// I got props param passed by the App
function ExamFormData(props) {
    return <div className={'form-row'}>

                {/* CHOICEBOX TO CHOOSE THE COURSE */}
                <div className={'form-group'}>
                    <label htmlFor='selectCourse'>Course</label>
                    <select 
                        id='selectCourse' 
                        className={'form-control'} 
                        required={true}
                        name='coursecode'
                        value={props.exam.coursecode}
                        disabled={props.mode === 'edit'}
                        onChange={(ev) => props.updateField(ev.target.name, ev.target.value)}
                    >
                        <option value=''> </option>
                        {props.courses.map((c) => <option key={c.coursecode} value={c.coursecode}>{c.name} ({c.coursecode})</option>)}
                    </select>
                </div>

                &nbsp;

                {/* TEXTFIELD (NUMBER BETWEEN 18 & 31) TO INSERT THE SCORE */}
                <div className={'form-group'}>
                    <label htmlFor='inputScore'>Score</label>
                    <input 
                        id='inputScore' 
                        className={'form-control'} 
                        type='number'
                        min={18} 
                        max={31} 
                        required={true}
                        name='score'
                        value={props.exam.score}
                        onChange={(ev) => props.updateField(ev.target.name, ev.target.value)}
                    />
                </div>

                &nbsp;

                {/* DATE INPUT TO CHOOSE THE DATE */}
                <div className={'form-group'}>
                    <label htmlFor='inputDate'>Date</label>
                    <input 
                        id='inputDate' 
                        className={'form-control'} 
                        required={true}
                        type='date'
                        name='date'
                        value={props.exam.date}
                        onChange={(ev) => props.updateField(ev.target.name, ev.target.value)}
                    />
                </div>

            </div>
        ;
}

// Design the form controls (the two buttons)
// I got props param passed by the App
function ExamFormControls(props) {
    return <div className={'form-row'}>
                <button type="button" className="btn btn-primary"
                    onClick={props.insert}>{props.mode === 'add' ? 'Insert' : 'Modify'}</button>
                &nbsp;
                <button type="button" className="btn btn-secondary" onClick={props.cancel}>Cancel</button>
            </div>;
}

export {ExamScores, OptionalExamForm};
