document.addEventListener('DOMContentLoaded', function () {
    const date = new Date()
    const curYear = date.getFullYear()
    const expYears = curYear - 2020
    document.getElementById("experience").innerText=`Bringing ${expYears} years of expertise to address your specific challenges. Proficient in databases, server-side logic, and unlimited revisions for your satisfaction.`
    document.getElementById("copyYear").innerText=`Copyright © Hasnain Raza ${curYear}`

});

