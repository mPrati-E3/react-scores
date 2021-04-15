// databse

const fakeExams = [
    {coursecode: '01TYMOV', score: 28, date: '2020-04-01'},
    {coursecode: '01SQJOV', score: 29, date: '2020-05-03'},
    {coursecode: '04GSPOV', score: 18, date: '2020-04-24'},
    {coursecode: '01TXYOV', score: 24, date: '2020-04-21'},
].sort((a, b) => a.date.localeCompare(b.date));

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
].sort((a,b)=>a.name.localeCompare(b.name));

async function getExams() {
    return fakeExams ;
}

async function getCourses() {
    return fakeCourses ;
}

const API = { getCourses, getExams } ;
export default API;
