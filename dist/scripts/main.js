// The script must run after the HTML page has loaded
/**
* TIMER
*/

function launchShowTimeToMidnight() {
    let hoursCellArray = document.getElementsByClassName('hours');
    let minutesCellArray = document.getElementsByClassName('minutes');
    let secondsCellArray = document.getElementsByClassName('seconds');

    function showTimeToMidnight() {
        let now = new Date();
        let nowHours = now.getHours();
        let nowMinutes = now.getMinutes();
        let nowSeconds = now.getSeconds();

        let hoursToMidnight = 0;
        let minutesToMidnight = 0;
        let secondsToMidnight = 0;

        // Get hours to midnight
        function getHoursToMidnight() {
            if (nowMinutes === 0 && nowSeconds === 0) {
                hoursToMidnight = 24 - nowHours;
            } else {
                hoursToMidnight = 23 - nowHours;
            }
            hoursToMidnight = String(hoursToMidnight);
            return hoursToMidnight.length === 2 ? hoursToMidnight : '0' + hoursToMidnight;
        }

        // Get minutes to midnight
        function getMinutesToMidnight() {
            if (nowMinutes === 0 && nowSeconds === 0) {
                minutesToMidnight = 0;
            } else {
                minutesToMidnight = 59 - nowMinutes;
            }
            minutesToMidnight = String(minutesToMidnight);
            return minutesToMidnight.length === 2 ? minutesToMidnight : '0' + minutesToMidnight;
        }

        // Get seconds to midnight
        function getSecondsToMidnight() {
            if (nowSeconds === 0) {
                secondsToMidnight = 0;
            } else {
                secondsToMidnight = 60 - nowSeconds;
            }
            secondsToMidnight = String(secondsToMidnight);
            return secondsToMidnight.length === 2 ? secondsToMidnight : '0' + secondsToMidnight;
        }

        // Update timer cells

        for (let item of hoursCellArray) {
            item.textContent = getHoursToMidnight();
        }
        for (let item of minutesCellArray) {
            item.textContent = getMinutesToMidnight();
        }
        for (let item of secondsCellArray) {
            item.textContent = getSecondsToMidnight();
        }


        setTimeout(showTimeToMidnight, 200);
    }


    showTimeToMidnight();

}


launchShowTimeToMidnight();


/**
 * 
 * 
 * - - - SLIDER - - -
 * 
 * 
 */
function launchSlider() {
    const sliderRow = document.querySelector('.slider__row');
    const sliderCellArr = document.querySelectorAll('.slider__cell'); // NodeList, pseudo-array
    const sliderCell = document.querySelector('.slider__cell');
    const widthSliderCell = sliderCell.offsetWidth; // 440
    
    const dotsLiveCollection = document.getElementsByClassName('slider-dots__item'); // HTMLCollection
    const sliderDots = document.querySelector('.slider-dots'); // DOM element

    const leftButton = document.querySelector('.slider__arrows_left');
    const rightButton = document.querySelector('.slider__arrows_right');

    let nextActiveElementNumber = 0;
    let offset = 0; // Offset from left side

    function processLeftClickArrow(event, nextActiveElementNumber = 1) {
        if (event.target.classList.contains('slider__arrows_left')) {
            // Move slider dots
            processDotClick(event);
        }
        offset = offset - (widthSliderCell * nextActiveElementNumber); // ! WORK HERE
        if (offset < 0) {
            offset = widthSliderCell * (sliderCellArr.length - 1);
        }
        sliderRow.style.left = -offset + 'px';
    }


    function processRightClickArrow(event, nextActiveElementNumber = 1) {
        if (event.target.classList.contains('slider__arrows_right')) {
            // Move slider dots
            processDotClick(event);
        }
        offset = offset + (widthSliderCell * nextActiveElementNumber); // ! WORK HERE
        if (offset > widthSliderCell * 2) {
            offset = 0;
        }
        sliderRow.style.left = -offset + 'px';
    }


    function processDotClick(event) {
        // DOM element
        const dotActiveElement = document.getElementsByClassName('slider-dots__item_active')[0];
        // NUMBER active dot
        let dotActiveNumberElement = Array.from(dotsLiveCollection).indexOf(dotActiveElement);
        // REMOVE from active dot class '.slider-dots__item_active'
        dotActiveElement.classList.remove('slider-dots__item_active');
        // Processing left click on arrow
        if (event.target.classList.contains('slider__arrows_left')) {
            nextActiveElementNumber--;
            if (nextActiveElementNumber < 0) {
                nextActiveElementNumber = dotsLiveCollection.length - 1;
            }
        }
        // Processing right click on arrow
        if (event.target.classList.contains('slider__arrows_right')) {
            nextActiveElementNumber++;
            if (nextActiveElementNumber > dotsLiveCollection.length - 1) {
                nextActiveElementNumber = 0;
            }
        }
        // Processing click on dots
        if (event.target.classList.contains('slider-dots__item')) {
            nextActiveElementNumber = Array.from(dotsLiveCollection).indexOf(event.target); // Number
            // Processing move dot to the right
            if (nextActiveElementNumber > dotActiveNumberElement && nextActiveElementNumber <= (dotsLiveCollection.length - 1)) {
                processRightClickArrow(event, nextActiveElementNumber - dotActiveNumberElement);
            }

            // Processing move dot to the left
            if (nextActiveElementNumber < dotActiveNumberElement && nextActiveElementNumber >= 0 ) {
                processLeftClickArrow(event, dotActiveNumberElement - nextActiveElementNumber);
            }
        }
        // Add to next active dot class '.slider-dots__item_active'
        dotsLiveCollection[nextActiveElementNumber].classList.add('slider-dots__item_active');
    }

    leftButton.addEventListener('click', processLeftClickArrow);
    rightButton.addEventListener('click', processRightClickArrow);
    sliderDots.addEventListener('click', processDotClick)
}


launchSlider();


/**
 * 
 * 
 * - - - TELEGRAM BOT - - -
 * 
 */
function launchTelegramBot() {
    // API - address where we send the request
    const API = '/api/send-message';

    async function sendEmailTelegram(event) {
        event.preventDefault();

        const form = event.target;
        const formBtn = document.querySelector('#form-order #order-button');
        const formData = new FormData(form);
        const fromDataObject = Object.fromEntries(formData.entries());

        const { name, phone } = fromDataObject;

        try {
            formBtn.textContent = 'Не закривайте цю сторінку, доки надсилаються дані...';
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, phone })
            });

            if (response.ok) {
                alert('Дякуємо! Ваше замовлення прийнято. Ми зв`яжемось з Вами найближчим часом.');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error(error);
            alert('Нажаль ми не отримали Ваші дані. Будь-ласка, знову введіть Ваші дані та натисність на кнопку "ОФОРМИТИ ЗАМОВЛЕННЯ".');
        } finally {
            formBtn.textContent = 'ОФОРМИТИ ЗАМОВЛЕННЯ';
        }
    }
}


launchTelegramBot();

//# sourceMappingURL=main.js.map
