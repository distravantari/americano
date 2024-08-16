var picker;

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
            values: ["4", "5", "6", "7", "8", "10"],
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
      
        var formData = app.form.convertToData('#createAmericano');
      
        // Show a toast message
        app.toast.create({
          text: 'Form submitted successfully!',
          closeTimeout: 2000, // Close after 2 seconds
        }).open();
      
        // Navigate to another page after the toast
        setTimeout(function () {
          app.views.main.router.navigate('/americano-game/');
        }, 2000); // Wait for the toast to disappear
    });
});

