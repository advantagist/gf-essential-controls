document.addEventListener("DOMContentLoaded", () => {
  //------- Custom Input Text  Script-------------------------------------------

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
    const optionsContainer = customSelect.querySelector(".options-container");
    const searchInput = customSelect.querySelector(".search-input");
    let options = customSelect.querySelectorAll(".option");
    const selectReset = document.querySelector(".inpResetBtn--select");

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

    // Select option
    const bindOptionClick = () => {
      options.forEach((option) => {
        option.addEventListener("click", (e) => {
          selected.textContent = option.textContent;
          selected.dataset.value = option.dataset.value;
          searchInput.value = option.textContent;
          e.stopPropagation();
          customSelect.classList.remove("open");

          filterOptions("");
          currentIndex = -1;
        });
      });
    };

    bindOptionClick();

    //Reset Select

    selectReset.addEventListener("click", (e) => {
      const container = e.target.closest(".cont__inp--white");
      const input = container?.querySelector("input");
      const allOptions = customSelect.querySelectorAll(".option");
      if (input) {
        input.value = "";
        selected.dataset.value = "";
        selected.textContent = "";
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
        const match = option.textContent.toLowerCase().includes(searchTerm);
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

  //------- Text Area t-------------------------------------------

  document
    .querySelectorAll(".textareaCounterContainer")
    .forEach((textareaCounterContainer) => {
      const customTextarea =
        textareaCounterContainer.querySelector(".custom-textarea");
      const input = customTextarea.querySelector(".textarea--white--med");

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
        shiftContent();
      });

      //Shifting Reset button and content if there's no
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
        charLimit.textContent = `${maxLength}`;

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
