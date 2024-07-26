document.addEventListener("DOMContentLoaded", function () {
  const AllBtn = document.querySelectorAll(".searchBtn");
  const SearchBar = document.querySelector(".searchBar");
  const SearchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  for (let i = 0; i < AllBtn.length; i++) {
    AllBtn[i].addEventListener("click", function () {
      SearchBar.style.visibility = "visible";
      SearchBar.classList.add("open");
      this.setAttribute("aria-expanded", "true");
      SearchInput.focus();
    });
  }

  searchClose.addEventListener("click", function () {
    SearchBar.style.visibility = "hidden";
    SearchBar.classList.remove("open");
    this.setAttribute("aria-expanded", "false");
  });
});
