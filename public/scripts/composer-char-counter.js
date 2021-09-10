$(document).ready(function () {
  $("#tweet-text").on("input", function () {
    const counter = $(this).parent().find(".counter").first();
    const textLength = $(this).val().length
    const limitLength = Number(140) - Number(textLength);
    counter.val(limitLength)
    limitLength < 0 ? counter.css('color', 'red') : counter.css('color', '#61892F');
  });
});