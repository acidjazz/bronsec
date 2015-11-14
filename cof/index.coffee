Index =

  i: ->

    console.log 'Index.i()'

    Index.handlers()

  handlers: ->

    $('.logo, .menu > .item').on 'click', Index.menu


  menu: ->

    section = $(".section.#{$(this).data('section')}")

    $('html, body').animate(
      scrollTop: section.offset().top - 74
    , 200)


    $('.menu > .item').removeClass 'active'
    $(this).addClass 'active'

