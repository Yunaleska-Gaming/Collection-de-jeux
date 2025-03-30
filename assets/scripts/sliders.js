      const defineSlider = (sliderElement, slideChangers) => {
        const slideWidth = sliderElement.children[0].offsetWidth;
        // Define first element as active by default
        slideChangers[0].classList.add('is-active');

        const slideToElement = element => {
          // Remove the active state
          slideChangers.forEach(el => {
            el.classList.remove('is-active');
          });
          const target = element.getAttribute('data-target');
          const children = Array.prototype.slice.call(sliderElement.children);
          const targetIndex = children.findIndex(
            child => child.getAttribute('data-slide') === target,
          );

          // slide to element
          sliderElement.style.transform = `translateX(-${targetIndex * slideWidth}px)`;
          // Add the active state
          element.classList.add('is-active');
        };

        slideChangers.forEach(element => {
          element.addEventListener('click', () => slideToElement(element));
        });
      };

      const defineVerticalTabs = (tabsContainer, tabsButton) => {
        // Define first element as active by default
        tabsButton[0].classList.add('is-active');
        tabsContainer.children[0].classList.add('is-active');

        const displayCorrectTab = element => {
          // Remove the active state
          const children = Array.prototype.slice.call(tabsContainer.children);
          children.forEach(el => {
            el.classList.remove('is-active');
          });
          const target = element.getAttribute('data-tab-target');
          const targetElement = tabsContainer.querySelector(`[data-tab="${target}"]`);

          // Add the active state
          element.classList.add('is-active');
          targetElement.classList.add('is-active');
        };

        tabsButton.forEach(element => {
          element.addEventListener('click', () => displayCorrectTab(element));
        });
      };

      defineSlider(
        document.querySelector('.slider-days'),
        document.querySelectorAll('.day-slide-changer'),
      );