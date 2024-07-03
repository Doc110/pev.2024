document.addEventListener('DOMContentLoaded', () => {
    const formData = JSON.parse(localStorage.getItem('formData'));
    
    if (!formData) {
        alert('Aucune donnée disponible');
        return;
    }

    const dob = new Date(formData.dob);
    const consultDate = new Date(formData.consultDate);
    const birthWeight = parseInt(formData.weight);
    const hbsPositive = formData.hbsPositive === 'oui';
    
    const ageInMonths = calculateAgeInMonths(dob, consultDate);
    const ageInDays = calculateAgeInDays(dob, consultDate);
    
    const vaccines = [
        { name: 'bcg', label: 'BCG' },
        { name: 'hbv', label: 'HBV' },
        { name: 'hexap1vpo', label: 'Hexap1+VPO' },
        { name: 'hexap2vpo', label: 'Hexap2+VPO' },
        { name: 'hexaprapvpo', label: 'Hexaprap+VPO' },
        { name: 'pneump1', label: 'Pneumo1' },
        { name: 'pneump2', label: 'Pneumo2' },
        { name: 'pneumprap', label: 'Pneumrap' },
        { name: 'ror1', label: 'ROR1' },
        { name: 'ror2', label: 'ROR2' }
    ];
    
    const vaccinationResults = [];
    
    vaccines.forEach(vaccine => {
        const doseReceived = formData[vaccine.name] === 'oui' ? 1 : 0;
        const doseRemaining = calculateDoseRemaining(vaccine.name, formData, ageInDays, birthWeight, hbsPositive);
        
        const vaccinationDate = getVaccinationDate(vaccine.name, formData);
        const ageDifferenceInMonths = calculateAgeDifferenceInMonths(dob, vaccinationDate);
        
        const appointmentDate = getAppointmentDate(vaccine.name, doseReceived, doseRemaining, ageInDays, vaccinationDate, birthWeight, formData);
        
        vaccinationResults.push({
            vaccineName: vaccine.label,
            doseReceived: doseReceived,
            doseRemaining: doseRemaining,
            vaccinationDate: vaccinationDate,
            ageDifferenceInMonths: ageDifferenceInMonths,
            appointmentDate: appointmentDate
        });
    });
    
    const resultsTable = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    
    vaccinationResults.forEach(result => {
        const row = resultsTable.insertRow();
        
        const vaccineCell = row.insertCell(0);
        const doseReceivedCell = row.insertCell(1);
        const doseRemainingCell = row.insertCell(2);
        const vaccinationDateCell = row.insertCell(3);
        const ageDifferenceCell = row.insertCell(4);
        const appointmentDateCell = row.insertCell(5);
        
        vaccineCell.textContent = result.vaccineName;
        doseReceivedCell.textContent = result.doseReceived;
        doseRemainingCell.textContent = result.doseRemaining;
        vaccinationDateCell.textContent = result.vaccinationDate;
        ageDifferenceCell.textContent = result.ageDifferenceInMonths;
        appointmentDateCell.textContent = result.appointmentDate;
        
        if (result.appointmentDate === 'Vaccination immédiate') {
            appointmentDateCell.style.color = 'red';
        } else if (result.appointmentDate === 'Pas de vaccination') {
            appointmentDateCell.style.color = 'yellow';
        } else if (result.appointmentDate === 'Vaccination complète') {
            appointmentDateCell.style.color = 'green';
        }
    });
});

function calculateAgeInMonths(dob, consultDate) {
    const ageInMilliseconds = consultDate - dob;
    const ageInMonths = ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.436875); // Moyenne de jours par mois
    return Math.floor(ageInMonths);
}

function calculateAgeInDays(dob, consultDate) {
    const ageInMilliseconds = consultDate - dob;
    const ageInDays = ageInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.floor(ageInDays);
}

function calculateDoseRemaining(vaccineName, formData, ageInDays, birthWeight, hbsPositive) {
    let doseRemaining = 0;

    if (formData[vaccineName] === 'non') {
        switch (vaccineName) {
            case 'bcg':
                if (ageInDays < 12 * 30 * 15) { // 15 ans en jours
                    doseRemaining = 1;
                }
                break;
            case 'hbv':
                if ((birthWeight < 2000 && ageInDays < 30) || (birthWeight >= 2000 && ageInDays < 8)) {
                    doseRemaining = 1;
                }
                break;
            case 'hexap1vpo':
                if (ageInDays >= 2 * 30 && ageInDays <= 60 * 30) {
                    doseRemaining = 1;
                }
                break;
            case 'hexap2vpo':
                if (ageInDays >= 4 * 30 && ageInDays <= 60 * 30) {
                    doseRemaining = 1;
                }
                break;
            case 'hexaprapvpo':
                if (ageInDays >= 12 * 30 && ageInDays <= 60 * 30) {
                    doseRemaining = 1;
                }
                break;
            case 'pneump1':
                if (ageInDays >= 2 * 30 && ageInDays <= 25 * 30) {
                    doseRemaining = 1;
                }
                break;
            case 'pneump2':
                if (ageInDays >= 4 * 30 && ageInDays <= 25 * 30) {
                    doseRemaining = 1;
                }
                break;
            case 'pneumprap':
                if (ageInDays >= 12 * 30 && ageInDays <= 25 * 30) {
                    doseRemaining = 1;
                }
                break;
            case 'ror1':
                if (ageInDays >= 11 * 30) {
                    doseRemaining = 1;
                }
                break;
            case 'ror2':
                if (ageInDays >= 18 * 30) {
                    doseRemaining = 1;
                }
                break;
        }
    }
    return doseRemaining;
}

function getVaccinationDate(vaccineName, formData) {
    const vaccineDate = formData[vaccineName + 'Date'];
    return vaccineDate ? new Date(vaccineDate).toISOString().split('T')[0] : 'Non définie';
}

function calculateAgeDifferenceInMonths(dob, vaccinationDate) {
    if (!vaccinationDate || vaccinationDate === 'Non définie') return 'Non définie';
    const differenceInMilliseconds = new Date(vaccinationDate) - dob;
    const differenceInMonths = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 30.436875); // Moyenne de jours par mois
    return Math.floor(differenceInMonths);
}

function getAppointmentDate(vaccineName, doseReceived, doseRemaining, ageInDays, vaccinationDate, birthWeight, formData) {
    let appointmentDate = '';

    switch (vaccineName) {
        case 'bcg':
            if (doseRemaining === 1 && ageInDays < 12 * 30 * 15) {
                appointmentDate = 'Vaccination necéssaire';
            } else if (doseRemaining === 1 && ageInDays >= 12 * 30 * 15) {
                appointmentDate = 'Pas de vaccination';
            }
            break;
        case 'hbv':
            if (doseRemaining === 1) {
                if ((ageInDays < 30 && birthWeight < 2000) || (ageInDays < 8 && birthWeight >= 2000)) {
                    appointmentDate = 'Vaccination immédiate';
                } else if (ageInDays >= 31 || (ageInDays >= 8 && birthWeight >= 2000)) {
                    appointmentDate = 'Pas de vaccination';
                }
            }
            break;
        case 'hexap1vpo':
            if (doseReceived === 0) {
                if (ageInDays >= 2 * 30 && ageInDays <= 60 * 30) {
                    appointmentDate = 'Vaccination immédiate';
                } else if (ageInDays >= 60 * 30 || ageInDays < 2 * 30) {
                    appointmentDate = 'Pas de vaccination';
                }
            } else if (doseReceived === 1) {
                const vaccinationDateObj = new Date(vaccinationDate);
                if (ageInDays <= 10 * 30) {
                    vaccinationDateObj.setMonth(vaccinationDateObj.getMonth() + 2);
                } else {
                    vaccinationDateObj.setDate(vaccinationDateObj.getDate() + 45);
                }
                appointmentDate = vaccinationDateObj.toISOString().split('T')[0];
            }
            break;
        case 'hexap2vpo':
            if (doseReceived === 0) {
                if (ageInDays >= 4 * 30 && ageInDays <= 60 * 30) {
                    appointmentDate = 'Vaccination immédiate';
                } else if (ageInDays >= 60 * 30 || ageInDays < 4 * 30) {
                    appointmentDate = 'Pas de vaccination';
                }
            } else if (doseReceived === 1) {
                const vaccinationDateObj = new Date(vaccinationDate);
                if (ageInDays <= 12 * 30) {
                    vaccinationDateObj.setMonth(vaccinationDateObj.getMonth() + 6);
                } else {
                    vaccinationDateObj.setMonth(vaccinationDateObj.getMonth() + 4);
                }
                appointmentDate = vaccinationDateObj.toISOString().split('T')[0];
            }
            break;
        case 'hexaprapvpo':
            if (doseReceived === 0) {
                if (ageInDays >= 12 * 30 && ageInDays <= 60 * 30) {
                    appointmentDate = 'Vaccination immédiate';
                } else if (ageInDays >= 60 * 30 || ageInDays < 12 * 30) {
                    appointmentDate = 'Pas de vaccination';
                }
            } else if (doseReceived === 1) {
                appointmentDate = 'Vaccination complète';
            }
            break;
        case 'pneump1':
            if (doseReceived === 0) {
                if (ageInDays >= 2 * 30 && ageInDays <= 25 * 30) {
                    appointmentDate = 'Vaccination immédiate';
                } else if (ageInDays >= 25 * 30 || ageInDays < 2 * 30) {
                    appointmentDate = 'Pas de vaccination';
                }
            } else if (doseReceived === 1) {
                const vaccinationDateObj = new Date(vaccinationDate);
                if (ageInDays <= 10 * 30) {
                    vaccinationDateObj.setMonth(vaccinationDateObj.getMonth() + 2);
                } else {
                    vaccinationDateObj.setDate(vaccinationDateObj.getDate() + 45);
                }
                appointmentDate = vaccinationDateObj.toISOString().split('T')[0];
            }
            break;
        case 'pneump2':
            if (doseReceived === 0) {
                if (ageInDays >= 4 * 30 && ageInDays <= 25 * 30) {
                    appointmentDate = 'Vaccination immédiate';
                } else if (ageInDays >= 25 * 30 || ageInDays < 4 * 30) {
                    appointmentDate = 'Pas de vaccination';
                }
            } else if (doseReceived === 1) {
                const vaccinationDateObj = new Date(vaccinationDate);
                if (ageInDays <= 12 * 30) {
                    vaccinationDateObj.setMonth(vaccinationDateObj.getMonth() + 6);
                } else {
                    vaccinationDateObj.setMonth(vaccinationDateObj.getMonth() + 4);
                }
                appointmentDate = vaccinationDateObj.toISOString().split('T')[0];
            }
            break;
        case 'pneumprap':
            if (doseReceived === 0) {
                if (ageInDays >= 12 * 30 && ageInDays <= 25 * 30) {
                    appointmentDate = 'Vaccination immédiate';
                } else if (ageInDays >= 25 * 30 || ageInDays < 12 * 30) {
                    appointmentDate = 'Pas de vaccination';
                }
            } else if (doseReceived === 1) {
                appointmentDate = 'Vaccination complète';
            }
            break;
        case 'ror1':
            if (doseReceived === 0) {
                if (ageInDays >= 11 * 30) {
                    appointmentDate = 'Vaccination immédiate';
                } else if (ageInDays < 11 * 30) {
                    appointmentDate = 'Pas de vaccination';
                }
            } else if (doseReceived === 1) {
                const vaccinationDateObj = new Date(vaccinationDate);
                if (ageInDays < 17 * 30) {
                    const targetDate = new Date(dob);
                    targetDate.setMonth(dob.getMonth() + 18);
                    appointmentDate = targetDate.toISOString().split('T')[0];
                } else {
                    vaccinationDateObj.setMonth(vaccinationDateObj.getMonth() + 1);
                    appointmentDate = vaccinationDateObj.toISOString().split('T')[0];
                }
            }
            break;
        case 'ror2':
            if (doseReceived === 0) {
                if (ageInDays >= 18 * 30) {
                    appointmentDate = 'Vaccination immédiate';
                } else if (ageInDays < 18 * 30) {
                    appointmentDate = 'Pas de vaccination';
                }
            } else if (doseReceived === 1) {
                appointmentDate = 'Vaccination complète';
            }
            break;
    }

    // Vérifier si le vaccin suivant a une dose reçue = 1
    const vaccineOrder = ['hexap1vpo', 'hexap2vpo', 'pneump1', 'pneump2', 'ror1'];
    const currentIndex = vaccineOrder.indexOf(vaccineName);
    if (currentIndex !== -1 && currentIndex < vaccineOrder.length - 1) {
        const nextVaccine = vaccineOrder[currentIndex + 1];
        if (formData[nextVaccine] === 'oui') {
            appointmentDate = 'Pas de rendez-vous';
        }
    }

    return appointmentDate;
}