import React from 'react';
import { iconAdd, iconDelete, iconEdit } from "./svgIcons";

import { Link, Redirect } from 'react-router-dom';

class ExamTable extends React.Component {

    render() {
        return <table className='table ' style={{ marginBottom: 0 }}>
            <thead>
                <tr>
                    <th className='col-6'>Exam</th>
                    <th className='col-2'>Score</th>
                    <th className='col-2'>Date</th>
                    <th className='col-2'>Actions</th>
                </tr>
            </thead>
            <tbody>{
                this.props.exams.map((e) => <ExamRow key={e.coursecode}
                    exam={e}
                    examName={this.props.courseNames[e.coursecode]}
                    deleteExam={this.props.deleteExam}
                />)
                /* NOTE: exam={{...e, name: this.props.courseNames[e.coursecode]}} could be a quicker (and dirtier) way
                to add the .name property to the exam, instead of passing the examName prop */
            }
            </tbody>
            <caption style={{ captionSide: 'top' }}>Exams of {this.props.user}</caption>
        </table>
    }
}

function ExamRow(props) {
    return <tr>
        <ExamRowData exam={props.exam} examName={props.examName} />
        <RowControls exam={props.exam}
            deleteExam={props.deleteExam} />
    </tr>
}

function ExamRowData(props) {
    return <>
        <td>{props.examName}</td>
        <td>{props.exam.score}</td>
        <td>{new Date(props.exam.date).toLocaleDateString()}</td>
    </>;
}

function RowControls(props) {
    return <td>
        {<>
            <Link to={{ 
                pathname: '/update', 
                state: {exam: props.exam} 
                }} >{iconEdit}</Link>
            <span onClick={() => props.deleteExam(props.exam)}>{iconDelete}</span>
        </>}
    </td>
}

function TableControls(props) {
    return <div align={'right'}>
        <Link to='/update' className='btn btn-default btn-lg' style={{ padding: 0 }} >
            {iconAdd}
        </Link>
    </div>
}

function ExamScores(props) {
    const courseNames = {};
    for (const c of props.courses)
        courseNames[c.coursecode] = c.name;
    return <>
        <ExamTable exams={props.exams} courseNames={courseNames}
            deleteExam={props.deleteExam}
            user={props.user} />
        <TableControls />
    </>;
}


class ExamForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.props.exam ? 
            { ...this.props.exam, submitted: false } : 
            { coursecode: null, score: null, date: null, submitted: false };
    }

    /*
    updateCourse = (coursecode) => {
        this.setState({coursecode: coursecode});
    }

    updateScore = (score) => {
        this.setState({score: score});
    }

    updateDate = (date) => {
        this.setState({date: new Date(date)});
    }
    */

    updateField = (name, value) => {
        this.setState({ [name]: value });
    }

    doInsertExam = (exam) => {
        if (this.form.checkValidity()) {
            this.props.addOrEditExam(exam);
            this.setState( {submitted: true});
        } else {
            this.form.reportValidity();
        }
    }

    validateForm = (event) => {
        event.preventDefault();
    }

    render() {
        if (this.state.submitted)
            return <Redirect to='/' />;
        else
        return <div className={'jumbotron'}>
            <form className='' onSubmit={this.validateForm} ref={form => this.form = form}>
            <ExamFormData exam={{
                coursecode: this.state.coursecode || '',
                score: this.state.score || '',
                date: this.state.date || ''
            }}
                courses={this.props.courses}

                updateField={this.updateField}
                isModify={this.props.exam?true:false}
            />
            {/* if you want to handle each field separately:
            updateCourse={this.updateCourse}
                          updateScore={this.updateScore}
                          updateDate={this.updateDate}*/}
            <ExamFormControls insert={() => this.doInsertExam(this.state)}
                isModify={this.props.exam?true:false} submitted={this.state.submitted} />
            </form>
        </div>;
    }
}

function ExamFormData(props) {
    return <div className={'form-row'}>
        <div className={'form-group'}>
            <label htmlFor='selectCourse'>Course</label>
            <select id='selectCourse' className={'form-control'} required={true}
                name='coursecode'
                value={props.exam.coursecode}
                disabled={props.isModify}
                onChange={(ev) => props.updateField(ev.target.name, ev.target.value)}>

                <option value=''> </option>
                {props.courses.map((c) => <option key={c.coursecode}
                    value={c.coursecode}>{c.name} ({c.coursecode})</option>)}
            </select></div>
        {/* ALTERNATIVE: onChange={(ev) => props.updateCourse(ev.target.value)}>*/}

        &nbsp;
        <div className={'form-group'}>
            <label htmlFor='inputScore'>Score</label>
            <input id='inputScore' className={'form-control'} type='number' min={18} max={31} required={true}
                name='score'
                value={props.exam.score}
                onChange={(ev) => props.updateField(ev.target.name, ev.target.value)}
            />
            {/*onChange={(ev) => props.updateScore(ev.target.value)}*/}
        </div>
        &nbsp;
        <div className={'form-group'}>
            <label htmlFor='inputDate'>Date</label>
            <input id='inputDate' className={'form-control'} required={true}
                type='date'
                name='date'
                value={props.exam.date}
                onChange={(ev) => props.updateField(ev.target.name, ev.target.value)}
            />
            {/*onChange={(ev) => props.updateDate(ev.target.value)}*/}

        </div>
    </div>
        ;
}

function ExamFormControls(props) {
    return <div className={'form-row'}>
        <button type="button" className="btn btn-primary" disabled={props.submitted}
            onClick={props.insert}>{props.isModify ? 'Modify' : 'Insert'}</button>
        &nbsp;
        <Link to='/' className="btn btn-secondary" >Cancel</Link>
    </div>;
}

function OptionalErrorMsg(props) {
    if (props.errorMsg)
        return <div className='alert alert-danger alert-dismissible show' role='alert'>
            <strong>Error:</strong> <span>{props.errorMsg}</span>
            <button type='button' className='close' aria-label='Close'
                onClick={props.cancelErrorMsg}> {/* needed to reset msg in state, so next time renders as null */}
                {/* do not use data-dismiss which activates bootstrap JS (incompatible with React) 
                    alternatively, use react-bootstrap components */}
                <span aria-hidden='true'>&times;</span>
            </button>
        </div>;
    else
        return null;
}

function Loading(props) {
        return <div className='d-flex align-items-left'>
            <div className='spinner-border m-2' role='status' aria-hidden='true'></div>
            <strong>Loading...</strong>
        </div>;
}


export { ExamScores, ExamForm, OptionalErrorMsg, Loading };
