console.clear();
import { fromEvent, interval, merge } from 'rxjs';
import { throttle } from 'rxjs/operators';

const elFullpageContainer = document.querySelector('#fullpage');
const elSectionContainer = document.querySelectorAll('.section');

window.onload = function() {
	document
		.querySelectorAll('[section-active]')
		.forEach(el => delete el.dataset.sectionActive);

	elSectionContainer[0].dataset.sectionActive = true;
};

const events = ['scroll', 'wheel', 'touchmove', 'touchend'];

const eventStreams$ = events.map(event =>
	fromEvent(window, event, { passive: true })
);
const allEvents$ = merge(...eventStreams$);

allEvents$.pipe(throttle(ev => interval(1100))).subscribe(event => {
	if (event.deltaY < 0) {
		for (let i = 0; i < elSectionContainer.length; i++) {
			if (
				elSectionContainer[i].dataset.sectionActive &&
				elFullpageContainer.firstElementChild !== elSectionContainer[i]
			) {
				delete elSectionContainer[i].dataset.sectionActive;
				elSectionContainer[i - 1].dataset.sectionActive = true;
				break;
			}
		}
	} else {
		for (let i = 0; i < elSectionContainer.length; i++) {
			if (
				elSectionContainer[i].dataset.sectionActive &&
				elFullpageContainer.lastElementChild !== elSectionContainer[i]
			) {
				delete elSectionContainer[i].dataset.sectionActive;
				elSectionContainer[i + 1].dataset.sectionActive = true;
				break;
			}
		}
	}
});
