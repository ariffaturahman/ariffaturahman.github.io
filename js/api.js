const API_KEY = "ec67f810a8094f9aafdf8f66ca0b1792";
const BASE_URL = "https://api.football-data.org/v2/";
const LEAGUE_ID = 2019;
const ENDPOINT_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const ENDPOINT_MATCHDAY = `${BASE_URL}competitions/${LEAGUE_ID}/matches?status=SCHEDULED`;
const ENDPOINT_TEAMS = `${BASE_URL}competitions/2019/teams`;


const fetchAPI = url => {
    return fetch(url, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        })
        .then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
}

//Klasemen
const getStandings = () => {
    if ("caches" in window) {
        caches.match(ENDPOINT_COMPETITION).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    console.log("Competition Data: " + data);
                    showStanding(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_COMPETITION)
        .then(data => {
            showStanding(data);
        })
        .catch(error => {
            console.log(error)
        })
}

const showStanding = data => {
    let standings = "";
    const standingElement = document.getElementById("homeStandings");
    data.standings[0].table.forEach(function(standing) {
        standings += `
				<tr>
					<td class="center">${standing.position}</td>
                    <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="32px" alt="badge"/></td>
					<th>${standing.team.name}</th>
					<td>${standing.playedGames}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.points}</td>
                </tr>
        `;
    });

    standingElement.innerHTML = `
                <div class="card">
                <table class="striped">
                    <thead>
						<tr>
							<th class="center">Peringkat</th>
                            <th> </th>
							<th>Nama Tim</th>
							<th>P</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>Point</th>
                        </tr>
                     </thead>
                    <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>

                </div>
    `;
}

//Jadwal
const getMatchdays = () => {
    if ("caches" in window) {
        caches.match(ENDPOINT_MATCHDAY).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    console.log("Matchday Data: " + data);
                    showMatchday(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_MATCHDAY)
        .then(data => {
            showMatchday(data);
        })
        .catch(error => {
            console.log(error)
        })
}

const showMatchday = data => {
    dataMatch = data;
    const str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);

    let matchday = "";
    const matchdayElement = document.getElementById("homeMatches");

    data.matches.forEach(matches => matchday += matchHtml(matches));
    matchdayElement.innerHTML = matchday;
}

//Team
const getTeams = () => {

    if ("caches" in window) {
        caches.match(ENDPOINT_TEAMS).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    console.log("Teams Data: " + data);
                    showTeam(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_TEAMS)
        .then(data => {
            showTeam(data);
        })
        .catch(error => {
            console.log(error)
        })
}

const showTeam = data => {
    dataTeam = data;
    const str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);

    let html = "";
    const teamElement = document.getElementById("homeTeam");

    data.teams.forEach(teams => html += teamHtml(teams));
    teamElement.innerHTML = html;
}

const saveTeams = () => {
    const teams = getSaveTeams();
    teams.then(data => {
        let html = "";
        const saveTeamElement = document.getElementById("save-team");
        data.forEach(teams => html += teamSaveHtml(teams));
        saveTeamElement.innerHTML = html;
    })

}

const saveMatch = () => {
    const match = getSaveMatch();
    match.then(data => {
        matchData = data;
        let html = "";
        const saveMatchElement = document.getElementById("save-match");
        data.forEach(matches => html += matchSaveHtml(matches));
        saveMatchElement.innerHTML = html;
    })

}

// BUTTON
const simpanTim = teamID => {
    const team = dataTeam.teams.filter(elteam => elteam.id == teamID)[0];

    insertTeam(team);
}

const hapusTim = teamID => {
    deleteTeam(teamID);
}

const simpanJadwal = matchID => {
    const match = dataMatch.matches.filter(elMatch => elMatch.id == matchID)[0]
    insertMatch(match);
}

const hapusJadwal = matchID => {
    delMatch(matchID);
}

// H T M L
function matchHtml(matches) {
    const date = matches.utcDate.substring(0, 10);
    const time = matches.utcDate.substring(11, 16);
    const matchID = matches.id;
    return `<div class="col s12 m6">
				<div class="card">
					<div class="card-content">
						<div class="row">
							<div class="col s12 m12 center">
								<h6>Matchday ${matches.matchday}</h6>
								<p>${date}  ||  ${time}</p>
							</div>
						</div>
						<div class="row">
							<div class="col s12 m5 center">
								<strong>${matches.homeTeam.name}</strong>
							</div>
							<div class="col s12 m2 center">
								<h6>VS</h6>
							</div>
							<div class="col s12 m5 center">
								<strong>${matches.awayTeam.name}</strong>
							</div>
						</div>
						<div class="card-action right-align ">
							<a class="waves-effect waves-light btn-small blue " onclick="simpanJadwal(${matchID})" id="saveMatch">Simpan</a>
						</div>
					</div>
				</div>
			</div>`
}

function teamHtml(teams) {
    const teamID = teams.id;
    return `<div class="col s12 m6 l4">
				<div class="card">		
					<div class=" card-image">
					<img src="${teams.crestUrl.replace(/^http:\/\//i, 'https://')} "responsive-img" height="178px" alt="badge"/>
					<a class="btn-floating halfway-fab waves-effect waves-light blue center-align" onclick="simpanTim(${teamID})" id="saveTeam"><i class="material-icons">add</i></a>
					</div>
					<div class="card-content">
						<span class="card-title black-text center"><h5>${teams.name}</h5></span>
						<ul class="collection">
							<li class="collection-item"><strong>Shortname : </strong>${teams.shortName}</li>
							<li class="collection-item"><strong>Founded : </strong>${teams.founded}</li>
							<li class="collection-item"><strong>Stadium : </strong><br>${teams.venue}</li>
							<li class="collection-item"><strong>Website : </strong><br>${teams.website}</li>
						</ul>
					</div>	
				</div>
			</div>`
}

function teamSaveHtml(teams) {
    const teamID = teams.id;
    return `<div class="col s12 m6 l4">
				<div class="card">		
					<div class=" card-image">
					<img src="${teams.crestUrl.replace(/^http:\/\//i, 'https://')} "responsive-img" height="178px" alt="badge"/>
					<a class="btn-floating halfway-fab waves-effect waves-light blue center-align" onclick="hapusTim(${teamID})" id="hapusTeam"><i class="material-icons red">clear</i></a>
					</div>
					<div class="card-content">
						<span class="card-title black-text center"><h5>${teams.name}</h5></span>
						<ul class="collection">
							<li class="collection-item"><strong>Shortname : </strong>${teams.shortName}</li>
							<li class="collection-item"><strong>Founded : </strong>${teams.founded}</li>
							<li class="collection-item"><strong>Stadium : </strong><br>${teams.venue}</li>
							<li class="collection-item"><strong>Website : </strong><br>${teams.website}</li>
						</ul>
					</div>	
				</div>
			</div>`
}

function matchSaveHtml(matches) {
    const date = matches.utcDate.substring(0, 10);
    const time = matches.utcDate.substring(11, 16);
    const matchID = matches.id;
    return `<div class="col s12 m6">
				<div class="card">
					<div class="card-content">
						<div class="row">
							<div class="col s12 m12 center">
								<h6>Matchday ${matches.matchday}</h6>
								<p>${date}  ||  ${time}</p>
							</div>
						</div>
						<div class="row">
							<div class="col s12 m5 center">
								<strong>${matches.homeTeam.name}</strong>
							</div>
							<div class="col s12 m2 center">
								<h6>VS</h6>
							</div>
							<div class="col s12 m5 center">
								<strong>${matches.awayTeam.name}</strong>
							</div>
						</div>
						<div class="card-action right-align ">
							<a class="waves-effect waves-light btn-small red " onclick="hapusJadwal(${matchID})" id="delMatch">Hapus</a>
						</div>
					</div>
				</div>
			</div>`
}