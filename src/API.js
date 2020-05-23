// All the API calls are defined here

import Exam from "./exam.js";
import Course from "./course.js";

const BASEURL = '/api';

async function getAllExams() {
    // call REST API : GET /exams
    const response = await fetch(BASEURL + '/exams');
    const exams_json = await response.json();
    if (response.ok) {
        return exams_json.map((ex) => Exam.from(ex));
    } else {
        throw exams_json;  // An object with the error coming from the server
    }
}

async function insertNewExam(exam) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/exams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exam),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });

}

async function updateExam(exam) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/exams/' + exam.coursecode, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exam),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });

}

async function getAllCourses() {
    const response = await fetch(BASEURL + '/courses');
    const jsoncourses = await response.json();
    const courses = jsoncourses.map((jc) => Course.from(jc));
    return courses;
}

async function deleteExam(exam) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/exams/' + exam.coursecode, {
            method: 'DELETE',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });

}

const API = { getAllExams, insertNewExam, updateExam, deleteExam, getAllCourses };
export default API;
