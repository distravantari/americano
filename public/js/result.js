function populateList(data) {
    const listElement = document.getElementById('list-of-result');
  
    // Clear existing list items if needed
    listElement.innerHTML = '';
  
    // Loop through the data array
    data.forEach(item => {
      console.log("item", item)
      const listItem = document.createElement('li');
      listItem.className = 'swipeout';
  
      listItem.innerHTML = `
        <div class="swipeout-content">
          <a href="${item.linkHref}" class="item-link item-content link">
            <div class="item-media"><img src="img/americano/tennis-ball.png" alt=""></div>
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
  