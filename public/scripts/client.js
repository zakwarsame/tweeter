/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Initial data for testing
const data = [
  {
    user: {
      name: "Newton",
      avatars: "https://i.imgur.com/73hZDYK.png",
      handle: "@SirIsaac",
    },
    content: {
      text: "If I have seen further it is by standing on the shoulders of giants",
    },
    created_at: 1461116232227,
  },
  {
    user: {
      name: "Descartes",
      avatars: "https://i.imgur.com/nlhLi3I.png",
      handle: "@rd",
    },
    content: {
      text: "Je pense , donc je suis",
    },
    created_at: 1461113959088,
  },
];

// Iterates through tweets and appends them

const renderTweets = function (tweets) {
  for (let tweetObj of tweets) {
    const $tweet = createTweetElement(tweetObj);
    $("#tweets-container").append($tweet).slideDown("slow");
  }
};

// loads tweets but first removes so that there aren't duplicates of the same element
const loadTweets = function () {
  $(".tweets").remove();
  $.get("/tweets")
    .then((tweets) => {
      $("#tweets-container").empty();
      tweets.sort((a, b) => b.created_at - a.created_at);
      renderTweets(tweets);
    })
    .fail(() => {
      showErrorMessage("There has been a problem loading tweets.");
    });
};

// Checks the input text and if there is no text, displays error
const tweetValidation = function (paramsString) {
  const formParam = new URLSearchParams(paramsString);
  const params = formParam.get("text");
  let errorText = "";
  if (!params) {
    errorText = "Please input your thoughts.";
  }
  if (params.length > 140) {
    errorText = "Input cannot be longer than 140 characters";
  }

  if (errorText !== "") {
    errorHandling(errorText);
    return false;
  }
  return true;
};

// Handles error
const errorHandling = function (errorMsg) {
  $("#error span").text(errorMsg);
  $("#error").slideDown("slow", function () {
    setTimeout(() => {
      $("#error").slideUp("slow");
    }, 5000);
  });
};

// avoiding cross site attacks XSS
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Element content that will be appended to the <article> section of the html
const createTweetElement = function (tweetObj) {
  return `
    <div class="card tweet">
        <header class="tweeting-user">
            <img src="${escape(tweetObj.user.avatars)}" alt="default avatar">
            <span id="username">${escape(tweetObj.user.name)}</span>
            <div id="user-handle">${escape(tweetObj.user.handle)}</div>
        </header>
        <div class="main-tweet">
            ${escape(tweetObj.content.text)}
        </div>
            <hr class="tweet-line">
        <footer class="tweet-footer">
          <div id="days">${escape(timeago.format(tweetObj.created_at))}</div>
            <div class="tweet-icons">
                <i class="fas fa-flag i1 fa-sm"></i>
                <i class="fas fa-retweet i2 fa-sm"></i>
                <i class="fas fa-heart i3 fa-sm"></i>
            </div>
        </footer>
    </div>
    `;
};

// displays and animates little scroll button that shows up at the bottom
$(window).scroll(function () {
  if ($(this).scrollTop() > 100) {
    $(".scroll-btn").css("display", "flex");
    $(".scroll-btn").fadeIn();
  } else {
    $(".scroll-btn").fadeOut();
  }
});

$(document).ready(function () {
  // content is first loaded as is
  loadTweets();

  /*
   * When someone submits the form, content is serialized
   * then posted to the server
   * the form is then cleared
   * finally the data is fetched again using loadTweets()
   */

  $("#tweet-form").submit(function (e) {
    e.preventDefault();
    const serialized = $(this).serialize();
    if (tweetValidation(serialized)) {
      $.post("/tweets", serialized).done(function () {
        $("#tweet-form").each(function () {
          this.reset();
        });
        loadTweets();
      });
    }
  });

  /*
   * Below are scroll buttons helping navigate the page
   * first one is the icon at the bottom
   * second one is the arrow at the top. Currently doesn't hide the box
   */

  //Click event to scroll to top
  $(".scroll-btn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 800);
    return false;
  });

  $(".arrow-icon").click(function () {
    $("html, body").animate({ scrollTop: $(".container").offset().top }, 800);
    return false;
  });
});
