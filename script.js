document.addEventListener("DOMContentLoaded", function () {
  const imageContainer = document.getElementById("image-container");
  const imageWrapper = imageContainer.getElementsByTagName("img");
  const loadingWrapper = document.createElement("div");
  const loading = document.createElement("img");
  loading.src = "icons/loading.gif";
  loadingWrapper.setAttribute("class", "loading");
  loadingWrapper.appendChild(loading);

  let initialFill,
    offsetValue = 0,
    indexCount = 10,
    resultingArray = [],
    dataCalled;

  async function getGif() {
    if (indexCount == 50) {
      offsetValue++;
      indexCount = 10;
    }

    let url = `https://api.giphy.com/v1/gifs/trending?api_key=LeMIcVK0WglFrL8MV3rP3IViuRxyPJmB&limit=50&offset=${offsetValue}&rating=r&bundle=messaging_non_clips&_=${new Date().getSeconds()}`;

    try {
      let response = await fetch(url);
      let responseData = await response.json();
      dataCalled = true;
      let imageDataOutside = responseData.data;
      if (imageDataOutside) {
        resultingArray = imageDataOutside;
      }
      if (initialFill && imageDataOutside) {
        displayImage();
      }
      if (!initialFill && imageDataOutside) {
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            let imageArray = imageDataOutside[i].images;
            initialContainer(imageArray, i);
          }
        }, 2000);
      }
    } catch (error) {
      console.log("Error fetching gifs: ", error);
      dataCalled = false;
    }
  }
  function initialContainer(image, indexNo) {
    for (let i = 0; i < imageWrapper.length; i++) {
      if (i === indexNo) {
        imageWrapper[i].src = image.original.url;
      }
    }
    initialFill = true;
    indexCount++;
  }

  function displayImage() {
    for (let i = indexCount - 10; i < indexCount; i++) {
      let imageDiv = document.createElement("div");
      imageDiv.setAttribute("class", "image-wrapper");
      let image = document.createElement("img");
      setTimeout(() => {
        image.src = resultingArray[i].images.original.url;
      }, 800);
      imageContainer.appendChild(imageDiv);
      imageDiv.appendChild(image);
    }
    indexCount += 10;
  }

  function scrollToBottom() {
    if (dataCalled) {
      let topScroll = document.documentElement.scrollTop;
      let totalHeight = document.documentElement.scrollHeight;
      let viewportHeight = document.documentElement.clientHeight;
      if (topScroll + viewportHeight >= totalHeight - 1) {
        document.body.appendChild(loadingWrapper);
        setTimeout(() => {
          if (indexCount == 50) {
            getGif();
          } else {
            displayImage();
          }
          loadingWrapper.remove();
        }, 2500);
      }
    }
  }

  function debounce(func, wait) {
    let timeout;

    return function executedFunction() {
      const context = this;
      const args = arguments;

      const later = function () {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedScroll = debounce(scrollToBottom, 500);

  setTimeout(() => {
    window.addEventListener("scroll", debouncedScroll);
  }, 1500);

  getGif();
});
