/*----------Data----------*/
let myLibrary = [];

// function Book(title, author, pages, status) {
//   this.title = title;
//   this.author = author;
//   this.pages = pages;
//   this.status = status ? "Finished" : "Reading";
// }

// Book.prototype.toggleStatus = function () {
//   this.status = this.status === "Reading" ? "Finished" : "Reading";
// };

class Book {
  title;
  author;
  pages;
  status;
  constructor(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status ? "Finished" : "Reading";
  }

  toggleStatus = () => {
    this.status = this.status === "Reading" ? "Finished" : "Reading";
  };
}

/*------------------------------*/

/*---------DOM Function----------*/
function createDomNode(nodeName, attribute, attibuteData, ...nodeClass) {
  let element = document.createElement(nodeName);
  if (attribute) element.setAttribute(attribute, attibuteData);
  for (let i of [...nodeClass]) {
    element.classList.add(i);
  }
  return element;
}

function createBookDom(book) {
  let bookId = getId(book);
  let bookDoom = createDomNode("div", "data-book-id", bookId, "book");
  let info = createDomNode("div", undefined, undefined, `info`);
  for (let propety in book) {
    if (typeof book[propety] === "function") continue;
    let dataDisplayer = createDomNode("p", undefined, undefined, `${propety}`);
    dataDisplayer.textContent = book[propety];
    info.appendChild(dataDisplayer);
  }
  let bookControl = createDomNode("div", undefined, undefined, "book-control");
  let toggleButton = createDomNode(
    "button",
    undefined,
    undefined,
    `toggle`,
    `button`
  );
  domBookButtonEvent(toggleButton, toggleBook, toggleStatusBookDisplay);
  let removeButton = createDomNode(
    "button",
    undefined,
    undefined,
    `remove`,
    `button`
  );
  domBookButtonEvent(removeButton, removeBook, removeBookDisplay);
  removeButton.textContent = "Remove";
  toggleButton.textContent = "Change state";
  bookControl.appendChild(toggleButton);
  bookControl.appendChild(removeButton);
  bookDoom.appendChild(info);
  bookDoom.appendChild(bookControl);
  return bookDoom;
}

function domBookButtonEvent(button, dataOperator, domOperator) {
  button.addEventListener("click", (event) => {
    let book = undefined;
    let temp = event.target;
    while (book === undefined) {
      if (temp.classList.contains("book")) book = temp;
      temp = temp.parentNode;
    }
    dataOperator(book);
    domOperator(book);
  });
}

function removeBookDisplay(node) {
  let container = document.querySelector(".container");
  container.removeChild(node);
}

function addBookDisplay(node) {
  let container = document.querySelector(".container");
  container.appendChild(node);
}

function toggleStatusBookDisplay(node) {
  let status = node.querySelector(".status");
  status.textContent =
    status.textContent === "Reading" ? "Finished" : "Reading";
}
/*------------------------------*/

/*---------DATA Functions----------*/
function removeBook(bookNode) {
  let id = bookNode.getAttribute("data-book-id");
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].id === id) {
      myLibrary.splice(i, 1);
      saveToStorage();
      return true;
    }
  }
  return false;
}

function toggleBook(bookNode) {
  let id = bookNode.getAttribute("data-book-id");
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].id === id) {
      myLibrary[i].book.toggleStatus();
      saveToStorage();
      return true;
    }
  }
  return false;
}

function addBook(book) {
  let id = getId(book);
  if (
    myLibrary.some((element) => {
      if (element.id === id) return true;
    })
  )
    return false;
  myLibrary.push({
    id: id,
    book: book,
  });
  saveToStorage();
  return true;
}

function getId(book) {
  let id =
    book.title.toLowerCase().replaceAll(/\s/g, "-") +
    "-" +
    book.author.toLowerCase().replaceAll(/\s/g, "-");
  return id;
}

function createBookFromInput() {
  let inputTitle = document.getElementById("input-book-name").value;
  let inputAuthor = document.getElementById("input-book-author").value;
  let inputPage = document.getElementById("input-book-pages").value;
  let inputState = document.getElementById("input-book-status").value;
  if (
    inputAuthor.length === 0 ||
    inputTitle.length === 0 ||
    Number.isNaN(parseInt(inputPage))
  ) {
    alert("Error Adding New Book");
    return;
  }
  let newBook = new Book(
    inputTitle,
    inputAuthor,
    parseInt(inputPage),
    inputState
  );
  return newBook;
}
/*------------------------------*/

/*----------Local Storage Implementation----------*/
function readFromStorage() {
  let localLibrary = JSON.parse(localStorage.getItem("myLibrary"));
  myLibrary = localLibrary === null ? myLibrary : localLibrary;
  for (let i = 0; i < myLibrary.length; i++) {
    Object.setPrototypeOf(myLibrary[i].book, Book.prototype);
  }
}

function saveToStorage() {
  let jsonLibrary = JSON.stringify(myLibrary);
  localStorage.setItem("myLibrary", jsonLibrary);
}
/*------------------------------*/

/*---------Big Main Function----------*/
function populateDisplay() {
  if (!myLibrary || myLibrary.length === 0) return;
  let container = document.querySelector(".container");
  for (let i = 0; i < myLibrary.length; i++) {
    let newBook = createBookDom(myLibrary[i].book);
    container.appendChild(newBook);
  }
}

function init() {
  readFromStorage();
  const modal = document.querySelector(".modal");
  const modalDisplayBtn = document.querySelector(".add-book");
  const modalInputConfirm = document.querySelector(".input-confirm");
  const modalClose = document.querySelector(".input-close");
  window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
  });
  modalDisplayBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });
  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });
  modalInputConfirm.addEventListener("click", () => {
    modal.style.display = "none";
    let newBook = createBookFromInput();
    if (!addBook(newBook)) {
      alert("Book already exist");
      return;
    }
    let newBookDom = createBookDom(newBook);
    addBookDisplay(newBookDom);
  });
}
/*------------------------------*/

init();
populateDisplay();
