var picker;


$$(document).on('page:afterin', function (e, page) {
    if (page.name === "create-americano") {
    //   console.log("create-americano page detected after it's shown.");
      localStorage.clear(); // Only clears localStorage after the page is shown
      console.log("localstorage is cleared");
    }
  });

// CREATE AMERICANO PAGE
$$(document).on("page:init", '.page[data-name="create-americano"]', function (e, page) { 

    if (picker) {
        picker.destroy(); // Clean up the picker when the page is about to be destroyed
        picker = null;
    }
    
    picker = app.picker.create({
        inputEl: "#picker-number-of-players",
        cols: [
        {
            textAlign: "center",
            values: ["4", "5", "6"],
        },
        ],
        // Set default value
        value: ["4"], // Default Value
        // Add the event handler for value changes
        on: {
            change: function (picker, value) {
                // Handle the value change here
                // console.log('Picker value changed to: ', value); 
                // You can do other things here, like updating the UI, etc.
            },
            close: function (picker) {
                // Handle when the picker closes
                // console.log('Picker closed with value: ', picker.value[0]); 
                updatePlayerFields(picker.value[0]);
            }
        }
    });

    const playerNamesDiv = document.getElementById('playerNames');

    function updatePlayerFields(numPlayersInput) {
        // Clear the existing player fields
        playerNamesDiv.innerHTML = '';

        // Get the selected number of players
        const numPlayers = parseInt(numPlayersInput);

        // Generate input fields for each player
        for (let i = 1; i <= numPlayers; i++) {
            const playerInput = document.createElement('input');
            playerInput.type = 'text';
            playerInput.placeholder = `Player Name ${i}`;
            playerInput.name = `player${i}`;

            playerNamesDiv.appendChild(playerInput);
        }
    }

    updatePlayerFields(4);
    
    $$('#createAmericano').on('submit', function (e) {
        e.preventDefault();
      
        var formData = app.form.convertToData('#createAmericano'); // Convert form data to object
        const isPrivate = document.querySelector('#createAmericano input[name="isPrivate"]').checked;
        // Append the checkbox value to the formData object
        formData.isPrivate = isPrivate; // Use dot notation or bracket notation
      
        // Send form data using fetch
        fetch('/api/americano/generateRounds', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Convert form data to JSON
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // console.log('Success:', data.americano);
                localStorage.setItem('americano-game', JSON.stringify(data.americano));
                app.toast.create({
                    text: 'Americano game ready! Just a sec...',
                    position: "center",
                    closeTimeout: 2000,
                }).open();
                 // Navigate to another page after the toast
                setTimeout(function () {
                    app.views.main.router.navigate('/americano-game/'+data.americano.title);
                }, 2000); // Wait for the toast to disappear
            })
            .catch(error => {
                console.error('Error:', error);
                app.toast.create({
                    text: 'Error creating game. Please try again.',
                    position: "center",
                    closeTimeout: 2000,
                }).open();
            });
    });
    
});
// END OF AMERICANO PAGE

// AMERICANO GAME PAGE 
// Function to populate the table with player stats
function populatePlayerStats(players) {
    // Clear the current table content
    $$('#playerStatsTableBody').html('');

    // Sort the players based on the ranking rules
    players.sort((a, b) => {
        // Compare by gPlus (higher is better)
        if (b.gPlus !== a.gPlus) {
            return b.gPlus - a.gPlus;
        }
        // If gPlus is the same, compare by gMinus (lower is better)
        if (a.gMinus !== b.gMinus) {
            return a.gMinus - b.gMinus;
        }
        // If gPlus and gMinus are the same, compare by gPlus - gMinus (higher is better)
        const diffA = a.gPlus - a.gMinus;
        const diffB = b.gPlus - b.gMinus;
        if (diffA !== diffB) {
            return diffB - diffA;
        }
        // If still the same, compare by tPlus (higher is better)
        if (b.tPlus !== a.tPlus) {
            return b.tPlus - a.tPlus;
        }
        // If still the same, compare by tMinus (lower is better)
        if (a.tMinus !== b.tMinus) {
            return a.tMinus - b.tMinus;
        }
        // If all above are the same, sort alphabetically by name
        return a.name.localeCompare(b.name);
    });

    // Now assign ranks, making sure to handle ties
    let currentRank = 1;
    players.forEach((player, index) => {
        if (index === 0) {
            player.rank = currentRank;
        } else {
            // Compare with the previous player to determine if they have the same rank
            const previousPlayer = players[index - 1];
            if (
                previousPlayer.gPlus === player.gPlus &&
                previousPlayer.gMinus === player.gMinus &&
                (previousPlayer.gPlus - previousPlayer.gMinus) === (player.gPlus - player.gMinus) &&
                previousPlayer.tPlus === player.tPlus &&
                previousPlayer.tMinus === player.tMinus
            ) {
                // Same rank as previous player
                player.rank = currentRank;
            } else {
                // Increment rank for the current player
                currentRank = index + 1;
                player.rank = currentRank;
            }
        }
    });

    // Use native DOM manipulation or ensure the string is treated as HTML
    players.forEach(function(player) {
        // Create a new row element
        var row = document.createElement('tr');
        
        // Set the innerHTML for the row
        row.innerHTML = `
        <td class="label-cell">${player.rank}</td>
        <td class="label-cell">${player.name}</td>
        <td class="numeric-cell">${player.gPlus}</td>
        <td class="numeric-cell">${player.gMinus}</td>
        <td class="numeric-cell">${player.gPlus - player.gMinus}</td>
        <td class="numeric-cell">${player.tPlus}</td>
        <td class="numeric-cell">${player.tMinus}</td>
        `;

        // Append the row to the table body
        document.querySelector('#playerStatsTableBody').appendChild(row);
    });
}

function initiatePlayerStats(playerNames) {
    // Create a new array of player objects with rank and initial stats
    return playerNames.map((name, index) => ({
      rank: index + 1,    // Rank is the index + 1
      name: name,         // Use the player's name
      gPlus: 0,           // Initialize gPlus to 0
      gMinus: 0,          // Initialize gMinus to 0
      tPlus: 0,           // Initialize tPlus to 0
      tMinus: 0           // Initialize tMinus to 0
    }));
}

function generateRoundsTable(roundsData, players) {
    // Check if there is saved players data in localStorage
    const savedPlayers = localStorage.getItem('playersData');
    if (savedPlayers) {
        players = JSON.parse(savedPlayers); // Parse and restore saved players data
    }

    var roundsHtml = ''; // This will store the complete HTML for all rounds

    roundsData.forEach(function(roundData) {
        // Start building the HTML for each round
        roundsHtml += `
        <div class="light-gray-title centered-text">Round ${roundData.round}</div>
        <table class="data-table">
            <thead class="centered-text">
                <tr>
                    <th class="label-cell">Tiebreak</th>
                    <th class="label-cell"></th>
                    <th class="label-cell">Games</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="label-cell">
                        <div>
                            <div class="stepper stepper-init" id="tiebreak-round${roundData.round}-team1" data-type="tiebreak" data-round="${roundData.round}" data-team="1">
                                <div class="stepper-button-minus"></div>
                                <div class="stepper-input-wrap">
                                    <input type="text" value="0" min="0" max="100" step="1" readonly>
                                </div>
                                <div class="stepper-button-plus"></div>
                            </div>
                        </div>
                    </td>
                    <td class="label-cell centered-text">${roundData.team1.join(' & ')}</td>
                    <td class="numeric-cell">
                        <div>
                            <div class="stepper stepper-init" id="game-round${roundData.round}-team1" data-type="game" data-round="${roundData.round}" data-team="1">
                                <div class="stepper-button-minus"></div>
                                <div class="stepper-input-wrap">
                                    <input type="text" value="0" min="0" max="100" step="1" readonly>
                                </div>
                                <div class="stepper-button-plus"></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="label-cell">
                        <div>
                            <div class="stepper stepper-init" id="tiebreak-round${roundData.round}-team2" data-type="tiebreak" data-round="${roundData.round}" data-team="2">
                                <div class="stepper-button-minus"></div>
                                <div class="stepper-input-wrap">
                                    <input type="text" value="0" min="0" max="100" step="1" readonly>
                                </div>
                                <div class="stepper-button-plus"></div>
                            </div>
                        </div>
                    </td>
                    <td class="label-cell centered-text">${roundData.team2.join(' & ')}</td>
                    <td class="numeric-cell">
                        <div>
                            <div class="stepper stepper-init" id="game-round${roundData.round}-team2" data-type="game" data-round="${roundData.round}" data-team="2">
                                <div class="stepper-button-minus"></div>
                                <div class="stepper-input-wrap">
                                    <input type="text" value="0" min="0" max="100" step="1" readonly>
                                </div>
                                <div class="stepper-button-plus"></div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>`;
    });
  
    // Append the generated HTML to a container element
    $$('#roundsContainer').html(roundsHtml);
  
    // Dynamically initialize all new steppers within the new content
    $$('.stepper').each(function (el) {
        const stepperEl = el; // Directly use el instead of querying it again

        // Retrieve initial value from localStorage if it exists
        let savedValue = localStorage.getItem(stepperEl.id);
        savedValue = savedValue !== null ? parseInt(savedValue) : 0;
        stepperEl.querySelector('input').value = savedValue;

        // Store the previous value for difference calculation
        let previousValue = savedValue;

        app.stepper.create({
            el: stepperEl,
            on: {
                change: function (stepper, value) {
                    const type = stepper.el.dataset.type;
                    const round = stepper.el.dataset.round;
                    const team = stepper.el.dataset.team;
                    const id = stepper.el.id;

                    // Save the new stepper value to localStorage
                    localStorage.setItem(id, value);

                    // Calculate the difference from the previous value
                    const difference = value - previousValue;

                    // Update the previous value to the current value
                    previousValue = value;

                    // Get the teams involved
                    const team1Players = roundsData[round - 1].team1;
                    const team2Players = roundsData[round - 1].team2;

                    // Update the player stats based on the type and team
                    team1Players.forEach(playerName => {
                        const player = players.find(p => p.name === playerName);
                        if (player) {
                            if (type === 'game' && team === '1') {
                                player.gPlus += difference; // Accumulate the difference in gPlus for team 1
                            } else if (type === 'game' && team === '2') {
                                player.gMinus += difference; // Accumulate the difference in gMinus for team 1
                            } else if (type === 'tiebreak' && team === '1') {
                                player.tPlus += difference; // Accumulate the difference in tPlus for team 1
                            } else if (type === 'tiebreak' && team === '2') {
                                player.tMinus += difference; // Accumulate the difference in tMinus for team 1
                            }
                        }
                    });

                    team2Players.forEach(playerName => {
                        const player = players.find(p => p.name === playerName);
                        if (player) {
                            if (type === 'game' && team === '1') {
                                player.gMinus += difference; // Accumulate the difference in gMinus for team 2
                            } else if (type === 'game' && team === '2') {
                                player.gPlus += difference; // Accumulate the difference in gPlus for team 2
                            } else if (type === 'tiebreak' && team === '1') {
                                player.tMinus += difference; // Accumulate the difference in tMinus for team 2
                            } else if (type === 'tiebreak' && team === '2') {
                                player.tPlus += difference; // Accumulate the difference in tPlus for team 2
                            }
                        }
                    });

                    // Save the updated players data to localStorage
                    localStorage.setItem('playersData', JSON.stringify(players));

                    // Update the UI with the updated players array
                    populatePlayerStats(players);
                    
                    // console.log("Updated players", players);
                }
            }
        });
        // Initialize the all-rounds-game data from localStorage or create a new array if not found

    });
}

$$(document).on("page:init", '.page[data-name="americano-game"]', function (e, page) {
    // console.log("hai", page.route.params.id)
    const gameID = page.route.params.id;

    // Use setTimeout to ensure the element is rendered if needed (try without first)
    setTimeout(() => {
        const titleElement = document.getElementById("game-title");
        if (titleElement) {
            titleElement.innerHTML = `${gameID}'s Game`;
        } else {
            console.error("Title element not found");
        }
    }, 100); // Adjust the delay if needed
    
    $$('.toolbar').css('display', 'none');

    // Get data from localStorage and convert it to JSON
    const americanoGame = localStorage.getItem('americano-game');

    // Check if there's no data in localStorage
    if (!americanoGame) {
        // Redirect to another page (replace '/home/' with your desired URL)
        app.views.main.router.navigate('/create-americano/');
        return;  // Stop further execution
    }

    const gameData = JSON.parse(americanoGame);

    var players = initiatePlayerStats(gameData.players);

    const savedPlayers = localStorage.getItem('playersData');
    if (savedPlayers) {
        players = JSON.parse(savedPlayers); // Parse and restore saved players data
    }
    populatePlayerStats(players);

    // Call the function to generate the rounds
    generateRoundsTable(gameData.rounds, players);

    $$('#americano-done').off('click').on('click', function() {
        // console.log("gameData", gameData.isPrivate)
        var tableBody = document.getElementById('playerStatsTableBody');
        var tableData = [];
    
        tableBody.querySelectorAll('tr').forEach(function(row) {
            var rowData = [];
            row.querySelectorAll('td').forEach(function(cell) {
                rowData.push(cell.textContent);
            });
            tableData.push(rowData);
        });
    
        console.log("gameData", gameData);

        const data = {
            game: gameID,
            data: tableData,
            community: "unknown",
            isPrivate: gameData.isPrivate
          };

          console.log("data", data);

        fetch('/api/game-standing', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
          })
          .then(responseData => {
            console.log('Success:', responseData);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    });
});

// END OF AMERICANO PAGE

