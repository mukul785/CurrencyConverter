import CONFIG from './config.js';

const API_URL = `https://v6.exchangerate-api.com/v6/${CONFIG.API_KEY}/latest/`;

const currencyOneEl = document.getElementById("currency-one");
const currencyTwoEl = document.getElementById("currency-two");
const amountOneEl = document.getElementById("amount-one");
const amountTwoEl = document.getElementById("amount-two");
const rateEl = document.getElementById("rate");

async function fetchCurrencies() {
  try {
    // Fetch USD as the base currency
    const response = await fetch(`${API_URL}USD`);
    const data = await response.json();

    if (data.result === "success") {
      const currencies = Object.keys(data.conversion_rates);

      // Populate currency dropdowns
      populateDropdown(currencyOneEl, currencies);
      populateDropdown(currencyTwoEl, currencies);

      // Set default selections
      currencyOneEl.value = "USD";
      currencyTwoEl.value = "EUR";

      // Perform initial calculation
      calculate();
    } else {
      alert("Failed to fetch currency data!");
    }
  } catch (error) {
    console.error("Error fetching currencies:", error);
    alert("Error fetching currency data!");
  }
}

function populateDropdown(dropdown, currencies) {
  dropdown.innerHTML = currencies
    .map((currency) => `<option value="${currency}">${currency}</option>`)
    .join("");
}

async function calculate() {
  const currencyOne = currencyOneEl.value;
  const currencyTwo = currencyTwoEl.value;
  const amountOne = parseFloat(amountOneEl.value) || 0;

  try {
    const response = await fetch(`${API_URL}${currencyOne}`);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.conversion_rates[currencyTwo];
      rateEl.innerText = `1 ${currencyOne} = ${rate.toFixed(2)} ${currencyTwo}`;

      // Update the second amount
      amountTwoEl.value = (amountOne * rate).toFixed(2);
    } else {
      alert("Failed to fetch exchange rate!");
    }
  } catch (error) {
    console.error("Error calculating exchange rate:", error);
    alert("Error calculating exchange rate!");
  }
}

// Event Listeners
currencyOneEl.addEventListener("change", calculate);
currencyTwoEl.addEventListener("change", calculate);
amountOneEl.addEventListener("input", calculate);
amountTwoEl.addEventListener("input", async () => {
  const currencyOne = currencyOneEl.value;
  const currencyTwo = currencyTwoEl.value;
  const amountTwo = parseFloat(amountTwoEl.value) || 0;

  try {
    const response = await fetch(`${API_URL}${currencyTwo}`);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.conversion_rates[currencyOne];
      amountOneEl.value = (amountTwo * rate).toFixed(2);
    }
  } catch (error) {
    console.error("Error calculating reverse rate:", error);
  }
});

// Fetch currencies on load
fetchCurrencies();
