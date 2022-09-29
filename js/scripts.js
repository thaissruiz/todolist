// Seleção de elementos
//Essas variaveis selecionam todos os elementos do Html ja existentes
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue; // Essa variavel armazena o input antes da edicao

// Funções
//Tentar entender esse ()
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div"); //Referente ao container do todo que ira ser criado somente em JS
  todo.classList.add("todo"); //Adiciona o todo a lista de classes

  const todoTitle = document.createElement("h3"); //O valor que for inserido pelo usuario no HTML sera armazenado dentro do H3 em JS
  todoTitle.innerText = text; // O innerText captura o texto
  todo.appendChild(todoTitle); // O appendChild esta adicionando o todoTitle dentro da div todo

  const doneBtn = document.createElement("button"); //Botao criado em JS
  doneBtn.classList.add("finish-todo"); //Classe criada para definir o botao que dira que a tarefa foi realizada
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button"); //Botao criado em JS
  editBtn.classList.add("edit-todo"); //Classe criada para definir o botao que dira que a tarefa foi editada
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'; //Classe criada com Icone advindo de font awsome
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button"); //Botao criado em JS
  deleteBtn.classList.add("remove-todo"); //Classe criada para definir o botao que dira que a tarefa foi apagada
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 }); //Variavel que armazenara o que foi salvo
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Utilizando dados da localStorage // Dados que foram armazenados
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    default:
      break;
  }
};

// Eventos

//Toda vez que houver um submit ele ira por padrao armazenar o valor do todoInput dentro da variavel inputValue
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;
  //Se tiver arquivo salvo armazena dentro da variavel saveTodo
  if (inputValue) {
    saveTodo(inputValue);
  }
});
//Toda vez que houver um evento de Click, ele ira :
document.addEventListener("click", (e) => {
  const targetEl = e.target; //Evento dentro do Elemento alvo
  const parentEl = targetEl.closest("div"); //O closest()método pesquisa na árvore DOM por elementos que correspondam a um seletor CSS especificado.
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    //Se o elemento clicado for o botao finalizado
    parentEl.classList.toggle("done"); //Elemento e armazenado no toggle como done e risca.

    updateTodoStatusLocalStorage(todoTitle); //Funcao que fara que o H3 seja atualizado no local storage
  }

  if (targetEl.classList.contains("remove-todo")) {
    //Se o elemento clicado for botao remover, ira eliminar a tarefa
    parentEl.remove();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle); //Removera o valor armazenado ni h3 do local storage
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms(); //Se o elemento clicado for botao editar, ira editar a tarefa

    editInput.value = todoTitle; //O valor da variavel editInput ficara salvo todoTitle
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  //Se o elemento clicado for botao editar, ira editar a tarefa
  e.preventDefault();
  toggleForms(); //E o formulario ira esconder a informacao anterior e substituir por vazio
});

editForm.addEventListener("submit", (e) => {
  // Se o elemento clicado for a opcao de editar o formulario:
  e.preventDefault();

  const editInputValue = editInput.value; //Armazenara as alteracoes realizadas na variavel editInputValue

  if (editInputValue) {
    //Caso a variavel seja preenchida
    updateTodo(editInputValue); //Substitua o valor anterior do texto pelo recentemente editado
  }

  toggleForms(); //Apos finalizado troca e esconde substituindo por vazio
});

searchInput.addEventListener("keyup", (e) => {
  //Quando indetificat que a chave search foi clicada
  const search = e.target.value; //Dentro do search salva o valor do elemento pesquisado.

  getSearchedTodos(search); //Funcao que ira pegar os dados pesquisados na variavel search
});

eraseBtn.addEventListener("click", (e) => {
  //Quando clicar no botao apagar
  e.preventDefault();

  searchInput.value = ""; //Vazio dentro da variabel searchInput

  searchInput.dispatchEvent(new Event("keyup")); //Ultimo passa para disparar um evento
});

filterBtn.addEventListener("change", (e) => {
  //Quando houver um change no botao filtro
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
