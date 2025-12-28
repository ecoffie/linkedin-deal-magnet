// Vanilla JS
// does not need an onload as long as it is included at the bottom of the page
(function() {
    var glblnav = document.getElementById('globalnavcontainer'),
        wrapper = document.getElementsByClassName('wrapper'),
        xhr = new XMLHttpRequest(),
        jumpToMain, jumpToMainLink, jumpToMainId, jumpToMainTabIndex, nextSibling;

    // add global nav to page, if does not exist
    if (!glblnav) {
        glblnav = document.createElement('div');
        glblnav.id = "globalnavcontainer";
        document.body.prepend(glblnav);
    }
    // adjust page for nav
    for (var i = 0; i < wrapper.length; i++) {
        wrapper[i].classList.add('globalnavisloaded');
    }

    // select the next sibling element after the global navigation container
    nextSibling = glblnav.nextElementSibling;
    // skip to the next sibling if on an inline tag
    while (nextSibling && (['A', 'SPAN'].includes(nextSibling.tagName))) {
        nextSibling = nextSibling.nextElementSibling;
    }

    // create a keyboard accessible skip-to-main-content button
    // CSS shifts the button off the top of the page. When focused it appears at the top
    if (nextSibling) {
        // use the ID already on the element, if it has one
        jumpToMainId = (nextSibling.id) ? nextSibling.id : 'skip-repetitive-content';
        nextSibling.id = jumpToMainId;
        // use the tabindex already on the element, if it has one
        jumpToMainTabIndex = (nextSibling.getAttribute('tabindex')) ? nextSibling.getAttribute('tabindex') : '-1';
        nextSibling.setAttribute('tabindex', jumpToMainTabIndex);

        jumpToMain = document.createElement('div');
        jumpToMain.id = 'skip-repetitive-content-link';
        jumpToMainLink = document.createElement('a');
        jumpToMainLink.href = '#' + jumpToMainId;
        jumpToMainLink.title = "moves focus past all the repetitive content at the top of the page";
        jumpToMainLink.innerText = 'Skip to Main Content';
        jumpToMain.append(jumpToMainLink);
        // places the jump link at the very top of the DOM (1st element in tab indexing)
        document.body.prepend(jumpToMain);

        jumpToMainLink.addEventListener('click', jumpToMainClick.bind(this, nextSibling));
    }
    
    // when the HTML is ready inject it into the navbar
    xhr.onreadystatechange = function () { 
        if (xhr.readyState == 4 && xhr.status == 200) {
            glblnav.innerHTML = xhr.responseText;
        }
    }

    // request the footer HTML
    xhr.open("GET", "/e2/global/rv7/topnav/navbar.html", true);
    xhr.setRequestHeader('Content-type', 'text/html');
    xhr.send();

 })();

 window.addEventListener("load", (event) => {
    var featuresLabelLink = document.querySelector("#featureslabelink a");
    // this element provides the URL, and overriding the --navbarlabel CSS variable changes link text (default: "FEATURES")
    var dataExists = document.getElementById("globalnavbarlabellink");

    if (featuresLabelLink && dataExists) {
        var flLinkLocation = document.getElementById("globalnavbarlabellink").getAttribute('data-labellink');
        featuresLabelLink.setAttribute('href', flLinkLocation);
    } else if (featuresLabelLink) {
        // if this element is next to the search menu toggle it hides the "search" text, to make room
        // so, removing it shows the search text
        document.querySelector("#featureslabelink").remove();
    }

    // expand the main menu container while focused within
    var menuContainer = document.querySelector("#globalnavcontainer .menu-container");
    var menuCheckbox = document.querySelector("#globalnavmenutoggle");
    showWhileFocused(menuContainer, menuCheckbox);

    // expand the search container while focused within
    var searchContainer = document.querySelector("#govsearchbar");
    var searchCheckbox = document.querySelector("#govsearch");
    showWhileFocused(searchContainer, searchCheckbox);
});

function showWhileFocused(containerEl, checkboxEl) {
    if (containerEl && checkboxEl) {
        containerEl.addEventListener('focusin', () => {
            checkboxEl.checked = true;
        });
        containerEl.addEventListener('focusout', () => {
            // the document.activeElement is not available until after a timeout
            setTimeout(() => {
                var active = document.activeElement;
                // if the active element is the container, something in the container, or the body element
                // (body element is returned for click events)
                var inside = (containerEl == active || containerEl.contains(active) || active === document.body);
                
                // if the active element is no longer in the container, close it
                if (!inside) {
                    checkboxEl.checked = false;
                }
            }, 1);
        });
    }
}

// jumphashes do not change focus, so we need to focus and scroll manually
function jumpToMainClick(wrapper, event) {
    event.preventDefault();
    wrapper.focus();
    wrapper.scrollIntoView();
}