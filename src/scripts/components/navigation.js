
window.addEventListener('load', () => {


	document.querySelectorAll('header .nav.megadropdown .dropdown').forEach((element, i) => {
		element.addEventListener('shown.bs.dropdown', async (event) => {
			let dropdown = bootstrap.Dropdown.getInstance(event.srcElement);

			if( dropdown && dropdown._popper ){
				await dropdown._popper.setOptions({
					modifiers: [
						{ 
							name: "offset",
							options: {
								offset: ({ placement, reference, popper }) => {
									if( 'bottom-start' !== placement ){
										return [0,0];
									}
									
									let reset = 0 - reference.x; // reset spacing back to 0;
									let availableSpace = document.documentElement.clientWidth - popper.width;
									
									return [reset + availableSpace / 2, 0]
								}
							}
						}
					]
				});

				
			}
		});
	});
 });
