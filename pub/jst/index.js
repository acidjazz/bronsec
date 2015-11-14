var Index;

Index = {
  i: function() {
    console.log('Index.i()');
    Index.handlers();
    if (location.hash !== '') {
      return Index.menu(location.hash.replace('#', ''));
    }
  },
  handlers: function() {
    return $('.logo, .menu > .item').on('click', Index.menuHandler);
  },
  menu: function(section) {
    var sectionEl;
    sectionEl = $(".section." + section);
    $('html, body').animate({
      scrollTop: sectionEl.offset().top - 74
    }, 200);
    $('.menu > .item, .logo').removeClass('active');
    return $(".i_" + section).addClass('active');
  },
  menuHandler: function() {
    return Index.menu($(this).data('section'));
  }
};
