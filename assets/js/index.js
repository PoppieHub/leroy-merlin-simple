const users = [];

// вытаскиваем данные из API (получаем имя/фамилию/email/возраст)
const getUserData = () => {
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
const displayUserCards = (usersToDisplay) => {
    const userCardsElement = document.querySelector(".container__cards");
    userCardsElement.innerHTML = ""; // очищаем содержимое перед обновлением

    usersToDisplay.forEach(user => {
        const userCard = createUserCard(user);
        userCardsElement.appendChild(userCard);
    });
}

// создаем карточку пользователя
const createUserCard = (user) => {
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
const createPersonInfo = (classNames, element, text) => {
    const userPersonInfo = document.createElement(element);

    classNames.forEach((className) => {
        userPersonInfo.classList.add(className);
    });

    userPersonInfo.textContent = text;

    return userPersonInfo;
}

// функция для настройки двух ползунков
function setupAgeSlider() {
    const minAgeSlider = document.querySelector("#min-age-slider");
    const maxAgeSlider = document.querySelector("#max-age-slider");
    const minAgeDisplay = document.querySelector(".min-age");
    const maxAgeDisplay = document.querySelector(".max-age");

    minAgeSlider.addEventListener("input", updateAgeRange);
    maxAgeSlider.addEventListener("input", updateAgeRange);

    function updateAgeRange() {
        const minAgeValue = parseInt(minAgeSlider.value);
        const maxAgeValue = parseInt(maxAgeSlider.value);

        // проверка, что левый ползунок не превышал правый
        if (minAgeValue >= maxAgeValue) {
            minAgeSlider.value = maxAgeValue;
        }

        // проверка, что правый ползунок не был меньше левого
        if (maxAgeValue <= minAgeValue) {
            maxAgeSlider.value = minAgeValue;
        }

        minAgeDisplay.textContent = minAgeValue;
        maxAgeDisplay.textContent = maxAgeValue;

        // фильтруем пользователей по диапазону возраста
        const filteredUsers = users.filter(user => user.age >= minAgeValue && user.age <= maxAgeValue);
        displayUserCards(filteredUsers);
    }
}

getUserData();
