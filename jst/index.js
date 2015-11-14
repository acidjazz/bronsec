var Index;

Index = {
  i: function() {
    console.log('Index.i()');
    return Index.handlers();
  },
  handlers: function() {
    return $('.logo, .menu > .item').on('click', Index.menu);
  },
  menu: function() {
    var section;
    section = $(".section." + ($(this).data('section')));
    $('html, body').animate({
      scrollTop: section.offset().top - 74
    }, 200);
    $('.menu > .item').removeClass('active');
    return $(this).addClass('active');
  }
};
