jQuery(document).ready(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Comment or uncomment the result you want.
	// Currently, shake on error is enabled.
	// When a field is left blank, jQuery will shake the form

	/* Begin config */

	//	var shake = "Yes";
		var shake = "No";

	/* End config */


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////// Do not touch below /////////////////////////////////////////

	$('#message').hide();

	// Add validation parts
	$('#contact input[type=text], #contact input[type=number], #contact input[type=email], #contact input[type=url], #contact input[type=tel], #contact select, #contact textarea').each(function(){
		$(this).after('<mark class="validate"></mark>');
	});

	// Validate as you type
	$('#name, #comments, #subject, #phone').focusout(function() {
		if (!$(this).val())
			$(this).addClass('error').parent().find('mark').removeClass('valid').addClass('error');
		else
			$(this).removeClass('error').parent().find('mark').removeClass('error').addClass('valid');
	});
	$('#email').focusout(function() {
		if (!$(this).val() || !isEmail($(this).val()))
			$(this).addClass('error').parent().find('mark').removeClass('valid').addClass('error');
		else
			$(this).removeClass('error').parent().find('mark').removeClass('error').addClass('valid');
	});
	$('#website').focusout(function() {
		var web = $(this).val();
		if (web && web.indexOf("://") == -1) {
			//$(this).addClass('error').parent().find('mark').removeClass('valid').addClass('error');
			$(this).val('http://' + web);
			$(this).removeClass('error').parent().find('mark').removeClass('error').addClass('valid');
		} else if (web)
			$(this).removeClass('error').parent().find('mark').removeClass('error').addClass('valid');
		else
			$(this).removeClass('error').parent().find('mark').removeClass('error').removeClass('valid');
	});

	$('#verify').focusout(function() {
		var verify = $(this).val();
		var verify_box = $(this);
		if (!verify)
			$(this).addClass('error').parent().find('mark').removeClass('valid').addClass('error');
		else {
			$.ajax({
				type: 'POST',
				url: './ajax_check.php',
				data: { verify: verify },
				async: false,
				success: function( data ) {
					if (data=='success') {
						$(verify_box).removeClass('error').parent().find('mark').removeClass('error').addClass('valid');
					} else {
						$(verify_box).addClass('error').parent().find('mark').removeClass('valid').addClass('error');
					}
				}
			});

		}
	});

	$('#submit').click(function() {
		$("#message").slideUp(200,function() {
			$('#message').hide();

			// Kick in Validation
			$('#name, #subject, #phone, #comments, #website, #verify, #email').triggerHandler("focusout");

			if ($('#contact mark.error').size()>0) {
				if(shake == "Yes") {
					$('#contact').effect('shake', { times:2 }, 75, function(){
						$('#contact input.error:first, #contact textarea.error:first').focus();
					});
				} else $('#contact input.error:first, #contact textarea.error:first').focus();

				return false;
			}

		});
	});

	$('#contactform').submit(function(){
		$('#verify').focusout();
		if ($('#contact mark.error').size()>0) {
			if(shake == "Yes") {
			$('#contact').effect('shake', { times:2 }, 70);
			}
			return false;
		}

		var action = $(this).attr('action');

 		$('#submit')
			.after('<img src="./images/ajax-loader.gif" class="loader" />')
			.attr('disabled','disabled');

		$.post(action, $('#contactform').serialize(),
			function(data){
				$('#message').html( data );
				$('#message').slideDown();
				$('#contactform img.loader').fadeOut('slow',function(){$(this).remove()});
				$('#contactform #submit').removeAttr('disabled');
				if(data.match('success') != null) 
					$('#contactform').slideUp('slow');

			}
		);

		return false;

	});

	function isEmail(emailAddress) {

		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

		return pattern.test(emailAddress);
	}

	function isNumeric(input) {
    	return (input - 0) == input && input.length > 0;
	}

});