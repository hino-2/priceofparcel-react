import { useDispatch } from 'react-redux'
import { loadUsluga }  from '../actions'

const addSelectInteractions = (id, services) => {
	// init select
	const input     = document.querySelector(`#${id}`)
	const title	    = document.querySelector(`#${id}Title`)
	const dropdown  = document.querySelector(`#${id}Dropdown`)
	const list 	    = document.querySelector(`#${id}List`)
	const listItems = document.querySelectorAll(`#${id}Dropdown .dropdown-menu li`)
	const dispatch  = useDispatch

	document.querySelector(`#${id}Title`).innerHTML = list.firstElementChild.innerHTML
	document.querySelector(`#${id}`).setAttribute('value', list.firstElementChild.value)
	// if(id == 'fromPoints') {
	// 	if($('#fromPoints').val() != 1) {
	// 		setIndex('#from_ind', $('#fromPoints').val(), indexColorChoosed);
	// 	}
	// }

	// TODO: international package
	// if(id == 'toPoints') {
	// 	if($('#usluga').attr('cat') == 4) {					// если международная
	// 		setIndex('#to_ind', 'ISO ' + $('#toPoints').val(), indexColorChoosed);
	// 	} else
	// 		setIndex('#to_ind', $('#toPoints').val(), indexColorChoosed);
	// }

	/*Dropdown Menu*/
	// if(getSafe(()=>$._data($('#' + id + 'Dropdown').get(0), "events")) == '') {	// клик на дропдаун
	dropdown.addEventListener('click', (e) => {
		dropdown.setAttribute('tabindex', 1)
		dropdown.focus()
		dropdown.classList.toggle('active')
		list.classList.toggle('slided')
	})
		// $('#' + id + 'Dropdown').click(function () {
		// 	$(this).attr('tabindex', 1).focus();
		// 	$(this).toggleClass('active');
		// 	$(this).find('.dropdown-menu').slideToggle(300);
		// });
	dropdown.addEventListener('focusout', (e) => {
		dropdown.classList.remove('active')
		list.classList.remove('slided')
	})
		// $('#' + id + 'Dropdown').focusout(function () {
		// 	$(this).removeClass('active');
		// 	$(this).find('.dropdown-menu').slideUp(300);
		// });
	// }
	listItems.forEach((item) => item.addEventListener('click', (e) => {		// клик на пункт списка
		console.log(e.target);
		
		title.innerHTML = e.target.innerHTML
		input.setAttribute('value', e.target.value)
		dispatch(loadUsluga(services.find(({object}) => object === e.target.value)))
	}))
	// $('#' + id + 'Dropdown .dropdown-menu li').click(function () {		// клик на пункт списка
	// 	if(id == 'usluga' || !isNaN($(this).attr('cat'))) {
	// 		if(id == 'usluga' && !isNaN($(this).attr('cat'))) {
	// 			$('#' + id + 'Title').text($(this).text());
	// 			$('#' + id).attr('value', $(this).attr('value'));
	// 			$('#usluga').attr('cat', $(this).attr('cat'));
	// 			getTariffInfo($('#usluga').val());
	// 		}
	// 	}

		// if(id == 'fromPoints' || id == 'toPoints') {
		// 	if($('#fromPoints').val() != 1 && $('#fromPointsDropdown').is(":focus")) {
		// 		$('#fromPoints').val($(this).val());
		// 		setIndex('#from_ind', $('#fromPoints').val(), indexColorChoosed);
		// 		getOPS($('#from_ind').html(), '#from_ind');
		// 	}
		// 	if($('#toPointsDropdown').is(":focus")) {
		// 		if($('#usluga').attr('cat') == 4) {					// если международная
		// 			$('#toPoints').val($(this).val());
		// 			setIndex('#to_ind', 'ISO ' + $('#toPoints').val(), indexColorChoosed);
		// 		} else
		// 			setIndex('#to_ind', $('#toPoints').val(), indexColorChoosed);
		// 	}
		// }
		// if(id == 'company') {
		// 	$('#' + id + 'Title').text($(this).text());
		// 	$('#' + id).attr('value', $(this).attr('value'));
		// 	getUslugaList($(this).val());
		// }
		// if(id == 'cdekDogovor') {
		// 	CDEKServices($(this).val());
		// }
	// });

	// ????????????????????????????????
// 	$('.dropdown .dropdown-menu li').click(function () {
//     if($(this)[0].id.search('cat') < 0) {
//       $(this).parents('.dropdown').find('span').text($(this).text());
//       $(this).parents('.dropdown').find('input').attr('value', $(this).attr('value'));
//     }
//   });
}

export default addSelectInteractions