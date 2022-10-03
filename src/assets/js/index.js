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


/**
 * 
 * ANIMATION SHOW SECTION
 * 
*/
$(function() {
  
  AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: true, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: true, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 0, // the delay on throttle used while scrolling the page (advanced)
    
  
    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 0, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 2000, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: true, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
  
  });
});

/**
 * 
 * END ANIMATION SHOW SECTION
 * 
*/

/**
 * 
 * SHOW LOADING SECTION
 * 
*/
$(window).on('load', function(){
  setTimeout(removeLoader, 300); //wait for page load PLUS x second
});
function removeLoader(){
  $( "#loadingDiv" ).fadeOut(500, function() {
    // fadeOut complete. Remove the loading div
    $( "#loadingDiv" ).remove(); //makes page more lightweight 
  });  
}
/**
 * 
 * END SHOW LOADING SECTION
 * 
*/


const IS_LOGOUT = 'IS_LOGOUT';
const IS_LOGOUT_VALUE = {
  YES: '1',
  NO: '0'
}
// set IS_LOGOUT localstorage when current route is login.html or without-login.html
const is_without_login_route = location.pathname === "/login.html" || location.pathname.includes('without-login.html');
if (is_without_login_route) {
  localStorage.setItem(IS_LOGOUT, IS_LOGOUT_VALUE.YES);
} else {
  localStorage.setItem(IS_LOGOUT, IS_LOGOUT_VALUE.NO);
}

// Translator

const LANGUAGES = {
  EN: "en",
  ZH: "zh",
};

const LANGUAGES_ARRAY = [LANGUAGES.EN, LANGUAGES.ZH];

var translator = new Translator({
  defaultLanguage: "en",
  detectLanguage: true,
  selector: "[data-i18n]",
  debug: false,
  registerGlobally: "__",
  persist: true,
  persistKey: "preferred_language",
  filesLocation: "assets/i18n",
  // filesLocation: "https://raw.githubusercontent.com/huylesitdn/uwin-mobile/main/assets/i18n",
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const langParams = urlParams.get('lang')
const PREFERED_REGION = 'preferred_region';
const _get_translator_config = translator.config.persistKey || "preferred_language";
const _get_language = langParams || localStorage.getItem(_get_translator_config) || LANGUAGES.EN;
const _get_region = localStorage.getItem(PREFERED_REGION) || 'Singapore';

translator.fetch([LANGUAGES.EN, LANGUAGES.ZH]).then(() => {
  // -> Translations are ready...
  const current_language = LANGUAGES_ARRAY.includes(_get_language) ? _get_language : LANGUAGES.EN
  translator.translatePageTo(current_language);
  changeLanguageColor();
  initialize();
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
    autoplay: true,
    autoplaySpeed: 2000,
    // cssEase: "linear",
  });
});

$('.show-action').on('click', function (e) {
  e.preventDefault();
  const hasActive = $(this).hasClass('active');
  $('.show-action').removeClass('active');
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

// const promotionDetailModal = document.getElementById('promotionDetailModal');
// if(promotionDetailModal) {
//   promotionDetailModal.addEventListener('show.bs.modal', (e) => {
//     const bannerimg = e.relatedTarget.dataset.bannerimg;
//     $('#promotionDetailModal .bannerimg').attr('src', 'assets/images/promotion/'+bannerimg+'.png')
//   });
// }

$('.promotionDetailModal').on('shown.bs.modal', function() { 
  $('.promotionDetailModal .promotion-content').scrollTop(0);
}) ;

$('.category-page .refresh-lucky-number').on('click', function(e) {
  const ramdomLuckyNumber = setInterval(function() {
    var ranNum1 = Math.floor( 1 + Math.random() * 9 );
    var ranNum2 = Math.floor( 1 + Math.random() * 9 );
    var ranNum3 = Math.floor( 1 + Math.random() * 9 );
    var ranNum4 = Math.floor( 1 + Math.random() * 9 );
    $('#lucky-number').html(ranNum1 + ' ' + ' ' + ranNum2 + ' ' + ranNum3 + ' ' + ranNum4);
  }, 50);

  setTimeout(function() {
    clearInterval(ramdomLuckyNumber);
  }, 3000)
})

const successRedeemedModalElm = $("#successRedeemedModal");
if (successRedeemedModalElm.length > 0) {
  var successRedeemedModal = new bootstrap.Modal(successRedeemedModalElm, {});
}
const invalidCodeModalElm = $("#invalidCodeModal");
if (invalidCodeModalElm.length > 0) {
  var invalidCodeModal = new bootstrap.Modal(invalidCodeModalElm, {});
}

$('#formVoucher').on('submit', function(e) {
  e.preventDefault();
  const form_data = $(this).serializeArray();
  const data_modal = $(this).data('modal');
  console.log('=-=-data_modal', data_modal)
  if (!form_data[0].value) {
    $('#formVoucher .form-text').removeClass('d-none');
    return false;
  } else {
    $('#formVoucher .form-text').addClass('d-none');
    if (data_modal === 'invalidCodeModal' && invalidCodeModal) {
      invalidCodeModal.show();
    }
    if (data_modal === 'successRedeemedModal' && successRedeemedModal) {
      successRedeemedModal.show();
    }
  }
})



var restoreModalEl = document.getElementById('restoreModal')
if(restoreModalEl) {
  var restoreModal = new bootstrap.Modal(restoreModalEl, {});
  restoreModalEl.addEventListener('shown.bs.modal', function (event) {
    setTimeout(() => {
      restoreModal.hide();
    }, 3000);
  })
}


function copyFunction(id) {
  /* Get the text field */
  var copyText = document.getElementById(id);

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);

  var toastCopyEl = document.getElementById('copiedToast')
  var toastCopyList = bootstrap.Toast.getOrCreateInstance(toastCopyEl)
  toastCopyList.show()
}

/**
 * 
 * INITIAL AFTER HAVE translator
 * 
 */

function initialize () {

  const forgetPasswordModalElm = $("#forgetPasswordModal");
  if (forgetPasswordModalElm.length > 0) {
    var forgetPasswordModal = new bootstrap.Modal(forgetPasswordModalElm, {});
  }
  const forgetPasswordSuccessModalElm = $("#forgetPasswordSuccessModal");
  if (forgetPasswordSuccessModalElm.length > 0) {
    var forgetPasswordSuccessModal = new bootstrap.Modal(forgetPasswordSuccessModalElm, {});
  }


  $("#loginForm").validate({
    rules: {
      username: "required",
      password: "required",
    },
    messages: {
      username: translator.translateForKey('login_page.Please_insert_your_username', _get_language),
      password: translator.translateForKey('login_page.Please_insert_your_password', _get_language),
    },
    submitHandler: function(form) {
      const _form_value = $(form).serializeArray();
      const username_demo = 'testacc';
      const password_demo = 'testacc';
      if(
        _form_value[0].name === 'username' && _form_value[0].value === username_demo && 
        _form_value[1].name === 'password' && _form_value[1].value === password_demo
      ) {
        localStorage.setItem(IS_LOGOUT, IS_LOGOUT_VALUE.NO);
        window.location.href = '/';
      }
      console.log(_form_value)
    }
  });

  $("#forgotPasswordModalForm").validate({
    rules: {
      username: "required",
      email: "required",
    },
    messages: {
      username: translator.translateForKey('login_page.Please_insert_your_username', _get_language),
      email: translator.translateForKey('login_page.Please_insert_your_email_address', _get_language),
    },
    submitHandler: function(form) {
      console.log(form)
      forgetPasswordModal.hide();
      forgetPasswordSuccessModal.show();
    }
  });

  $("#signUpForm").validate({
    rules: {
      username: {
        required: true,
        minlength: 6
      },
      full_name: "required",
      password: "required",
      confirm_password: "required",
      contact_number: "required",
      email: "required",
    },
    messages: {
      username: {
        required: translator.translateForKey('login_page.Please_insert_your_username', _get_language),
        minlength: translator.translateForKey('login_page.Enter_at_least_6_characters', _get_language),
      },
      full_name: translator.translateForKey('login_page.Please_insert_your_full_name', _get_language),
      password: translator.translateForKey('login_page.Please_insert_your_password', _get_language),
      confirm_password: translator.translateForKey('login_page.Please_insert_same_password_as_above', _get_language),
      contact_number: translator.translateForKey('login_page.Please_insert_your_contact_number', _get_language),
      email: translator.translateForKey('login_page.Please_insert_your_email_address', _get_language),
    },
    submitHandler: function(form) {
      const form_value = $(form).serializeArray()
      const letterNumber = /^[A-Za-z0-9]*$/;
      const username_value = form_value[0].value
      const is_character_number = letterNumber.test(username_value)
      if(!is_character_number) {
        $('#Username__help').removeClass('d-none');
        return false;
      } else {
        window.location.href = '/thank-you.html'
      }
    }
  });


  /**
   * 
   * START SELECT 2 OPTION SECTION
   * 
  */

  const select_bank_select = $('.select-bank').select2({
    minimumResultsForSearch: -1,
    placeholder: translator.translateForKey('deposit_page.Please_select', _get_language),
    dropdownParent: $('#selectBankDropdown')
  });
  const select_bank_select1 = $('.select-bank1').select2({
    minimumResultsForSearch: -1,
    placeholder: translator.translateForKey('deposit_page.Please_select', _get_language),
    dropdownParent: $('#selectBankDropdown1')
  });
  const select_bank_select2 = $('.select-bank2').select2({
    minimumResultsForSearch: -1,
    placeholder: translator.translateForKey('deposit_page.Please_select', _get_language),
    dropdownParent: $('#selectBankDropdown2')
  });
  const select_bank_select3 = $('.select-bank3').select2({
    minimumResultsForSearch: -1,
    placeholder: translator.translateForKey('deposit_page.Please_select', _get_language),
    dropdownParent: $('#selectBankDropdown3')
  });
  const transfer_from = $('.transfer-from').select2({
    minimumResultsForSearch: -1,
    placeholder: translator.translateForKey('deposit_page.Please_select', _get_language),
    dropdownParent: $('#transferFromDropdown')
  });
  const transfer_to = $('.transfer-to').select2({
    minimumResultsForSearch: -1,
    placeholder: translator.translateForKey('deposit_page.Please_select', _get_language),
    dropdownParent: $('#transferToDropdown')
  });
  $('.select-bank').on('select2:select', function (e) {
    var data = e.params.data;
    const _value = data.text
    afterSelect (_value, this)
  });
  $('.select-bank1').on('select2:select', function (e) {
    var data = e.params.data;
    const _value = data.text
    afterSelect (_value, this)
  });
  $('.select-bank2').on('select2:select', function (e) {
    var data = e.params.data;
    const _value = data.text
    afterSelect (_value, this)
  });
  $('.select-bank3').on('select2:select', function (e) {
    var data = e.params.data;
    const _value = data.text
    afterSelect (_value, this)
  });
  $('.transfer-from').on('select2:select', function (e) {
    var data = e.params.data;
    const _value = data.text
    afterSelect (_value, this)
  });
  $('.transfer-to').on('select2:select', function (e) {
    var data = e.params.data;
    const _value = data.text
    afterSelect (_value, this)
  });

  function afterSelect (value, e) {
    if(value) {
      const form__container = $(e).parents('.form__container');
      if(form__container.length > 0) {
        const select_bank_content = $(form__container[0]).children('.select_bank_content');
        if(select_bank_content.length > 0) {
          $(select_bank_content[0]).removeClass('d-none')
          $(select_bank_content[0]).children('.select_bank_content__title').html(value)
        }
      }
    }
  }

  /**
   * 
   * END SELECT 2 OPTION SECTION
   * 
  */

  const selectPromotionModalElm = $("#selectPromotionModal");
  if (selectPromotionModalElm.length > 0) {
    var selectPromotionModal = new bootstrap.Modal(selectPromotionModalElm, {});
  }
  $('.promotion-modal').on('submit', function(e) {
    e.preventDefault();
    const form_data = $(this).serializeArray();
    console.log('-=-=-form_data', form_data)
    var _value = translator.translateForKey(form_data[0].value, _get_language)
    _value = _value.replace("<br/>", " ");
    $('.PromotionSelectValue').val(_value)
    selectPromotionModal.hide()
  });


  const depositSuccessModalElm = $("#depositSuccessModal");
  if (depositSuccessModalElm.length > 0) {
    var depositSuccessModal = new bootstrap.Modal(depositSuccessModalElm, {});
  }

  const depositFailModalElm = $("#depositFailModal");
  if (depositFailModalElm.length > 0) {
    var depositFailModal = new bootstrap.Modal(depositFailModalElm, {});
  }

  const withdrawalSuccessModalElm = $("#withdrawalSuccessModal");
  if (withdrawalSuccessModalElm.length > 0) {
    var withdrawalSuccessModal = new bootstrap.Modal(withdrawalSuccessModalElm, {});
  }

  const withdrawalFailModalElm = $("#withdrawalFailModal");
  if (withdrawalFailModalElm.length > 0) {
    var withdrawalFailModal = new bootstrap.Modal(withdrawalFailModalElm, {});
  }

  const transferSuccessModalElm = $("#transferSuccessModal");
  if (transferSuccessModalElm.length > 0) {
    var transferSuccessModal = new bootstrap.Modal(transferSuccessModalElm, {});
  }

  const transferFailModalElm = $("#transferFailModal");
  if (transferFailModalElm.length > 0) {
    var transferFailModal = new bootstrap.Modal(transferFailModalElm, {});
  }

  const addBankDetailModalElm = $("#addBankDetailModal");
  if (addBankDetailModalElm.length > 0) {
    var addBankDetailModal = new bootstrap.Modal(addBankDetailModalElm, {});
  }

  $("#depositPaymentGatewayForm").validate({
    rules: {
      amount_SGD: {
        required: true,
        min: 30
      },
      select_bank: "required",
    },
    messages: {
      amount_SGD: {
        required: translator.translateForKey('deposit_page.Amount_SGD_required', _get_language),
        min: translator.translateForKey('deposit_page.Amount_SGD_required_min', _get_language)
      },
      select_bank: translator.translateForKey('deposit_page.Please_select_one', _get_language),
    },
    submitHandler: function(form) {
      console.log(form)
      // window.location.href = '/thank-you.html'

      depositSuccessModal.show()
    }
  });

  $('.btn-reset-form').on('click', function(e) {
    e.preventDefault();
    const _form_id = $(this).data('form');
    $('#'+_form_id).trigger("reset");
    const form__container__network_content = $('.form__container__network_content');
    if(form__container__network_content && form__container__network_content.length > 0 && !form__container__network_content.hasClass('d-none')) {
      form__container__network_content.addClass('d-none');  
    }
    const select_bank_content = $('.select_bank_content');
    if(select_bank_content && select_bank_content.length > 0) {
      select_bank_content.each(index => {
        if(!$(select_bank_content[index]).hasClass('d-none')) {
          $(select_bank_content[index]).addClass('d-none');
        }
      });
    }
    select_bank_select.val(null).trigger("change");
    select_bank_select1.val(null).trigger("change");
    select_bank_select2.val(null).trigger("change");
    select_bank_select3.val(null).trigger("change");
  })


  $('.form__container .form-suggest .btn').on('click', function(e) {
    e.preventDefault();
    const _value = $(this).data('value')
    const form__container = $(this).parents('.form__container');
    if(form__container.length > 0) {
      const form__container_input = $(form__container[0]).children('.form-control');
      if(form__container_input.length > 0) {
        $(form__container_input[0]).val(_value)
      }
    }
  })


  $('.select_bank').on('change', function(e) {
    const _value = $(this).val()
    if(_value) {
      const form__container = $(this).parents('.form__container');
      if(form__container.length > 0) {
        const select_bank_content = $(form__container[0]).children('.select_bank_content');
        if(select_bank_content.length > 0) {
          $(select_bank_content[0]).removeClass('d-none')
          $(select_bank_content[0]).children('.select_bank_content__title').html(_value)
        }
      }
    }
  })

  $('.select_network .btn-check').on('change', function(e) {
    const _value = $('.select_network .btn-check:checked').val()
    if(_value) {
      const form__container = $(this).parents('.form__container');
      if(form__container.length > 0) {
        const form__container__network_content = $(form__container[0]).children('.form__container__network_content');
        if(form__container__network_content.length > 0) {
          $(form__container__network_content[0]).removeClass('d-none')
        }
      }
    }
  })

  $("#depositOnlineBankingForm").validate({
    rules: {
      amount_SGD: {
        required: true,
        min: 30
      },
      select_bank: "required",
    },
    messages: {
      amount_SGD: {
        required: translator.translateForKey('deposit_page.Amount_SGD_required', _get_language),
        min: translator.translateForKey('deposit_page.Amount_SGD_required_min', _get_language)
      },
      select_bank: translator.translateForKey('deposit_page.Please_select_one', _get_language),
    },
    submitHandler: function(form) {
      console.log(form)
      // window.location.href = '/thank-you.html'

      depositSuccessModal.show()
    }
  });

  $("#depositCryptoForm").validate({
    rules: {
      // amount_SGD: {
      //   required: true,
      //   min: 30
      // },
      // select_bank: "required",
    },
    messages: {
      // amount_SGD: {
      //   required: translator.translateForKey('deposit_page.Amount_SGD_required', _get_language),
      //   min: translator.translateForKey('deposit_page.Amount_SGD_required_min', _get_language)
      // },
      // select_bank: translator.translateForKey('deposit_page.Please_select_one', _get_language),
    },
    submitHandler: function(form) {
      console.log(form)
      // window.location.href = '/thank-you.html'

      depositSuccessModal.show()
    }
  });

  $("#withdrawalPaymentGatewayForm").validate({
    rules: {
      amount_SGD: {
        required: true,
        min: 50,
        max: 25000
      },
      select_bank: "required",
      bank_account_number: "required",
    },
    messages: {
      amount_SGD: {
        required: translator.translateForKey('deposit_page.Please_enter_amount', _get_language),
        min: translator.translateForKey('deposit_page.Amount_SGD_required_min_50', _get_language),
        max: translator.translateForKey('deposit_page.Amount_SGD_required_max', _get_language)
      },
      select_bank: translator.translateForKey('deposit_page.Please_select_one', _get_language),
      bank_account_number: translator.translateForKey('deposit_page.Please_enter_your_bank_account_number', _get_language),
    },
    submitHandler: function(form) {
      console.log(form)
      // window.location.href = '/thank-you.html'

      withdrawalSuccessModal.show()
    }
  });

  $("#transferPaymentGatewayForm").validate({
    rules: {
      amount_SGD: {
        required: true,
        min: 50,
        max: 25000
      },
      transfer_from: "required",
      transfer_to: "required",
    },
    messages: {
      amount_SGD: {
        required: translator.translateForKey('deposit_page.Please_enter_amount', _get_language),
        min: translator.translateForKey('deposit_page.Amount_SGD_required_min_50', _get_language),
        max: translator.translateForKey('deposit_page.Amount_SGD_required_max', _get_language)
      },
      transfer_from: translator.translateForKey('deposit_page.Please_select_one', _get_language),
      transfer_to: translator.translateForKey('deposit_page.Please_select_one', _get_language),
    },
    submitHandler: function(form) {
      console.log(form)
      // window.location.href = '/thank-you.html'

      transferSuccessModal.show()
    }
  });

  $("#myAccountChangePasswordForm").validate({
    rules: {
      Current_Password: "required",
      New_Password: "required",
      Confirm_Password: "required",
    },
    messages: {
      Current_Password: translator.translateForKey('my_account_page.Please_enter_your_Current_Password', _get_language),
      New_Password: translator.translateForKey('my_account_page.Please_enter_your_New_Password', _get_language),
      Confirm_Password: translator.translateForKey('my_account_page.Please_enter_your_Confirm_Password', _get_language),
    },
    submitHandler: function(form) {
      console.log(form)
      // window.location.href = '/thank-you.html'

      // transferSuccessModal.show()
    }
  });

  $("#addBankDetailModalForm").validate({
    rules: {
      Account_Holder: "required",
      Select_Bank: "required",
      Bank_Account_Number: "required",
    },
    messages: {
      Account_Holder: translator.translateForKey('my_account_page.Please_enter_your_Current_Password', _get_language),
      Select_Bank: translator.translateForKey('deposit_page.Please_select_one', _get_language),
      Bank_Account_Number: translator.translateForKey('deposit_page.Please_enter_your_bank_account_number', _get_language),
    },
    submitHandler: function(form) {
      console.log(form)
      // window.location.href = '/thank-you.html'

      addBankDetailModal.hide()
    }
  });

  $('.Bank_Account_Name_Copy').on('click', function(e) {
    e.preventDefault();
    copyFunction('Bank_Account_Name_Value')
  })

  $('.Bank_Account_Number_Copy').on('click', function(e) {
    e.preventDefault();
    copyFunction('Bank_Account_Number_Value')
  })

  $('.address-copy').on('click', function(e) {
    e.preventDefault();
    copyFunction('address-copy-value')
  })


  $("#depositCryptoForm input[name='crypto_option']").change(
    function () {
  
      const current_value = $("#depositCryptoForm input[name='crypto_option']:checked").val();
      if(current_value) {
        const networkFormContainer = $('#networkFormContainer');
        if(networkFormContainer && networkFormContainer.hasClass('d-none')) {
          networkFormContainer.removeClass('d-none')
        }
      }
    }
  );

  $("#withdrawalPaymentGatewayForm input[name='btnradioWithdrawalBankType']").change(
    function () {
  
      const current_value = $("#withdrawalPaymentGatewayForm input[name='btnradioWithdrawalBankType']:checked").val();
      console.log(current_value)
      if(current_value) {
        $('#withdrawalPaymentGatewayForm .Existing_Bank').toggleClass('d-none')
        $('#withdrawalPaymentGatewayForm .New_Bank').toggleClass('d-none')
      }

      const withdrawal_submit_btn = $('#withdrawalPaymentGatewayForm .form__action .btn-warning');
      
      switch (current_value) {
        case '1':
          const deposit_page__Withdraw__label = translator.translateForKey('deposit_page.Withdraw', _get_language)
          withdrawal_submit_btn.html(deposit_page__Withdraw__label)
          break;
        case '2':
          const deposit_page__Add_Bank__label = translator.translateForKey('deposit_page.Add_Bank', _get_language)
          withdrawal_submit_btn.html(deposit_page__Add_Bank__label)
          break;
      
        default:
          break;
      }

    }
  );

  
  const pleaseLoginFirstModalElm = $("#pleaseLoginFirstModal");
  if (pleaseLoginFirstModalElm.length > 0) {
    var pleaseLoginFirstModal = new bootstrap.Modal(pleaseLoginFirstModalElm, {});
  }

  $(`
    .btn-demo, 
    .btn-play-real, 
    .btn-please-login, 
    .category-page__content__container__games_lobby__content__item__img, 
    .category-page__content__container__special_odds__content__item,
    .category-page__content__container__games_lobby__content__item__content,
    .btn-bet-now,
    .home__content__special_odds__content__item
  `).on('click', function(e) {
    const GET_IS_LOGOUT = localStorage.getItem(IS_LOGOUT);
    if(GET_IS_LOGOUT === IS_LOGOUT_VALUE.YES) {
      e.preventDefault();
      pleaseLoginFirstModal.show()
    }
  })
  

}


console.log("--- index.jsaaa");
