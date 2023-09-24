const users = [];

// вытаскиваем данные из API (получаем имя/фамилию/email/возраст)
function getUserData() {
    fetch('https://randomuser.me/api/?results=50')
        .then(response => response.json())
        .then(data => {
            const results = data.results;

            results.forEach(result => {
                const user = {
                    name: result.name.first,
                    surname: result.name.last,
                    age: result.dob.age,
                    email: result.email
                };
                users.push(user);
            });

            // после загрузки данных, отображаем пользователей и настраиваем ползунок
            displayUserCards(users);
            setupAgeSlider();
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных: ', error);
        });
}

// отрисовываем карточку пользователя
function displayUserCards(usersToDisplay) {
    const userCardsElement = document.querySelector(".container__cards");
    userCardsElement.innerHTML = ""; // очищаем содержимое перед обновлением

    usersToDisplay.forEach(user => {
        const userCard = createUserCard(user);
        userCardsElement.appendChild(userCard);
    });
}

// создаем карточку пользователя
function createUserCard(user) {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");

    const userName = createPersonInfo(["user-card__info", "user-card__name"], "div" , `${user.name} ${user.surname}`);
    const userAge = createPersonInfo(["user-card__info"], "div", `Возраст: ${user.age}`);
    const userEmail = createPersonInfo(["user-card__info", "user-card__email"], "a", `${user.email}`);

    userEmail.href = `mailto:${user.email}`;
    userEmail.target = "_blank"; // Открывать ссылку в новой вкладке

    userCard.appendChild(userName);
    userCard.appendChild(userAge);
    userCard.appendChild(userEmail);

    return userCard;
}

// создаем элементы пользовательских данных
function createPersonInfo(classNames, element, text) {
    const userPersonInfo = document.createElement(element);

    classNames.forEach((className) => {
        userPersonInfo.classList.add(className);
    });

    userPersonInfo.textContent = text;

    return userPersonInfo;
}

// функция для настройки ползунка (документация https://refreshless.com/nouislider/)
function setupAgeSlider() {
    const ageRange = [0, 100]; // начальные значения диапазона
    const ageRangeElement = document.querySelector("#age-slider");

    noUiSlider.create(ageRangeElement, {
        start: ageRange, // установка начальных значений
        connect: true, // связать две точки
        range: {
            'min': 0,
            'max': 100
        }
    });

    const minAgeDisplay = document.querySelector(".min-age");
    const maxAgeDisplay = document.querySelector(".max-age");

    // обработчик изменения ползунка
    ageRangeElement.noUiSlider.on("update", function (values) {
        const minAge = Math.round(values[0]);
        const maxAge = Math.round(values[1]);
        minAgeDisplay.textContent = minAge;
        maxAgeDisplay.textContent = maxAge;

        // фильтруем пользователей по диапазону возраста
        const filteredUsers = users.filter(user => user.age >= minAge && user.age <= maxAge);
        displayUserCards(filteredUsers);
    });
}

getUserData();
