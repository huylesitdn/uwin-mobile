function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

// Translator

const LANGUAGES = {
  EN: "en",
  ZH: "zh",
};

var translator = new Translator({
  defaultLanguage: "en",
  detectLanguage: true,
  selector: "[data-i18n]",
  debug: false,
  registerGlobally: "__",
  persist: true,
  persistKey: "preferred_language",
  filesLocation: "assets/i18n",
  // filesLocation: "https://raw.githubusercontent.com/huylesitdn/ob9/main/assets/i18n",
});

const PREFERED_REGION = 'preferred_region';
const _get_translator_config = translator.config.persistKey || "preferred_language";
const _get_language = localStorage.getItem(_get_translator_config) || LANGUAGES.EN;
const _get_region = localStorage.getItem(PREFERED_REGION) || 'Singapore';

translator.fetch([LANGUAGES.EN, LANGUAGES.ZH]).then(() => {
  // -> Translations are ready...
  translator.translatePageTo(_get_language);
  changeLanguageColor();
});

/**
 * MENU SLIDE
 *
 */

$("#navMenu").on("click", function (e) {
  $("#mySidenav").addClass("active");
});

$("#mySidenav .backdrop, #mySidenav a.left-nav__top__nav__item__link, #mySidenav .close-nav").on(
  "click",
  function (e) {
    $("#mySidenav").removeClass("active");
  }
);

const selectLanguageModalElm = $("#selectLanguage");
if (selectLanguageModalElm.length > 0) {
  var selectLanguageModal = new bootstrap.Modal(selectLanguageModalElm, {});
}
$(".choose-language").on("click", function (e) {
  const select_language = $(this).data("language");
  const select_region = $(this).data("region");
  const accept_languages = ['Malaysia', 'Singapore']

  if (!accept_languages.includes(select_region)) {
    window.location.href = '/access-denied.html';
    return false;
  }


  if (LANGUAGES[select_language]) {
    translator.translatePageTo(LANGUAGES[select_language]);
    selectLanguageModal.hide();
    $("#mySidenav").removeClass("active");
    localStorage.setItem(PREFERED_REGION, select_region)
    changeLanguageColor()
    window.location.reload();
  } else {
    console.log("No language setup");
  }
});

$(".universal__content__language").on("click", function (e) {
  const select_language = $(this).data("language");
  if (LANGUAGES[select_language]) {
    translator.translatePageTo(LANGUAGES[select_language]);
    window.location.href = "/";
  } else {
    console.log("No language setup");
  }
});

$('.universal .play-now a').on("click", function (e) {
  e.preventDefault();
  const slick_current_select = $('#selectLanguage .slick-list .slick-track .slick-current .title');
  if(slick_current_select.length > 0) {
    const slick_current_select_title = slick_current_select.data('i18n')
    const accept_languages = ['universal_page.Malaysia', 'universal_page.Singapore']
    if (accept_languages.includes(slick_current_select_title)) {
      window.location.href = '/login.html'
    } else {
      window.location.href = '/access-denied.html'
    }
  }
})


$('#mySidenav #collapseCountry .collapse__item').on('click', function() {
  const select_region = $(this).data("region");
  localStorage.setItem(PREFERED_REGION, select_region);
  changeLanguageColor();
  const collapseCountryElm = $("#collapseCountry");
  if (collapseCountryElm.length > 0) {
    const collapseCountry = new bootstrap.Collapse(collapseCountryElm, {});
    collapseCountry.hide()
  }
})

function changeLanguageColor () {
  const _get_region = localStorage.getItem(PREFERED_REGION) || 'Singapore';
  $('.choose-language').each(function (){
    const get_attr_lang = $(this).data('language').toLowerCase();
    const get_attr_region = $(this).data('region');
    if(_get_language == get_attr_lang && _get_region == get_attr_region) {
      $(this).addClass('text-primary');
    }
  })

  const current_country = translator.translateForKey('menu.Uwin33_' + _get_region, _get_language);
  $('#mySidenav .current-country').text(current_country);
  
  $('#mySidenav #collapseCountry .collapse__item').each(function (){
    const get_attr_region = $(this).data('region');
    if(_get_region == get_attr_region) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  })
}

/**
 * MENU SLIDE
 *
 */

/**
 * SCROLL TEXT
 *
 */

//this is the useful function to scroll a text inside an element...
function startScrolling(scroller_obj, velocity, start_from) {
  //bind animation  inside the scroller element
  scroller_obj
    .bind("marquee", function (event, c) {
      //text to scroll
      var ob = $(this);
      //scroller width
      var sw = parseInt(ob.closest(".text-animated").width());
      //text width
      var tw = parseInt(ob.width());
      //text left position relative to the offset parent
      var tl = parseInt(ob.position().left);
      //velocity converted to calculate duration
      var v = velocity > 0 && velocity < 100 ? (100 - velocity) * 1000 : 5000;
      //same velocity for different text's length in relation with duration
      var dr = (v * tw) / sw + v;
      //is it scrolling from right or left?
      switch (start_from) {
        case "right":
          //   console.log('here')
          //is it the first time?
          if (typeof c == "undefined") {
            //if yes, start from the absolute right
            ob.css({
              left: sw,
            });
            sw = -tw;
          } else {
            //else calculate destination position
            sw = tl - (tw + sw);
          }
          break;
        default:
          if (typeof c == "undefined") {
            //start from the absolute left
            ob.css({
              left: -tw,
            });
          } else {
            //else calculate destination position
            sw += tl + tw;
          }
      }
      //attach animation to scroller element and start it by a trigger
      ob.animate(
        {
          left: sw,
        },
        {
          duration: dr,
          easing: "linear",
          complete: function () {
            ob.trigger("marquee");
          },
          step: function () {
            //check if scroller limits are reached
            if (start_from == "right") {
              if (parseInt(ob.position().left) < -parseInt(ob.width())) {
                //we need to stop and restart animation
                ob.stop();
                ob.trigger("marquee");
              }
            } else {
              if (
                parseInt(ob.position().left) > parseInt(ob.parent().width())
              ) {
                ob.stop();
                ob.trigger("marquee");
              }
            }
          },
        }
      );
    })
    .trigger("marquee");
  //pause scrolling animation on mouse over
  scroller_obj.mouseover(function () {
    $(this).stop();
  });
  //resume scrolling animation on mouse out
  scroller_obj.mouseout(function () {
    $(this).trigger("marquee", ["resume"]);
  });
}

$(function () {
  $(".text-animated").each(function (i, obj) {
    if ($(this).find(".text-overflow").width() > $(this).width()) {
      //settings to pass to function
      var scroller = $(this).find(".text-overflow"); // element(s) to scroll
      var scrolling_velocity = 95; // 1-99
      var scrolling_from = "right"; // 'right' or 'left'
      //call the function and start to scroll..
      startScrolling(scroller, scrolling_velocity, scrolling_from);
    }
  });
});

/**
 * END SCROLL TEXT
 *
 */

const selectPromotionModalElm = $("#selectPromotionModal");
if (selectPromotionModalElm.length > 0) {
  var selectPromotionModal = new bootstrap.Modal(selectPromotionModalElm, {});
}
// $(".select-promotion__items").on("click", function (e) {
//   setTimeout(() => {
//     selectPromotionModal.hide();
//     $(".deposit-amount__summary").removeClass("d-none");
//     $(".deposit-amount__action .btn-submit").attr("disabled", false);
//     $("#select-promotion-placeholder").addClass("fw-bold");
//     $("#select-promotion-placeholder").css("color", "#000");
//     $("#select-promotion-placeholder").text("Welcome Bonus up to 180%");
//   }, 500);
// });

$(".select-promotion__items input[name='select-promotion-radio']").change(
  function () {

    const current_value = $(
      ".select-promotion__items input[name='select-promotion-radio']:checked"
    ).val();
    setTimeout(() => {
      if(current_value === '1') {
        const Welcome_Bonus_up_to = translator.translateForKey('Welcome_Bonus_up_to', _get_language);
        $('.Deposit_Summary_Promotion').text(Welcome_Bonus_up_to);
        $('.Deposit_Summary_Bonus').text('MYR 500');
        $('.Deposit_Summary_Turnover').text('x25');
        $('.Deposit_Summary_Turnover_Requirement').text('MYR 10,000');
        $(".select-promotion-placeholder").text(Welcome_Bonus_up_to);
      } else {
        const Don_want_to_claim_any_promotion = translator.translateForKey('Don_want_to_claim_any_promotion', _get_language);
        $('.Deposit_Summary_Promotion').text(Don_want_to_claim_any_promotion);
        $('.Deposit_Summary_Bonus').text('MYR 0');
        $('.Deposit_Summary_Turnover').text('x1');
        $('.Deposit_Summary_Turnover_Requirement').text('MYR 500');
        $(".select-promotion-placeholder").text(Don_want_to_claim_any_promotion);
      }
      selectPromotionModal.hide();
      $(".deposit-amount__summary").removeClass("d-none");
      $(".deposit-amount__action .btn-submit").attr("disabled", false);
      $(".select-promotion-placeholder").addClass("fw-bold");
      $(".select-promotion-placeholder").css("color", "#000");
    }, 500);
  }
);

const selectBankModalElm = $("#selectBankModal");
if (selectBankModalElm.length > 0) {
  var selectBankModal = new bootstrap.Modal(selectBankModalElm, {});
}
$(".select-bank-modal__items input[name='select-bank-modal-radio']").change(
  function () {

    const current_value = $(
      ".select-bank-modal__items input[name='select-bank-modal-radio']:checked"
    ).val();
    setTimeout(() => {
      selectBankModal.hide();
      $(".select-bank-placeholder").text(current_value);
      $(".select-bank-placeholder").addClass("fw-bold");
      $(".select-bank-placeholder").css("color", "#000");
    }, 500);
  }
);

$(".add-bank-account .select-bank-modal__items").on("click", function (e) {
  setTimeout(() => {
    selectBankModal.hide();
    const bank_input = $(
      ".add-bank-account .add-bank-account__content__input__select-bank__input__placeholder"
    );
    bank_input.html("MAYBANK");
    bank_input.addClass("fw-bold");
    const submit_btn = $(
      ".add-bank-account .add-bank-account__content__submit .btn"
    );
    submit_btn.removeClass("disabled");
    // submit_btn.prop("disabled", false);
  }, 500);
});

$(".deposit .deposit-amount__item input[name='depositAmount']").change(
  function () {
    const amount = $(this).data("amount");
    $(".deposit-amount-input").val(amount);
    $(".deposit-amount-input-label").hide();
  }
);

$(".deposit .deposit-items__content input[name='crypto_option']").change(
  function () {

    const current_value = $(
      ".deposit .deposit-items__content input[name='crypto_option']:checked"
    ).val();
    if(current_value === 'USDT') {
      $('#TRC_20').show();
    } else {
      $('#TRC_20').hide();
    }
  }
);


$('#Memo_copy').hide();
$(".deposit .deposit-items__content input[name='network_option']").change(
  function () {

    const current_value = $(
      ".deposit .deposit-items__content input[name='network_option']:checked"
    ).val();
    if(current_value === 'BEP 20') {
      $('#Memo_copy').show();
    } else {
      $('#Memo_copy').hide();
    }
  }
);

$(".deposit-amount-input").on("input", function (e) {
  const value = $(this).val();
  if (value > 50 && value < 50000) {
    $(".deposit .btn-submit").prop("disabled", false);
    $(".deposit-amount-input-label").hide();
  } else {
    $(".deposit .btn-submit").prop("disabled", true);
    $(".deposit-amount-input-label").show();
  }
});

$(".withdrawal #withdrawal-input").on("input", function (e) {
  const value = $(this).val();
  if (value > 50 && value < 50000) {
    $(".withdrawal .withdrawal-submit").prop("disabled", false);
    $("#withdrawal-amount-input-label").hide();
  } else {
    $(".withdrawal .withdrawal-submit").prop("disabled", true);
    $("#withdrawal-amount-input-label").show();
  }
});

$(".withdrawal .withdrawal-max-value").on("click", function (e) {
  $(".withdrawal #withdrawal-input").val(5800);
  $("#withdrawal-amount-input-label").hide();
  $(".withdrawal .withdrawal-submit").prop("disabled", false);
});

const successModalElm = $("#depositSuccessModal");
if (successModalElm.length > 0) {
  var successModal = new bootstrap.Modal(successModalElm, {});
}
$("#online-banking .btn-submit").on("click", function (e) {
  successModal.show();
});

const paymentGatewaySuccessModalElm = $("#paymentGatewaySuccessModal");
if (paymentGatewaySuccessModalElm.length > 0) {
  var paymentGatewaySuccessModal = new bootstrap.Modal(
    paymentGatewaySuccessModalElm,
    {}
  );
}
$("#payment-gateway .btn-submit").on("click", function (e) {
  paymentGatewaySuccessModal.show();
});

const transferConfirmModalElm = $("#transferConfirmModal");
if (transferConfirmModalElm.length > 0) {
  var transferConfirmModal = new bootstrap.Modal(transferConfirmModalElm, {});
}
$("#autoTransferCheck").on("click", function (e) {
  const isCheck = $(this).is(":checked");
  if (!isCheck) {
    e.preventDefault();
    transferConfirmModal.show();
  } else {
    $(".transfer .transfer__content__auto-switch-off").addClass("d-none");
    $(".transfer .transfer__content__action").addClass("d-none");
  }
});
$("#transferConfirmModal .btn-confirm").on("click", function (e) {
  const isCheck = $("#autoTransferCheck").is(":checked");
  $("#autoTransferCheck").prop("checked", !isCheck);
  transferConfirmModal.hide();
  $(".transfer .transfer__content__auto-switch-off").removeClass("d-none");
  $(".transfer .transfer__content__action").removeClass("d-none");
});

const chooseWalletModalElm = $("#chooseWalletModal");
if (chooseWalletModalElm.length > 0) {
  var chooseWalletModal = new bootstrap.Modal(chooseWalletModalElm, {});
}
$("#chooseWalletModal .choose-modal__items input[name=choose-modal-radio]").on(
  "change",
  function (e) {
    const current_value = $(
      "#chooseWalletModal .choose-modal__items input[name=choose-modal-radio]:checked"
    ).val();
    setTimeout(() => {
      const attach_new_elem = current_value.split("_");
      $("#auto-switch-off--left").html(attach_new_elem[0]);
      $("#auto-switch-off--right").html(attach_new_elem[1]);
      chooseWalletModal.hide();
    }, 500);
  }
);

$(
  "#selectProfilePictureModal .select-profile-picture-modal__items__item input[name=select-profile-picture-modal-radio]"
).on("change", function (e) {
  const current_value = $(
    "#selectProfilePictureModal .select-profile-picture-modal__items__item input[name=select-profile-picture-modal-radio]:checked"
  ).data("src");
  $(".profile .avatar > div > img").attr("src", current_value);
});

if ($(".transaction-history-dropdown").length > 0) {
  $(".transaction-history-dropdown").each(function (index) {
    this.addEventListener("hidden.bs.dropdown", function () {
      $('.main.transaction-history').css('padding-top', 65)
      $(".transaction-history").removeClass("backdrop");
    });
    this.addEventListener("shown.bs.dropdown", function () {
      const dropdown_menu_show = $('.transaction-history .dropdown-menu.show').height();
      $('.main.transaction-history').css('padding-top', 65 + 15 + dropdown_menu_show)
      $(".transaction-history").addClass("backdrop");
    });
  });
}

if ($(".betting-record-dropdown").length > 0) {
  $(".betting-record-dropdown").each(function (index) {
    this.addEventListener("hidden.bs.dropdown", function () {
      $('.main.betting-record').css('padding-top', 65)
      $(".betting-record").removeClass("backdrop");
    });
    this.addEventListener("shown.bs.dropdown", function () {
      const dropdown_menu_show = $('.betting-record .dropdown-menu.show').height();
      $('.main.betting-record').css('padding-top', 65 + 15 + dropdown_menu_show)
      $(".betting-record").addClass("backdrop");
    });
  });
}

if ($(".bonus-history-dropdown").length > 0) {
  $(".bonus-history-dropdown").each(function (index) {
    this.addEventListener("hidden.bs.dropdown", function () {
      $('.main.bonus-history').css('padding-top', 65)
      $(".bonus-history").removeClass("backdrop");
    });
    this.addEventListener("shown.bs.dropdown", function () {
      const dropdown_menu_show = $('.bonus-history .dropdown-menu.show').height();
      $('.main.bonus-history').css('padding-top', 65 + 15 + dropdown_menu_show)
      $(".bonus-history").addClass("backdrop");
    });
  });
}


$(".dropdown-menu[aria-labelledby='dropdownMenuLast7Days'] button").on("click", function (e) {
  const text = $(this).text();
  $('#dropdownMenuLast7Days').text(text);
  $(".dropdown-menu[aria-labelledby='dropdownMenuLast7Days'] button").removeClass('active');
  $(this).addClass("active");

  // 
  const is_data_bs_toggle = $(this).attr('data-bs-toggle');
  var bsCollapse = new bootstrap.Collapse($('#collapseCustomDate'),{
    toggle: false
  });
  if (!is_data_bs_toggle && bsCollapse) {
    bsCollapse.hide()
    // bootstrap.Collapse.getOrCreateInstance($('#collapseCustomDate')).hide();
  }
})

$(".dropdown-menu").on("click", function (e) {
  e.stopPropagation();
});

$('.dropdown').on('hide.bs.dropdown', function (e) {
  if (e.clickEvent) {
    const get_mbsc_popup_wrapper = $('.mbsc-popup-wrapper');
    if(get_mbsc_popup_wrapper.length > 0) {
      e.preventDefault();
    }
  }
});

$('#back_url').on('click', function (e) {
  e.preventDefault();
  const is_use_back_url = $(this).hasClass('use_back_url')
  if(!!is_use_back_url) {
    const href = $(this).attr('href');
    window.location.href = href || '/';
  } else {
    window.history.back();
  }
})

$(".profile #exampleFormControlEmailAddressInput").on("input", function () {
  const value = $(this).val();
  if (!!value) {
    $(".profile .btn-request_code").prop("disabled", false);
  } else {
    $(".profile .btn-request_code").prop("disabled", true);
  }
});


// inbox follow
$('.inbox .nav-child .inbox_edit, .inbox .nav-child .inbox_close').on('click', function () {
  toggleInboxDisplayNone();
});

let inbox_select_all = false;
$(".inbox .nav-child .inbox_select_all").click(function(){
  inbox_select_all = !inbox_select_all;
  const select_all_label = translator.translateForKey('inbox_page.select_all', _get_language);
  const cancel_all_label = translator.translateForKey('inbox_page.cancel_all', _get_language);
  
  $('.inbox .inbox__items input[name="inbox_select"]').prop('checked', inbox_select_all);
  if (inbox_select_all) {
    $(this).text(cancel_all_label);
    toggleInboxAction(true);
  } else {
    $(this).text(select_all_label);
    toggleInboxAction();
  }
});


$('.inbox .inbox__items input[name="inbox_select"]').on("input", function() {
  let _is_check = false;
  $('.inbox .inbox__items input[name="inbox_select"]').each(function() {
    const checked = $(this).is(':checked');
    if(checked) {
      _is_check = true;
    }
  })
  toggleInboxAction(_is_check)
});

$('.inbox__action__mark_all_read').on("click", function() {
  const checked_value = $('.inbox .inbox__items input[name="inbox_select"]:checked');
  checked_value.each(function() {
    const parent = $(this).parent();
    parent.find('.badge').remove();
    $(this).prop('checked', false);
  });
  toggleInboxAction(false);
  toggleInboxDisplayNone();
  inbox_select_all = false;
  const select_all_label = translator.translateForKey('inbox_page.select_all', _get_language);
  $('.inbox .nav-child .inbox_select_all').text(select_all_label);
})


$('.inbox__action__delete').on("click", function() {
  const checked_value = $('.inbox .inbox__items input[name="inbox_select"]:checked');
  checked_value.each(function() {
    $(this).parent().remove();
    $(this).prop('checked', false);
  });
  toggleInboxAction(false);
  toggleInboxDisplayNone();
  inbox_select_all = false;
  const select_all_label = translator.translateForKey('inbox_page.select_all', _get_language);
  $('.inbox .nav-child .inbox_select_all').text(select_all_label);

  const inbox__items = $('.inbox__items');
  if (inbox__items.length === 0) {
    $('.inbox__empty').toggleClass('d-none')
  }
})

function toggleInboxAction (show = false) {
  $(".inbox .inbox__action button").prop("disabled", !show);
}

function toggleInboxDisplayNone () {
  $(`
    .inbox .nav-child .inbox_select_all, 
    .inbox .nav-child .inbox_back, 
    .inbox .nav-child .inbox_close, 
    .inbox .nav-child .inbox_edit,
    .inbox .inbox__items input[name="inbox_select"],
    .inbox .inbox__action
  `).toggleClass('d-none');
}

// end inbox follow

$("#privilegeInfo").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  infinite: false,
  fade: true,
  asNavFor: "#privilegeVipCard",
});

$("#privilegeVipCard").slick({
  centerMode: true,
  infinite: false,
  slidesToShow: 1,
  asNavFor: "#privilegeInfo",
});

$(".universal #selectLanguage").slick({
  centerMode: true,
  infinite: true,
  slidesToShow: 3,
});

$("#carouselSposorshipEventVideo").slick({
  centerMode: true,
  infinite: true,
  slidesToShow: 1,
  arrows: true,
  dots: true,
});

$("#carouselSponsoredEventPhotos1").slick({
  centerMode: true,
  infinite: true,
  slidesToShow: 1,
  arrows: false,
  dots: true,
});

// active deposit tab when active params ?active=1
const is_deposit_route = location.pathname === "/wallet/deposit.html";
if (is_deposit_route) {
  const get_params = getUrlVars();
  if (get_params && get_params["active"]) {
    const tab_names = [
      "#online-banking-tab",
      "#payment-gateway-tab",
      "#crypto-currency-tab",
    ];
    var sel = document.querySelector(tab_names[get_params["active"]]);
    bootstrap.Tab.getOrCreateInstance(sel).show();
  }
}

const is_register_thank_you_route = location.pathname === "/register-thank-you.html";
if (is_register_thank_you_route) {
  setTimeout(() => {
    window.location.href = '/wallet/deposit.html';
  }, 5000)
}

const incorrectEmailModalElm = $("#incorrectEmailModal");
if (incorrectEmailModalElm.length > 0) {
  var incorrectEmailModal = new bootstrap.Modal(incorrectEmailModalElm, {});
}
$('.forget-password-page .btn-next').on('click', function (e) {
  const forget_password_input = $('.forget-password-page #forget_password_input')
  if (!forget_password_input.val()) {
    incorrectEmailModal.show();
  } else {
    window.location.href = '/forget-password-success.html';
  }
});

$('#mySidenav #collapseCountry').on('show.bs.collapse', function () {
  $('#mySidenav .country-name').addClass('active');
  $('#mySidenav .current-country').css('opacity', 0);
});

$('#collapseCountry').on('hide.bs.collapse', function () {
  $('#mySidenav .country-name').removeClass('active');
  $('#mySidenav .current-country').css('opacity', 1);
});

$(document).ready(function () {
  $(".top-slider").slick({
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    lazyLoad: 'ondemand',
    fade: true,
    // cssEase: "linear",
  });
});

$('.home .home__content__hot_games__content__item').on('click', function (e) {
  e.preventDefault();
  const hasActive = $(this).hasClass('active');
  $('.home .home__content__hot_games__content__item').removeClass('active');
  if (!!hasActive) {
    $(this).removeClass('active');
  } else {
    $(this).addClass('active');
  }
})

$('.category-page .btn-left').on('click', function (e) {
  e.preventDefault();
  $('.category-page .nav-tabs').animate({
    scrollLeft: "-=40px"
  });
})

$('.category-page .btn-right').on('click', function (e) {
  e.preventDefault();
  $('.category-page .nav-tabs').animate({
    scrollLeft: "+=40px"
  });
})

console.log("--- index.jsaaa");
