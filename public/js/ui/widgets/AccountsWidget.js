/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (element) {
      this.element = element;
    } else {
      throw new Error ('ошибка');
    }
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccount = document.querySelector('.create-account');
    createAccount.addEventListener('click', (event) => {
    if (event.target.classList.contains('create-account')) {
      App.getModal('new-account').open();
    } 
    if (event.target.classList.contains('account')) {
      this.onSelectAccount(event.target);
    }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const userActive = User.current();
    if (userActive) {
      Account.list(userActive, (err, response) => {
        this.clear();
        response.data.forEach(item => { 
          item.render();
        });
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accountList = document.querySelectorAll('.account');
    accountList.forEach(item => item.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const active = document.querySelector('.active');
    active.classList.toggle('active');
    element.classList.toggle('active');
    App.showPage('transactions', {account_id: element.dataset.id});
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `<li class="active account" data-id="${item.id}">
              <a href="#">
                <span>${item.name}</span> /
                <span>${item.sum} ₽</span>
              </a>
            </li>
          `;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    this.element.insertAdjacentHTML('beforeend', AccountsWidget.getAccountHTML(data));
  }
}
