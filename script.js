const form = document.querySelector("#search-form");
const input = document.querySelector("#game-search");
const results = document.querySelector("#results");
const message = document.querySelector("#message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = input.value.trim();
  if (!title) return;

  message.textContent = "Searching for deals...";
  results.replaceChildren();

  try {
    const url = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&pageSize=12&onSale=1`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("API request failed");

    const deals = await response.json();
    message.textContent = deals.length ? "Here are the deals we found:" : "No deals found. Try another game.";

    deals.forEach((deal) => {
      const card = document.createElement("article");
      const image = document.createElement("img");
      image.src = deal.thumb;
      image.alt = `${deal.title} game thumbnail`;
      image.loading = "lazy";

      const name = document.createElement("h3");
      name.textContent = deal.title;

      const price = document.createElement("p");
      price.textContent = `$${deal.salePrice} (usually $${deal.normalPrice})`;

      const link = document.createElement("a");
      link.href = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;
      link.textContent = "View deal";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      card.append(image, name, price, link);
      results.append(card);
    });
  } catch (error) {
    message.textContent = "Couldn't load deals. Please try again.";
  }
});
