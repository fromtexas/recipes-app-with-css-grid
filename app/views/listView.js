import {elements} from './base';

export const renderDeleteAllButton = () =>{ 
    const markup = `
    <li class="shopping__item" data-itemid="delete">
        <button class="btn-small recipe__btn recipe__btn--add shopping__delete-all">
            <svg class="search__icon">
                <use href="../../assets/img/icons.svg#icon-circle-with-cross"></use>
            </svg>
            <span>Delete All</span>
        </button>
    </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteAllItems = () => {
    elements.shopping.innerHTML = '';
};

export const renderItem = item => {
    const markup = `
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="../../assets/img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);

    item.parentElement.removeChild(item);
};