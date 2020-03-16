const addSelectInteraction = (id) => {
	// init select
	// $('#' + id + 'Title').text($('#' + id + 'List').children().eq(0).text());
	// $('#' + id).attr('value', $('#' + id + 'List').children().eq(0).val());
	// if(id == 'fromPoints') {
	// 	if($('#fromPoints').val() != 1) {
	// 		setIndex('#from_ind', $('#fromPoints').val(), indexColorChoosed);
	// 	}
	// }
	// if(id == 'toPoints') {
	// 	if($('#usluga').attr('cat') == 4) {					// если международная
	// 		setIndex('#to_ind', 'ISO ' + $('#toPoints').val(), indexColorChoosed);
	// 	} else
	// 		setIndex('#to_ind', $('#toPoints').val(), indexColorChoosed);
	// }

	/*Dropdown Menu*/
	// дальше пиздос...........
	if(getSafe(()=>$._data($('#' + id + 'Dropdown').get(0), "events")) == '') {	// клик на дропдаун
		$('#' + id + 'Dropdown').click(function () {
			$(this).attr('tabindex', 1).focus();
			$(this).toggleClass('active');
			$(this).find('.dropdown-menu').slideToggle(300);
		});
		$('#' + id + 'Dropdown').focusout(function () {
			$(this).removeClass('active');
			$(this).find('.dropdown-menu').slideUp(300);
		});
	}
	$('#' + id + 'Dropdown .dropdown-menu li').click(function () {		// клик на пункт списка
		if(id == 'usluga' || !isNaN($(this).attr('cat'))) {
			if(id == 'usluga' && !isNaN($(this).attr('cat'))) {
				$('#' + id + 'Title').text($(this).text());
				$('#' + id).attr('value', $(this).attr('value'));
				$('#usluga').attr('cat', $(this).attr('cat'));
				getTariffInfo($('#usluga').val());
			}
		}
		if(id == 'fromPoints' || id == 'toPoints') {
			if($('#fromPoints').val() != 1 && $('#fromPointsDropdown').is(":focus")) {
				$('#fromPoints').val($(this).val());
				setIndex('#from_ind', $('#fromPoints').val(), indexColorChoosed);
				getOPS($('#from_ind').html(), '#from_ind');
			}
			if($('#toPointsDropdown').is(":focus")) {
				if($('#usluga').attr('cat') == 4) {					// если международная
					$('#toPoints').val($(this).val());
					setIndex('#to_ind', 'ISO ' + $('#toPoints').val(), indexColorChoosed);
				} else
					setIndex('#to_ind', $('#toPoints').val(), indexColorChoosed);
			}
		}
		if(id == 'company') {
			$('#' + id + 'Title').text($(this).text());
			$('#' + id).attr('value', $(this).attr('value'));
			getUslugaList($(this).val());
		}
		if(id == 'cdekDogovor') {
			CDEKServices($(this).val());
		}
	});

	$('.dropdown .dropdown-menu li').click(function () {
    if($(this)[0].id.search('cat') < 0) {
      $(this).parents('.dropdown').find('span').text($(this).text());
      $(this).parents('.dropdown').find('input').attr('value', $(this).attr('value'));
    }
  });
}

export default addSelectInteraction