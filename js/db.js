const dbPromised = idb.open('seriea_db', 1, upgradeDb => {
    switch (upgradeDb.oldVersion) {
        case 0:
            upgradeDb.createObjectStore('matches', { 'keyPath': 'id' })
            upgradeDb.createObjectStore('teams', { 'keyPath': 'id' })
    }
    console.log('Sukses');
});



const insertMatch = (match) => {
    dbPromised.then(db => {
        const tx = db.transaction('matches', 'readwrite');
        const store = tx.objectStore('matches')
        store.put(match)
        return tx.complete;
    }).then(() => {
        M.toast({ html: `Pertandingan ${match.homeTeam.name} VS ${match.awayTeam.name}\nberhasil disimpan!` })
        console.log('Jadwal Tersimpan');
        suksesSimpan();
    }).catch(err => {
        console.error('Gagal Simpan Jadwal', err);
        gagalSimpan();
    });
}


const insertTeam = (team) => {
    dbPromised.then(db => {
        const tx = db.transaction('teams', 'readwrite');
        const store = tx.objectStore('teams');
        store.put(team);
        return tx.complete;
    }).then(() => {
        M.toast({ html: `Menjadikan ${team.shortName} Favorit` })
        console.log('Berhasil Simpan');
        suksesSimpan();
        document.getElementById('saveTeam').disabled = true;
    }).catch(err => {
        console.error('Gagal Simpan', err);
        gagalSimpan();
    });
}


const deleteTeam = (team) => {
    dbPromised.then(db => {
        const tx = db.transaction('teams', 'readwrite');
        const store = tx.objectStore('teams');
        store.delete(team);
        return tx.complete;
    }).then(() => {
        M.toast({ html: 'Tim Telah dihapus dari Favorit' });
        saveTeams();
        suksesHapus();
    }).catch(err => {
        console.error('Error: ', err);
        suksesHapus();
    });
}


const delMatch = (match) => {
    dbPromised.then(db => {
        const tx = db.transaction('matches', 'readwrite');
        const store = tx.objectStore('matches');
        store.delete(match);
        return tx.complete;
    }).then(() => {
        M.toast({ html: 'Pertandingan telah dihapus dari Favorit' });
        saveMatch();
        suksesHapus();
    }).catch(err => {
        console.error('Error: ', err);
        suksesHapus();
    });
}


const getSaveMatch = () => {
    return dbPromised.then(db => {
        const tx = db.transaction('matches', 'readonly');
        const store = tx.objectStore('matches');
        return store.getAll();
    })
}


const getSaveTeams = () => {
    return dbPromised.then(db => {
        const tx = db.transaction('teams', 'readonly');
        const store = tx.objectStore('teams');
        return store.getAll();
    })
}

const gagalSimpan = () => {

    const title = 'SAVE FAILED';
    const options = {
        'body': 'Gagal simpan, sudah pernah di simpan menjadi Favorit',
        'icon': './icon/notif.png'
    };
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur notifikasi tidak diijinkan.');
    }
}

const suksesSimpan = () => {
    const title = 'SAVE SUCCESS';
    const options = {
        'body': 'Sukses menyimpan, silahkan buka di menu Favorit',
        'icon': './icon/notif.png'
    };
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur notifikasi tidak diijinkan.');
    }
}


const gagalHapus = () => {

    const title = 'DELETE FAILED';
    const options = {
        'body': 'Gagal Menghapus Tim/jadwal Favorit',
        'icon': './icon/notif.png'
    };
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur notifikasi tidak diijinkan.');
    }
}

const suksesHapus = () => {
    const title = 'DELETE SUCCESS';
    const options = {
        'body': 'Sukses menghapus Tim/jadwal Favorit',
        'icon': './icon/notif.png'
    };
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur notifikasi tidak diijinkan.');
    }
}