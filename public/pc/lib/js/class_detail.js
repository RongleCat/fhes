let dot = []
let hash = []
$(function () {
  let $nav = $('.block-nav')
  let navItems = $nav.find('a')
  navItems.map((i, item) => {
    dot.push(parseInt($($(item).attr('href')).offset().top))
    hash.push($(item).attr('href'))
  });

  setNav($nav, $(document).scrollTop())
  setActive(navItems, $(document).scrollTop(), dot)

  console.log(dot, hash);
  $nav.on('click', 'a', function (e) {
    e.preventDefault();
    $(this).addClass('active').siblings().removeClass('active')
    $('html,body').animate({
      scrollTop: ($($(this).attr('href')).offset().top - 170)
    }, 500);
  })



  $(document).on('scroll', function () {
    let top = $(this).scrollTop()
    setNav($nav, top)
    setActive(navItems, top, dot)
  })
})

function setNav(el, top) {
  if (top >= 320) {
    el.addClass('pof')
  } else {
    el.removeClass('pof')
  }
}

function setActive(el, top, arr) {
  let newArr = arr.concat([top])
  let index = newArr.sort(sequence).indexOf(top)
  if (index === 5) {
    index = 4
  }
  el.removeClass('active').eq(index).addClass('active')
  // location.hash = hash[index]
}

function sequence(a, b) {
  return a - b;
}