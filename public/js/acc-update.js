const update = document.querySelector("#accountInfo")
    update.addEventListener("change", function () {
      const updateSub = document.querySelector("#updateSubmit")
      updateSub.removeAttribute("disabled")
    })

const pass = document.querySelector("#changePassword")
    pass.addEventListener("change", function () {
      const updatePass = document.querySelector("#passwordSubmit")
      updatePass.removeAttribute("disabled")
    })

function showPassword() {
    var x = document.getElementById("account_password");
    if (x.type === "password") {
        x.type = "text";
    } else {
            x.type = "password";
    }
}