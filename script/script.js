let myLibrary = [];

let modal = document.querySelector(".modal");
window.addEventListener("click", (event) => {
  if (event.target === modal) modal.style.display = "none";
});

function Book(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status ? "Finished" : "Reading";
}

Book.prototype.toggleStatus = function () {
  this.status = this.status === "Reading" ? "Finished" : "Reading";
};

function createDomNode(nodeName, attribute, attibuteData, ...nodeClass) {
  let element = document.createElement(nodeName);
  if (attribute) element.setAttribute(attribute, attibuteData);
  for (let i of [...nodeClass]) {
    element.classList.add(i);
  }
  return element;
}

function getId(title, author) {
  let id =
    title.toLowerCase().replaceAll(/\s/g, "-") +
    "-" +
    author.toLowerCase().replaceAll(/\s/g, "-");
  return id;
}

function createBookDom(book) {
  let bookId = getId(book.title, book.author);
  let returnBook = createDomNode("div", "data-book-id", bookId, "book");
  let info = createDomNode("div", undefined, undefined, `info`);
  for (let propety in book) {
    if (!book.hasOwnProperty(propety)) continue;
    let dataDisplayer = createDomNode("p", undefined, undefined, `${propety}`);
    dataDisplayer.textContent = book[propety];
    info.appendChild(dataDisplayer);
  }
  let toggleButton = createDomNode(
    "button",
    undefined,
    undefined,
    `toggle`,
    `button`
  );
  toggleButton.textContent = "Change state";
  returnBook.appendChild(info);
  returnBook.appendChild(toggleButton);
  return returnBook;
}

function populateDummy() {
  let dummyBook = new Book(
    "Just a really long ass title",
    "author",
    6969,
    true
  );
  let container = document.querySelector(".container");
  for (let i = 0; i < 3; i++) {
    container.appendChild(createBookDom(dummyBook));
  }
}

function readInputCreateBook() {
  let inputName = document.getElementById("input-book-name").value;
  let inputAuthor = document.getElementById("input-book-author").value;
  let inputPages = document.getElementById("input-book-pages").value;
  let inputStatus = document.getElementById("input-book-status").value;
  return new Book(inputName, inputAuthor, inputPages, inputStatus);
}

function buttonInitializer() {
  let addBookBtn = document.querySelector(".add-book");
  addBookBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });
  let addConfirm = document.querySelector(".input-confirm");
  let addCancel = document.querySelector(".input-close");
  addCancel.addEventListener("click", () => {
    modal.style.display = "none";
  });
  addConfirm.addEventListener("click", () => {
    modal.style.display = "none";
    console.log(readInputCreateBook());
  });
}

function addBookToLibrary(book) {
  myLibrary.push({
    id: getId(book.title, book.author),
    book: book,
  });
  let container = document.querySelector(".container");
  container.appendChild(createBookDom(book));
}

populateDummy();
buttonInitializer();
