document.addEventListener("DOMContentLoaded", () => {
  //------- Custom Input Text  Script-------------------------------------------

  const bgSwitch = document.querySelector(".bg-switch");
  const section = document.querySelector(".sectionContainer");
  bgSwitch.addEventListener("click", () => {
    if (section.classList.contains("sectionWhiteTheme")) {
      section.classList.replace("sectionWhiteTheme", "sectionGrayTheme");
      bgSwitch.innerText = "White background";
    } else {
      section.classList.replace("sectionGrayTheme", "sectionWhiteTheme");
      bgSwitch.innerText = "Gray background";
    }
  });
  const inputReset = document.querySelectorAll(".inpResetBtn");
  inputReset.forEach((el) => {
    el.addEventListener("click", (e) => {
      const container = e.target.closest(".cont__inp--white");
      const input = container?.querySelector("input");
      if (input) {
        input.value = "";
      }
    });
  });

  //------- Custom Single Choice Select Script -----------------------------

  document.querySelectorAll(".custom-select").forEach((customSelect) => {
    const selected = customSelect.querySelector(".selected");
    const isMultiChoice = customSelect
      ? customSelect.classList.contains("custom-select--multi")
      : false;
    const optionsContainer = customSelect.querySelector(".options-container");
    const searchInput = customSelect.querySelector(".search-input");
    let options = customSelect.querySelectorAll(".option");
    const selectReset = document.querySelector(".inpResetBtn--select");
    const selectedOptions = [];

    let currentIndex = -1;

    // Toggle dropdown
    customSelect.addEventListener("click", (e) => {
      if (!e.target.closest(".inpResetBtn--select")) {
        customSelect.classList.toggle("open");
        if (customSelect.classList.contains("open")) {
          searchInput.focus();
        }
      }
    });

    //Create a tag
    function createTag(contentValue) {
      const container = document.createElement("div");
      const content = document.createElement("div");
      const tagRemoveButton = document.createElement("div");
      const resetButton = document.createElement("div");

      container.classList.add("tag", "tagSelected");
      content.classList.add("tagContent");
      content.innerText = contentValue;
      tagRemoveButton.classList.add("inp-buttons--tag");
      tagRemoveButton.setAttribute("tabindex", "0");
      resetButton.classList.add("inpResetBtn");
      resetButton.innerHTML = `
      <svg
          class="deleteCross"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 1.90137L4.90137 4L7 6.09863L6.09863 7L4 4.90137L1.90137 7L1 6.09863L3.09863 4L1 1.90137L1.90137 1L4 3.09863L6.09863 1L7 1.90137Z" />
        </svg>
      `;

      tagRemoveButton.addEventListener("click", function () {
        options.forEach((option) => {
          const control = option.querySelector(".CheckRadioContainer");
          if (control.innerText === content.innerText) {
            updateSelectedOptions("remove", content.innerText);
            control.firstElementChild.checked = false;
          }
        });
        this.parentNode.remove();
      });

      tagRemoveButton.appendChild(resetButton);
      container.append(content, tagRemoveButton);

      return container;
    }

    // Select option
    const bindOptionClick = (isMultiChoice) => {
      if (!isMultiChoice) {
        options.forEach((option) => {
          option.addEventListener("click", (e) => {
            selected.innerText = option.innerText;
            selected.dataset.value = option.dataset.value;
            searchInput.value = option.innerText;
            e.stopPropagation();
            customSelect.classList.remove("open");

            filterOptions("");
            currentIndex = -1;
          });
        });
      } else {
        options.forEach((option) => {
          option.addEventListener("click", (e) => {
            let isChecked = option.querySelector(
              'input[type="checkbox"]',
            ).checked;

            if (e.target.classList.contains("CheckRadioContainer")) {
              const optionContent = option.querySelector("label").innerText;

              if (!isChecked && optionContent) {
                updateSelectedOptions("add", optionContent);
              } else {
                updateSelectedOptions("remove", optionContent);
              }

              redrawTags();

              e.stopPropagation();
            }
          });
        });
      }
    };

    bindOptionClick(isMultiChoice);

    //Updated Selected Options in Multiple Choice Select
    function updateSelectedOptions(action, element) {
      if (action === "remove") {
        const index = selectedOptions.indexOf(element);
        if (index !== -1) {
          selectedOptions.splice(index, 1);
        }
      } else if (action === "add") {
        selectedOptions.push(element);
        selectedOptions.sort();
      }
    }

    //Redraw Tags in Multiple Choice Select Alphabetically

    function redrawTags() {
      if (selected) {
        // Remove existing tags
        selected.querySelectorAll(".tag").forEach((el) => {
          selected.removeChild(el);
        });

        // Add new tags
        selectedOptions.forEach((option) => {
          selected.appendChild(createTag(option));
        });
      } else {
        return;
      }
    }

    //Reset Select

    selectReset.addEventListener("click", (e) => {
      const container = e.target.closest(".cont__inp--white");
      const input = container?.querySelector("input");
      const allOptions = customSelect.querySelectorAll(".option");
      if (input) {
        input.value = "";
        selected.dataset.value = "";
        selected.innerText = "";
        allOptions.forEach((option) => {
          option.style.display = "";
        });
        filterOptions("");
      }
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove("open");
      }
    });

    // Filter options on input
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterOptions(searchTerm);
    });

    function filterOptions(searchTerm) {
      const allOptions = customSelect.querySelectorAll(".option");
      allOptions.forEach((option) => {
        const match = option.innerText.toLowerCase().includes(searchTerm);
        option.style.display = match ? "" : "none";
      });
      options = [...customSelect.querySelectorAll(".option")].filter(
        (opt) => opt.style.display !== "none",
      );

      if (
        options.length === 0 &&
        !optionsContainer.querySelector(".nothingfound")
      ) {
        const nothingFound = document.createElement("div");
        nothingFound.classList.add("option", "nothingfound");
        nothingFound.innerText = `${searchTerm} is not found`;
        optionsContainer.appendChild(nothingFound);
      } else {
        optionsContainer.querySelector(".nothingfound").remove();
      }

      currentIndex = -1;
    }

    // Keyboard navigation
    customSelect.addEventListener("keydown", (e) => {
      const isOpen = customSelect.classList.contains("open");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) {
          customSelect.classList.add("open");
          searchInput.focus();
        } else {
          currentIndex = (currentIndex + 1) % options.length;
          highlightOption();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (isOpen) {
          currentIndex = (currentIndex - 1 + options.length) % options.length;
          highlightOption();
        }
      } else if (e.key === "Enter") {
        if (isOpen && currentIndex > -1) {
          options[currentIndex].click();
        }
      } else if (e.key === "Escape") {
        customSelect.classList.remove("open");
      }
    });

    function highlightOption() {
      options.forEach((opt) => opt.classList.remove("active"));
      if (currentIndex > -1 && options[currentIndex]) {
        options[currentIndex].classList.add("active");
        options[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  });

  //------- Text Area -------------------------------------------

  document
    .querySelectorAll(".textareaCounterContainer")
    .forEach((textareaCounterContainer) => {
      const customTextarea =
        textareaCounterContainer.querySelector(".custom-textarea");
      const input = customTextarea.querySelector(
        ".textarea--white--med, .textarea--dark--med ",
      );

      const resetButton = customTextarea.querySelector(
        ".inp-buttons--textArea",
      );
      const textArea = customTextarea.querySelector("textarea");
      const maxLength = +textArea.getAttribute("maxlength");
      const characterCounter =
        textareaCounterContainer.querySelector(".characterCounter");
      const charLimit = characterCounter.querySelector(".maxIndicator");

      //Checking if there is scroll
      let hasScroll = () => {
        return (
          textArea &&
          textArea.scrollHeight > textArea.getBoundingClientRect().height
        );
      };

      //Reset textarea

      resetButton.addEventListener("click", () => {
        textArea.value = "";
        countCharacters();
        shiftContent();
      });

      //Shifting Reset button and content if there's no scrollbar
      function shiftContent() {
        if (!hasScroll() || !textArea.value) {
          resetButton.style.right = 0;
          input.style.paddingRight = 28 + "px";
        } else {
          resetButton.style.right = "";
          input.style.paddingRight = "";
        }
      }

      function countCharacters() {
        if (!characterCounter) return;
        const currentLength = textArea.value.length;
        characterCounter.firstChild.textContent = `${currentLength} / `;
        charLimit.innerText = `${maxLength}`;
        console.log(characterCounter);
        console.log(charLimit.innerText);

        if (currentLength > maxLength - 1) {
          charLimit.classList.add("charLimit");
        } else {
          charLimit.classList.remove("charLimit");
        }
      }
      shiftContent();
      countCharacters();
      customTextarea.addEventListener("input", shiftContent);
      customTextarea.addEventListener("input", countCharacters);
      window.addEventListener("resize", shiftContent);
      const resizeObserver = new ResizeObserver(() => {
        shiftContent();
      });

      resizeObserver.observe(textArea);
    });
});
