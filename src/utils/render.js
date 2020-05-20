/* eslint-disable valid-jsdoc */
/**
 * Функция для создания элемента из шаблонной строки
 * @param {String} template Шаблонная строка
 */
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/** Функция для рендеринга компонентов
* @param {Element} container Блок, внутри которого будет рендериться компонент
* @param {*} component Компонент, который нужно отрендерить
* @param {String} place Положение компонента относительно контейнера
*/
const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.AFTEREND:
      container.after(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

const renderElementToElement = (parent, child, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    default:
      throw new Error(`RenderPosition is invalid`);
  }
};

/**
 * Функция для замены одного компонента на другой
 * @param {*} newComponent Новый компонент
 * @param {*} oldComponent Старый компонент
 */
const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

const replaceElement = (newElement, oldElement) => {
  const parentElement = oldElement.parentElement;

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

/**
 * Функция для удаления одного компонента
 * @param {*} component Компонент
 */
const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

/** Позиция относительно элемента, в который мы отрисовываем данные */
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`,
};

export {createElement, render, renderElementToElement, replace, replaceElement, remove};
