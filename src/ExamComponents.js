import React from 'react';

const iconEdit = <svg className="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="orange"
                       xmlns="http://www.w3.org/2000/svg">
    <path
        d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"/>
    <path fillRule="evenodd"
          d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z"
          clipRule="evenodd"/>
</svg>;

const iconDelete = <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="red"
                         xmlns="http://www.w3.org/2000/svg">
    <path
        d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/>
    <path fillRule="evenodd"
          d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
          clipRule="evenodd"/>
</svg>;

const iconAdd = <svg className="bi bi-plus-square-fill" width="2em" height="2em" viewBox="0 0 16 16" fill="green"
                      xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd"
              d="M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2zm6.5 4a.5.5 0 00-1 0v3.5H4a.5.5 0 000 1h3.5V12a.5.5 0 001 0V8.5H12a.5.5 0 000-1H8.5V4z"
              clipRule="evenodd"/>
    </svg>;


class ExamTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {exams: [...props.exams]}; // copy the initial list of exams from props
    }

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
                this.state.exams.map((e) => <ExamRow key={e.coursecode}
                                                     exam={{...e, name: this.props.courseNames[e.coursecode]}}
                                                     onClick={this.highlightRow}/>)
            }
            </tbody>
            <caption style={{captionSide: 'top'}}>My exams...</caption>
        </table>
    }
}

function ExamRow(props) {
    return <tr><ExamRowData exam={props.exam} examName={props.examName}/><RowControls/></tr>
}

function ExamRowData(props) {
    return <>
        <td>{props.exam.name}</td>
        <td>{props.exam.score}</td>
        <td>{props.exam.date.toLocaleDateString()}</td>
    </>;
}

function RowControls(props) {
    return <td>
        {iconEdit} {iconDelete}
    </td>
}

function TableControls(props) {
    if (props.mode === 'view')
        return <div align={'right'}>
            <button type='button' className='btn btn-default btn-lg' style={{padding: 0}}>
                {iconAdd}
            </button>
        </div>
    else return null;
}

function ExamScores(props) {
    const courseNames = {};
    for (const c of props.courses)
        courseNames[c.coursecode] = c.name;
    return <>
        <ExamTable exams={props.exams} courseNames={courseNames}/>
        <TableControls mode={props.mode}/>
    </>;
}

function OptionalExamForm(props) {
    if (props.mode === 'view')
        return null;
    else
        return <div className={'jumbotron'}>
            <form className=''>
                <ExamFormData exam={props.exam} courses={props.courses}/>
                <ExamFormControls/>
            </form>
        </div>
}

function ExamFormData(props) {
    return <div className={'form-row'}>
        <div className={'form-group'}>
            <label htmlFor='selectCourse'>Course</label>
            <select id='selectCourse' className={'form-control'} defaultValue={props.exam.coursecode}>
                {props.courses.map((c) => <option value={c.coursecode}>{c.name}</option>)}
            </select></div>
        &nbsp;
        <div className={'form-group'}>
            <label htmlFor='inputScore'>Score</label>
            <input id='inputScore' className={'form-control'} type='number' min={18} max={31} name='score'
                   defaultValue={props.exam.score}/>
        </div>
        &nbsp;
        <div className={'form-group'}>
            <label htmlFor='inputDate'>Date</label>
            <input id='inputDate' className={'form-control'} type='date' name='examdate'
                   defaultValue={props.exam.date}/>
        </div>
    </div>;
}

function ExamFormControls(props) {
    return <div className={'form-row'}>
        <button type="submit" className="btn btn-primary">Save</button>
        &nbsp;
        <button type="submit" className="btn btn-secondary">Cancel</button>
    </div>;
}

export {ExamScores, OptionalExamForm};
