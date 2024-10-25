const btnIncrement = document.getElementById("increment");
const btnDecrement = document.getElementById("decrement");
const inputQuantity = document.getElementById("quantity");
let valueByDefault = parseInt(inputQuantity.value) || 1;

if (btnIncrement && btnDecrement && inputQuantity) {
  btnIncrement.addEventListener("click", () => {
    valueByDefault += 1;
    inputQuantity.value = valueByDefault;
  });

  btnDecrement.addEventListener("click", () => {
    if (valueByDefault > 1) {
      valueByDefault -= 1;
      inputQuantity.value = valueByDefault;
    }
  });
}
