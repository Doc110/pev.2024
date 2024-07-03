function calculateAge() {
    const dobString = document.getElementById('dob').value;
    const consultDateString = document.getElementById('consultDate').value;

    if (!dobString || !consultDateString) {
        alert('Veuillez entrer la date de naissance et la date de consultation.');
        return;
    }

    const dob = new Date(dobString);
    const consultDate = new Date(consultDateString);

    const ageInDays = Math.floor((consultDate - dob) / (1000 * 60 * 60 * 24));
    const ageInMonths = Math.floor(ageInDays / 30.4375);
    const ageInYears = Math.floor(ageInMonths / 12);

    document.getElementById('ageDisplay').textContent = `Âge: ${ageInYears} ans, ${ageInMonths % 12} mois, ${ageInDays % 30} jours`;
}

function submitForm() {
    const formData = new FormData(document.getElementById('dataForm'));
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    localStorage.setItem('formData', JSON.stringify(data));

    // Rediriger vers la page des résultats
    window.location.href = 'result.html';
}

function resetForm() {
    document.getElementById('dataForm').reset();
    document.getElementById('ageDisplay').textContent = '';
}