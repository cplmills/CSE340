const form = document.querySelector("#updateForm");
    console.log(form);
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button");
      updateBtn.removeAttribute("disabled");
    })