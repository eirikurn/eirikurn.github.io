$(document).ready(function() {
	
	$('#work').gallery({
		images: galleryImages
	});
	
	$('#tweets').tweet({
		username: twitterUsername,
		loading_text: 'Loading tweet...'
	});

	var $this,
		folder = 'resources/img/';
	
	$.preLoadImages([folder + 'logo.png', folder + 'navigation_arrow.png', folder + 'loader.gif', folder + 'gallery_hover.png'], function() {
	
		$('#siteContainer').show();
		
		$(window).bind('resize', function() {
		
			var calculatePosition = (($(window).height() - $('#siteContainer').height()) / 2) - ($('#logo').height() / 2);
			    
			$('#siteContainer').css('padding-top', calculatePosition + 'px');
		
		}).trigger('resize');
		
		$('#aboutRightContent').jScrollPane();
		$('#socialLeftContent').jScrollPane();
	
	});
	
	$('nav').delegate('a', 'click', function() {
		window.location.hash = $(this).attr("href");
		return false;
	});
	
	$(window).bind('hashchange', function() {

		if(!$('#content > div').is(':animated')) {

			newHash = (window.location.hash == '') ? '#home' : window.location.hash;
			
			if(newHash != $('nav a.active').attr('href')) {
			
				$('#content > div').hide();
				$(newHash).show();
					
				$('nav li').removeClass('active');
				$('nav a[href=' + newHash + ']').parent('li').addClass('active');
				
				if(newHash == '#about') $('#aboutRightContent').jScrollPane();
				if(newHash == '#social') $('#socialLeftContent').jScrollPane();
			
			}
		
		}

	}).trigger('hashchange');
	
	$('#socialLeftContent ul').find('a').hover(function() {
		
		$(this).stop(false, false).animate({ paddingLeft: '10px' });
		
		$(this).parent().siblings().stop(false, false).animate({ opacity: .5 });
	
	}, function() {
	
		$(this).stop(false, false).animate({ paddingLeft: 0 });
		
		$(this).parent().siblings().stop(false, false).animate({ opacity: 1 });
	
	});
	
	$('#contactForm').validate({
		rules: {
			name: {
				required: true,
				minlength: 2
			},
			email: {
				required: true,
				email: true
			},
			message: {
				required: true,
				minlength: 2,
				maxlength: 10000
			}
		},
		onkeyup: false,
		errorPlacement: function(error, element) {
		
			
			
		},
		submitHandler: function(form) {
		
			var content = $(form).serialize();
			
			$(form).find('input[type=image]').after('<img src="resources/img/contact_loader.gif" alt="" id="loaderImage" style="margin: 0 0 -5px 10px;" />');
			
			$.post("resources/php/contact_handler.php", { content: content }, function(data) {
			
				$('#loaderImage').remove();
			
				if(data == "pass") {
					$(form)[0].reset();
					$(form).find('input[type=image]').fadeOut(function() {
						$(form).append('<div class="notification">Your e-mail was successfully sent</div>').children('.notification').hide().fadeIn();
					});
				} else if(data == "fail") {
					$(form).find('input[type=image]').fadeOut(function() {
						$(form).append('<div class="notification">Your e-mail was couldn\'t be sent</div>').children('.notification').hide().fadeIn();
					});
				}
			
			});
			
			return false;
			
		}
	});

});