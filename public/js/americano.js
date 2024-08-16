var picker;

// CREATE AMERICANO PAGE
$$(document).on("page:init", '.page[data-name="create-americano"]', function (e) {

    if (picker) {
        picker.destroy(); // Clean up the picker when the page is about to be destroyed
        picker = null;
    }
    
    picker = app.picker.create({
        inputEl: "#picker-number-of-players",
        cols: [
        {
            textAlign: "center",
            values: ["4", "5", "6", "8"],
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
        console.log(formData);
      
        // Send form data using fetch
        fetch('https://americanotennis.com/api/americano/generateRounds', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Convert form data to JSON
        })
            .then(response => {
                console.log('response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                localStorage.setItem('americano-game', JSON.stringify(data.americano));
                app.toast.create({
                    text: 'Form submitted successfully!',
                    closeTimeout: 2000,
                }).open();
                 // Navigate to another page after the toast
                setTimeout(function () {
                    app.views.main.router.navigate('/americano-game/');
                }, 2000); // Wait for the toast to disappear
            })
            .catch(error => {
                console.error('Error:', error);
                app.toast.create({
                    text: 'Error submitting form. Please try again.',
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
        <td class="numeric-cell">${player.gPlus-player.gMinus}</td>
        <td class="numeric-cell">${player.tPlus}</td>
        <td class="numeric-cell">${player.tMinus}</td>
        `;

        // Append the row to the table body
        document.querySelector('#playerStatsTableBody').appendChild(row);
    });
}

function convertPlayersToObjects(playerNames) {
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

function generateRoundsTable(roundsData) {
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
                  <div class="stepper stepper-init">
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
                  <div class="stepper stepper-init">
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
                  <div class="stepper stepper-init">
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
                  <div class="stepper stepper-init">
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
        app.stepper.create({ el: el });
    });
}

$$(document).on("page:init", '.page[data-name="americano-game"]', function (e) {

    // Get data from localstorage and convert it to JSON
    const americanoGame = localStorage.getItem('americano-game');
    const gameData = JSON.parse(americanoGame);

    console.log("gameData", gameData);

    var players = convertPlayersToObjects(gameData.players);
    populatePlayerStats(players);

    // Call the function to generate the rounds
    generateRoundsTable(gameData.rounds);
});
// END OF AMERICANO PAGE

