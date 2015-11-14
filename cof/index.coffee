Index =

  i: ->

    console.log 'Index.i()'

    Index.handlers()

    if location.hash isnt ''
      Index.menu location.hash.replace '#', ''

  handlers: ->

    $('.logo, .menu > .item').on 'click', Index.menuHandler


  menu: (section) ->

    sectionEl = $(".section.#{section}")

    $('html, body').animate(
      scrollTop: sectionEl.offset().top - 74
    , 200)


    $('.menu > .item, .logo').removeClass 'active'
    $(".i_#{section}").addClass 'active'

  menuHandler: ->
    Index.menu $(this).data 'section'
