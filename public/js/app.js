/*------------------------------------------------------------------

[Table of contents]

1. General
2. Dialog
3. Infinite Scroll
4. Notification
5. Photo Browser
6. Picker
7. Preloader
8. Pull To Refresh
9. Range Slider
10. Toasts
11. Chat
12. Calendar
13. Onboarding
14. Swiper
15. Switch Theme

------------------------------------------------------------------*/

// 1. General

"use strict";

var $$ = Dom7;

var app = new Framework7({
  el: "#app",
  name: "Americano",
  theme: "ios",
  iosTranslucentBars: false,
  iosTranslucentModals: false,
  view: {
    browserHistory: true,
    browserHistoryAnimate: Framework7.device.ios ? false : true
  },
  routes: [
    // Features
    {
      path: "/",
      url: "index.html",
      on: {
        pageInit: function (e, page) {
          fetch('/api/game-standing?community=OHT', {
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
            // console.log(mergeGameDataWithMatchDetails(apiData));
            const alltimehigh = mergeGameDataWithMatchDetails(apiData)
            populateTable(alltimehigh);
          })
          .catch(error => {
            console.error('Error:', error);
          });

          function populateTable(data) {
            // Select the table body
            const tableBody = document.getElementById("alltimescore");
          
            // Clear existing rows
            tableBody.innerHTML = '';
          
            // Loop through the data array
            data.forEach(item => {
              // Create a new row element
              const row = document.createElement('tr');
          
              // Create cells and add data to each one
              item.forEach(cellData => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                row.appendChild(cell);
              });
          
              // Append the row to the table body
              tableBody.appendChild(row);
            });
          }
        }
      }
    },
    {
      path: "/create-americano/",
      url: "pages/americano/create.html",
    },
    {
      path: "/americano-game/:id",
      url: "pages/americano/game.html",
    },
    {
      path: "/oht/",
      url: "pages/americano/links.html",
      keepAlive: true,
    },
    {
      path: "/search/",
      url: "pages/americano/search.html",
      on: {
        pageInit: function (e, page) {
          console.log("we're in search here");
    
          // Pull to refresh container
          var pullToRefreshPage = $$(".ptr-content");
    
          // Add 'refresh' listener on it
          pullToRefreshPage.on("ptr:refresh", function (e) {
            // Simulate 2s loading
            setTimeout(function () {
              // Trigger the fetch logic when pull-to-refresh is triggered
              fetchData();
            }, 2000);
          });
    
          // Initial fetch when the page is loaded
          fetchData();
    
          function fetchData() {
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
                  linkHref: `/result/${item.id}`,  // `/result/${item.game}`
                  itemAfter: item.isprivate === true ? "private" : "public"
                };
              });
    
              // Call a function to populate the list (assuming you have a function for this)
              populateList(transformedData);
              
              // Reset PTR after loading is done
              app.ptr.done(pullToRefreshPage);
            })
            .catch(error => {
              console.error('Error:', error);
              // Ensure PTR is also reset in case of an error
              app.ptr.done(pullToRefreshPage);
            });
          }
        },
      },
    },    
    {
      path: "/result/:id",
      url: "pages/americano/result.html",
      on: {
        pageInit: function (e, page) {
          const ID = page.route.params.id;

          function populatePlayerStatsTable(apiData) {
            console.log("apiData --",apiData)

            setTimeout(() => {
              const titleElement = document.getElementById("result-title");
              if (titleElement) {
                  titleElement.innerHTML = `${apiData[0].game}'s by ${apiData[0].community}`;
              } else {
                  console.error("Title element not found");
              }
            }, 100); // Adjust the delay if needed

            // Select the table body element
            const tableBody = document.getElementById("playerStatsTableBody");
          
            // Clear existing rows in case of refresh
            tableBody.innerHTML = '';
          
            // Loop through the data array from the API
            apiData[0].data.forEach(player => {
              // Create a new row
              const row = document.createElement('tr');
          
              // Add each player's data as table cells
              row.innerHTML = `
                <td class="label-cell">${player[0]}</td>  <!-- Rank -->
                <td class="label-cell">${player[1]}</td>  <!-- Name -->
                <td class="numeric-cell">${player[2]}</td> <!-- G+ -->
                <td class="numeric-cell">${player[3]}</td> <!-- G- -->
                <td class="numeric-cell">${player[4]}</td> <!-- G+- -->
                <td class="numeric-cell">${player[5]}</td> <!-- T+ -->
                <td class="numeric-cell">${player[6]}</td> <!-- T- -->
              `;
          
              // Append the row to the table body
              tableBody.appendChild(row);
            });
          }

          fetch('/api/game-standing/'+ID, {
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
            console.log("apiData", apiData)
            populatePlayerStatsTable(apiData);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }
      }
    },
    {
      path: "/discover/",
      url: "pages/americano/discover.html",
    },
    {
      path: "/404/",
      url: "pages/americano/404.html",
      keepAlive: true,
    },
    {
      path: "/what-is-americano-tennis/",
      url: "pages/americano/whatis.html",
    },
  ],
});

// tab-link
// Handle tab link click
$$('.tab-link').on('click', function () {
  // Remove active class from all tab links
  $$('.tab-link').removeClass('tab-link-active');
  // Add active class to the clicked tab link
  $$(this).addClass('tab-link-active');
});
// On page load, set the active tab from localStorage
const activeTab = localStorage.getItem('activeTab');
if (activeTab) {
  $$('.tab-link').removeClass('tab-link-active');
  $$(`.tab-link[href="${activeTab}"]`).addClass('tab-link-active');
}

// 2. Dialog

$$(document).on("page:init", '.page[data-name="dialog"]', function (e) {
  $$(".open-alert").on("click", function () {
    app.dialog.alert("Your subscription has been confirmed.");
  });

  $$(".open-confirm").on("click", function () {
    app.dialog.confirm("Confirm your subscription?", function () {
      app.dialog.alert("Confirmed!");
    });
  });
});

// 3. Infinite Scroll

$$(document).on("page:init", '.page[data-name="infinite-scroll"]', function (e) {
  var allowInfinite = true; // Loading flag
  var lastItemIndex = $$(".infinite-scroll-demo .post-horizontal").length; // Last loaded index
  var maxItems = 30; // Max items to load
  var itemsPerLoad = 5; // Append items per load

  // Attach 'infinite' event handler
  $$(".infinite-scroll-content").on("infinite", function () {
    if (!allowInfinite) return; // Exit, if loading in progress
    allowInfinite = false; // Set loading flag

    // Emulate 2s loading
    setTimeout(function () {
      allowInfinite = true; // Reset loading flag

      if (lastItemIndex >= maxItems) {
        // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
        app.infiniteScroll.destroy(".infinite-scroll-content");
        // Remove preloader from the DOM
        $$(".infinite-scroll-preloader").remove();
        return;
      }

      // Simulate new items generation
      var html = "";
      for (var i = lastItemIndex + 1; i <= lastItemIndex + itemsPerLoad; i++) {
        html +=
          '<a href="/single/" class="link post-horizontal">' +
          '<div class="infos">' +
          '<div class="post-category">Fashion</div>' +
          '<div class="post-title">The Importance of Supporting Local and Independent Fashion Brands</div>' +
          '<div class="post-date">2 hours ago</div>' +
          "</div>" +
          '<div class="post-image">' +
          (i + 1) +
          "</div>" +
          "</a>";
      }

      $$(".infinite-scroll-demo").append(html); // Append new items
      lastItemIndex = $$(".infinite-scroll-demo .post-horizontal").length; // Update last loaded index
    }, 2000);
  });
});

// 4. Notification

$$(document).on("page:init", '.page[data-name="notifications"]', function (e) {
  // Create notification with close button
  var notification = app.notification.create({
    icon: '<img src="img/avatars/small-avatar.jpg" alt="" class="notification-image" />',
    title: "Yui Mobile",
    subtitle: "Noah Campbell has started following you!",
    text: "Follow him back to expand your network!",
    closeButton: true,
  });

  // Open Notification
  $$(".open-notification").on("click", function () {
    notification.open();
  });
});

// 5. Photo Browser

$$(document).on("page:init", '.page[data-name="photo-browser"]', function (e) {
  var photoBrowserDark = app.photoBrowser.create({
    photos: ["img/images/1.jpg", "img/images/2.jpg", "img/images/3.jpg", "img/images/4.jpg", "img/images/5.jpg"],
    theme: "dark",
  });
  $$(".photo-browser-demo").on("click", function () {
    photoBrowserDark.open();
  });
});

// 6. Picker

$$(document).on("page:init", '.page[data-name="picker"]', function (e) {
  var pickerDevice = app.picker.create({
    inputEl: "#demo-picker-language",
    cols: [
      {
        textAlign: "center",
        values: ["Spanish", "English", "Arabic", "Hindi", "Portuguese", "Russian", "Japanese", "German"],
      },
    ],
  });
  var pickerMonth = app.picker.create({
    inputEl: "#demo-picker-month",
    cols: [
      {
        textAlign: "center",
        values: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      },
    ],
  });
  var pickerDay = app.picker.create({
    inputEl: "#demo-picker-day",
    cols: [
      {
        textAlign: "center",
        values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
      },
    ],
  });
  var pidckerYear = app.picker.create({
    inputEl: "#demo-picker-year",
    cols: [
      {
        textAlign: "center",
        values: ["1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005"],
      },
    ],
  });
});

// 7. Preloader

$$(document).on("page:init", '.page[data-name="preloader"]', function (e) {
  $$(".open-preloader").on("click", function () {
    app.preloader.show();
    setTimeout(function () {
      app.preloader.hide();
    }, 2000);
  });
});

// 8. Pull To Refresh

$$(document).on("page:init", '.page[data-name="pull-to-refresh"]', function (e) {
  var pullToRefreshPage = $$(".ptr-content");
  // Add 'refresh' listener on it
  pullToRefreshPage.on("ptr:refresh", function (e) {
    // Emulate 2s loading and generate new items
    setTimeout(function () {
      var html =
        '<a href="/single/" class="link post-horizontal">' +
        '<div class="infos">' +
        '<div class="post-category">Fashion</div>' +
        '<div class="post-title">The Importance of Supporting Local and Independent Fashion Brands</div>' +
        '<div class="post-date">2 hours ago</div>' +
        "</div>" +
        '<div class="post-image">NEW</div>' +
        "</a>";
      // Prepend new element
      pullToRefreshPage.find(".post-list").prepend(html);
      // When loading done, we reset it
      app.ptr.done();
    }, 2000);
  });
});

// 9. Range Slider

$$(document).on("page:init", '.page[data-name="range-slider"]', function (e) {
  $$("#age-filter").on("range:change", function (e, range) {
    $$(".age-value").text(range[0] + " - " + range[1]);
  });
  $$("#price-filter").on("range:change", function (e, range) {
    $$(".price-value").text("$" + range[0] + " - $" + range[1]);
  });
});

// 10. Toasts

$$(document).on("page:init", '.page[data-name="toasts"]', function (e) {
  // Bottom toast
  var toastBottom = app.toast.create({
    text: "Thank you for your subscription!",
    closeTimeout: 2000,
  });
  $$(".open-toast-bottom").on("click", function () {
    toastBottom.open();
  });

  // Top toast
  var toastTop = app.toast.create({
    text: "Thank you for your subscription!",
    position: "top",
    closeTimeout: 2000,
  });
  $$(".open-toast-top").on("click", function () {
    toastTop.open();
  });

  // Center toast
  var toastCenter = app.toast.create({
    text: "Thank you for your subscription!",
    position: "center",
    closeTimeout: 2000,
  });
  $$(".open-toast-center").on("click", function () {
    toastCenter.open();
  });

  // Toast with close button
  var toastWithButton = app.toast.create({
    text: "Thank you for your subscription!",
    closeButton: true,
  });
  $$(".open-toast-button").on("click", function () {
    toastWithButton.open();
  });
});

// 11. Chat

// Initialize chat
$$(document).on("page:init", '.page[data-name="chat"]', function (e) {
  var messages = app.messages.create({
    el: ".messages",
    // Define styling rules, depending on what type of message it is
    firstMessageRule: function (message, previousMessage, nextMessage) {
      if (message.isTitle) return false;
      if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
      return false;
    },
    lastMessageRule: function (message, previousMessage, nextMessage) {
      if (message.isTitle) return false;
      if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
      return false;
    },
  });

  // Init Messagebar
  var messagebar = app.messagebar.create({
    el: ".messagebar",
  });

  // Response flag
  var responseInProgress = false;

  // Send Message
  $$(".send-link").on("click", function () {
    var text = messagebar.getValue().replace(/\n/g, "<br>").trim();

    // return if empty message
    if (!text.length) return;

    // Clear area
    messagebar.clear();

    // Return focus to area
    messagebar.focus();

    // Add message to messages
    messages.addMessage({
      text: text,
    });

    if (responseInProgress) return;
    // Receive dummy message
    receiveMessage();
  });

  function receiveMessage() {
    responseInProgress = true;
    setTimeout(function () {
      // Show typing indicator
      messages.showTyping({
        header: "Jack is typing...",
        avatar: "../img/avatars/5.jpg",
      });

      setTimeout(function () {
        // Add received dummy message
        messages.addMessage({
          text: "Amazing!!!",
          type: "received",
          avatar: "../img/avatars/5.jpg",
        });
        // Hide typing indicator
        messages.hideTyping();
        responseInProgress = false;
      }, 2000);
    }, 500);
  }
});

// 12. Calendar

$$(document).on("page:init", '.page[data-name="calendar"]', function (e) {
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var calendarInline = app.calendar.create({
    containerEl: "#calendar",
    value: [new Date()],
    weekHeader: false,
    renderToolbar: function () {
      return (
        '<div class="toolbar calendar-custom-toolbar no-shadow">' +
        '<div class="toolbar-inner">' +
        '<div class="left">' +
        '<a href="#" class="link icon-only"><i class="icon icon-back ' +
        (app.theme === "md" ? "color-black" : "") +
        '"></i></a>' +
        "</div>" +
        '<div class="center"></div>' +
        '<div class="right">' +
        '<a href="#" class="link icon-only"><i class="icon icon-forward ' +
        (app.theme === "md" ? "color-black" : "") +
        '"></i></a>' +
        "</div>" +
        "</div>" +
        "</div>"
      );
    },
    on: {
      init: function (c) {
        $$(".calendar-custom-toolbar .center").text(monthNames[c.currentMonth] + ", " + c.currentYear);
        $$(".calendar-custom-toolbar .left .link").on("click", function () {
          calendarInline.prevMonth();
        });
        $$(".calendar-custom-toolbar .right .link").on("click", function () {
          calendarInline.nextMonth();
        });
      },
      monthYearChangeStart: function (c) {
        $$(".calendar-custom-toolbar .center").text(monthNames[c.currentMonth] + ", " + c.currentYear);
      },
    },
  });
});

// 13. Onboarding

$$(document).on("page:init", '.page[data-name="onboarding"]', function (e) {
  const swiperEl = document.querySelector(".swiper-onboarding");
  $$(".onboarding-next-button").on("click", () => {
    const totalSlides = swiperEl.swiper.slides.length;
    const currentSlide = swiperEl.swiper.activeIndex + 1;

    console.log(currentSlide + " / " + totalSlides);
    if (currentSlide == totalSlides) {
      app.views.current.router.back();
      return;
    }
    swiperEl.swiper.slideNext();

    if (currentSlide == totalSlides - 1) {
      $$(".onboarding-next-button").text("Start!");
      //$$(".onboarding-next-button").addClass("Start!");
    }
  });
});

// 14. Swiper

$$("swiper-slide a").on("click", function () {
  app.views.current.router.navigate($$(this).attr("data-href"));
});
$$(document).on("page:init", function (e) {
  $$("swiper-slide a").on("click", function () {
    app.views.current.router.navigate($$(this).attr("data-href"));
  });
});

// 15. Switch Theme

$$(".switch-theme").on("click", function () {
  $$(".page").toggleClass("page-theme-transition");
  $$(".page").transitionEnd(function(){
    $$(".page").toggleClass("page-theme-transition");
  });
  if ($$("body").hasClass("dark")) {
    $$(".switch-theme i").text("moon_stars");
  } else {
    $$(".switch-theme i").text("sun_max");
  }
  $$("body").toggleClass("dark");
});

// 16. Preload Pages

function preloadPages() {
  const pages = app.routes.map((route) => route.url);

  for (const page of pages) {
    fetch(page)
      .then((response) => response.text())
      .then((content) => {
        const xhrEntry = {
          url: page,
          time: Date.now(),
          content: content,
        };
        app.router.cache.xhr.push(xhrEntry);
      })
      .catch((error) => console.error(error));
  }
}

preloadPages();

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
//       console.log('Service Worker registered with scope:', registration.scope);
//     }).catch(function(error) {
//       console.log('Service Worker registration failed:', error);
//     });
//   });
// }
