// import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js';
// import { Dropdown } from 'bootstrap';

window.addEventListener('load', () => {


	document.querySelectorAll('header .nav.megadropdown .dropdown').forEach((element, i) => {
		element.addEventListener('shown.bs.dropdown', async (event) => {
			let dropdownMenu = event.currentTarget.querySelector('.dropdown-menu');
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
			// if( popoverInstance && popoverInstance._menu ){
			// 	let style = window.getComputedStyle(popoverInstance._menu);
			// 	let transform = style.transform || style.getPropertyValue("transform");
				
				
			// 	console.log( transform );
			// }
			// console.log( dropdownMenu );
			
			// dropdownMenu.style.transform = 'translateX(14vw)';
		});
	});
 });
