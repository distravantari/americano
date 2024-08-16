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
      
        var formData = app.form.convertToData('#createAmericano'); // Convert form data to object
        console.log(formData);
      
        // Send form data using fetch
        fetch('http://localhost:3000/api/americano/generateRounds', {
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


$$(document).on("page:init", '.page[data-name="americano-game"]', function (e) {
    console.log("localstorage", localStorage.getItem("americano-game"));

});

