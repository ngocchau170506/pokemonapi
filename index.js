    const urlData = "https://pokeapi.co/api/v2/pokemon";
    const color = {
      poison: "rgb(167, 81, 166)",
      grass: "rgb(140, 223, 106)",
      fire: "rgb(255, 104, 75)",
      flying: "rgb(156, 133, 221)",
      bug: "rgb(120, 205, 86)",
      water: "rgb(99, 117, 253)",
    };

    const header = document.querySelector(".header");
    const container = document.querySelector(".container");
    const input = document.querySelector(".search_input");
    const globalLoading = document.querySelector(".global-loading");

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const fetchData = async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const render = async () => {
      globalLoading.style.display = "flex";
      await delay(2000);
      const dataList = await fetchData(urlData);
      const cardsHTML = await Promise.all(
        dataList.results.map(async (element) => {
          const response = await fetchData(element.url);
          const typeList = response.types.map((e) => {
            const typeName = e.type.name;
            return `<span style="background-color: ${color[typeName] || "#ccc"}">${typeName}</span>`;
          });
          return `
            <div class="card">
              <div class="card_id">#${response.id}</div>
              <img class="card_img" src="${response.sprites.front_default}" alt="${response.name}" />
              <div class="card_info">
                <h3 class="name">${response.name}</h3>
                <div class="card_info--attr">
                  ${typeList.join(" ")}
                </div>
              </div>
            </div>
          `;
        })
      );

      globalLoading.style.display = "none";
      header.style.display = "block";
      container.style.display = "flex";
      container.innerHTML = cardsHTML.join("");
    };

    const handleInput = async () => {
      const dataList = await fetchData(urlData);

      input.addEventListener("input", async (event) => {
        const inputValue = event.target.value.toLowerCase();
        const filteredData = dataList.results.filter((element) =>
          element.name.toLowerCase().includes(inputValue)
        );


        const cardsHTML = await Promise.all(
          filteredData.map(async (element) => {
            const response = await fetchData(element.url);
            const typeList = response.types.map((e) => {
              const typeName = e.type.name;
              return `<span style="background-color: ${color[typeName] || "#ccc"}">${typeName}</span>`;
            });
            return `
              <div class="card">
                <div class="card_id">#${response.id}</div>
                <img class="card_img" src="${response.sprites.front_default}" alt="${response.name}" />
                <div class="card_info">
                  <h3 class="name">${response.name}</h3>
                  <div class="card_info--attr">
                    ${typeList.join(" ")}
                  </div>
                </div>
              </div>
            `;
          })
        );
        globalLoading.style.display = "none";
        header.style.display = "block";
        container.style.display = "flex";
        container.innerHTML = cardsHTML.join("");
      });
    };

    const run = async () => {
      await render();
      handleInput();
    };

    run();