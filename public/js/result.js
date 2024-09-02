function populateList(data) {
    const listElement = document.getElementById('list-of-result');
  
    // Clear existing list items if needed
    listElement.innerHTML = '';
  
    // Loop through the data array
    data.forEach(item => {
      const listItem = document.createElement('li');
      listItem.className = 'swipeout';
  
      listItem.innerHTML = `
        <div class="swipeout-content">
          <a href="${item.linkHref}" class="item-link item-content link">
            <div class="item-media"><img src="${item.imgSrc}" alt=""></div>
            <div class="item-inner">
              <div class="item-title">
                <div class="item-name">
                  ${item.name}
                  <span class="badge color-dark">${item.badge}</span>
                </div>
                <div class="item-footer">${item.footer}</div>
              </div>
              <div class="item-after">${item.itemAfter}</div>
            </div>
          </a>
        </div>
        <div class="swipeout-actions-right"><a href="#" class="link swipeout-delete">Delete</a></div>
      `;
  
      // Append the newly created list item to the ul
      listElement.appendChild(listItem);
    });
  }
  
  // Example usage
  const data = [
    {
      imgSrc: 'img/avatars/5.jpg',
      name: 'Tes Jameson',
      badge: 'OHT',
      footer: 'Can you send me the report by the end of the day?',
      linkHref: '/result/tes',
      itemAfter: 'Private'
    },
    {
      imgSrc: 'img/avatars/6.jpg',
      name: 'HOLA Doe',
      badge: 'ABC',
      footer: 'Are you coming to the meeting?',
      linkHref: '/result/john',
      itemAfter: 'Work'
    },
    // Add more items as needed
  ];  

  $$(document).on("page:init", '.page[data-name="americano-search"]', function (e, page) {
    console.log("we're in search here");

    fetch('/api/game-standing', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(apiData => {
        // Transform the API data into the format needed by the frontend
        const transformedData = apiData.map(item => {
          return {
            imgSrc: 'img/avatars/6.jpg',  // Static image source (can be dynamic if needed)
            name: item.game,  // Use the game name from the API data
            badge: item.community,  // Use the community from the API data
            footer: `${item.data[0][1]} is the winner`,  // Use the first entry in data array and add "is the winner"
            linkHref: `#`,  // `/result/${item.game}`
            itemAfter: item.isprivate === true ? "private" : "public"
          };
        });
    
        console.log('Transformed Data:', transformedData);
    
        // Call a function to populate the list (assuming you have a function for this)
        populateList(transformedData);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // populateList(data);

  })
  